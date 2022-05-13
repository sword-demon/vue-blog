---
title: 'Go程序是如何运行的'
date: 2022-05-13 22:08:15
# 永久链接
permalink: '/Go-core/how2run'
sidebar: 'auto'
isShowComment: true
categories:
 - Go-core
tags:
 - null
---

## Go程序是如何运行的



### Go程序的入口？

-   `main`方法？



![rukou](https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/4021/20220513221140.png)



我这里是`mac m1`是`arm64`架构的，真正的入口是这几个文件

-   `rt0`：runtime的入口
-   `linux`：哪个操作系统
-   `amd64/arm64`：什么架构的芯片



如果是linux-amd64的，入口文件则为

```c
#include "textflag.h"

TEXT _rt0_amd64_linux(SB),NOSPLIT,$-8
	JMP	_rt0_amd64(SB)

TEXT _rt0_amd64_linux_lib(SB),NOSPLIT,$0
	JMP	_rt0_amd64_lib(SB)
```

都会进入`_rt0_amd64`这个方法去启动程序，这个是一个汇编语言。



<span style="color: red;font-size: 32px;">所以go程序的入口是以`runtime/rt0_xxx.s`这样的文件为入口的</span>



接下来，执行`_rt0_amd64`方法，我们可以进行全局搜索：

找到`asm_amd64.s`文件里

```c
TEXT _rt0_amd64(SB),NOSPLIT,$-8
	MOVQ	0(SP), DI	// argc
	LEAQ	8(SP), SI	// argv
	JMP	runtime·rt0_go(SB)
```

这个方法就两行有意义的代码，就是将`argc`和`argv`放到寄存器里，就是一些命令行的参数;

下面就调用`runtime.rt0_go`方法，这个方法里有一个地方：

```c
TEXT runtime·rt0_go(SB),NOSPLIT|TOPFRAME,$0
	// copy arguments forward on an even stack
	MOVQ	DI, AX		// argc
	MOVQ	SI, BX		// argv
	SUBQ	$(4*8+7), SP		// 2args 2auto
	ANDQ	$~15, SP
	MOVQ	AX, 16(SP)
	MOVQ	BX, 24(SP)

	// create istack out of the given (operating system) stack.
	// _cgo_init may update stackguard.
	MOVQ	$runtime·g0(SB), DI
	LEAQ	(-64*1024+104)(SP), BX
	MOVQ	BX, g_stackguard0(DI)
	MOVQ	BX, g_stackguard1(DI)
	MOVQ	BX, (g_stack+stack_lo)(DI)
	MOVQ	SP, (g_stack+stack_hi)(DI)
```

**它会初始化`g0`协程的执行栈，go程序的第一个协程，它是为了调度协程而产生的协程。**



### 运行时检测

中间会有一堆的检查，直接跳过，我们走到

```c
	CLD				// convention is D is always left cleared
	CALL	runtime·check(SB)
```

这里真正执行了go的一个方法，称呼为“运行时检测”：

-   检查各种类型的长度
-   检查指针操作
-   检查结构体字段的偏移量
-   检查`atomic`原子操作
-   检查`CAS`操作
-   检查栈大小是否是2的幂次



### 参数初始化`runtime.args`

```c
# 参数初始化
CALL    runtime·args(SB)
CALL   runtime·osinit(SB)
    
```

-   对命令行中的参数进行处理
-   参数数量赋值给`argc int32`
-   参数值赋值给`argv **byte`



### 调度器初始化

```c
# 调度器初始化
CALL   runtime·schedinit(SB)
```

-   全局栈空间内存分配
-   加载命令行参数到`os.Args`
-   堆内存空间的初始化
-   加载操作系统环境变量
-   初始化当前系统线程
-   垃圾回收器的参数初始化
-   算法初始化(map、hash)
-   设置`process`数量，p结构体的数量



### 创建主协程

```c
// create a new goroutine to start program
	MOVQ	$runtime·mainPC(SB), AX		// entry
	PUSHQ	AX
	PUSHQ	$0			// arg size
	CALL	runtime·newproc(SB)
	POPQ	AX
	POPQ	AX
```

`mainPC`就是`runtime.main`方法的地址，调用了`newproc`就是`go`启动协程的关键字，也就是说来启动一个新协程，用来运行`runtime.manPC`方法，但是没有进行调度。



初始化一个`M`，用来调度主协程

```c
// start this M
	CALL	runtime·mstart(SB)

	CALL	runtime·abort(SB)	// mstart should never return
	RET
```

接下来就是主协程来执行`runtime.main`函数

```c
// mainPC is a function value for runtime.main, to be passed to newproc.
// The reference to runtime.main is made via ABIInternal, since the
// actual function (not the ABI0 wrapper) is needed by newproc.
DATA	runtime·mainPC+0(SB)/8,$runtime·main<ABIInternal>(SB)
GLOBL	runtime·mainPC(SB),RODATA,$8
```



会遇到一个比较重要的go代码

```go
//go:linkname main_main main.main
func main_main()
```

`go:linkname`：在编译的第二个阶段，链接器就会把它链接到 `main.main`就是我们用户自己写的`main`包下的`main`方法，这样用户的程序就跑起来了。



**主协程执行主函数的操作内容**

-   执行runtime包的`init`方法
-   启动`gc`垃圾回收器
-   执行用户包依赖的`init`方法
-   执行用户主函数`main.main()`





## 总结

-   Go启动时经历了检查、各种初始化、初始化协程调度的过程
-   `main.main()`也是在协程中运行的，还是在主协程中运行的，是第二个协程，第一个协程时`g0`



## 问题

-   调度器是什么
-   为什么初始化M
-   为什么不是直接执行`main.main()`，而是将其放入调度器



## 体会

>   Go程序启动过程像不像一个虚拟机，或者框架，围绕着用户的main方法去启动，加载一堆组件和初始化一堆内容。

