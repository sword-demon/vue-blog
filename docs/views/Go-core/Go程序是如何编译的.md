---
title: 'Go程序是如何编译的'
date: 2022-05-13 21:42:15
# 永久链接
permalink: '/Go-core/compile'
sidebar: 'auto'
isShowComment: true
categories:
 - Go-core
tags:
 - compile
---



## Go程序是如何编译的

我们可以使用`go build -n`命令来查看一段简单的代码的编译过程

```go
package main

import "fmt"

func main() {
	fmt.Println("hello world")
}

```

不同平台会有不同的编译输出内容

```
#
# command-line-arguments
#

mkdir -p $WORK/b001/
cat >$WORK/b001/_gomod_.go << 'EOF' # internal
package main
import _ "unsafe"
//go:linkname __debug_modinfo__ runtime.modinfo
var __debug_modinfo__ = "0w\xaf\f\x92t\b\x02A\xe1\xc1\a\xe6\xd6\x18\xe6path\tcommand-line-arguments\nmod\trpc-test\t(devel)\t\n\xf92C1\x86\x18 r\x00\x82B\x10A\x16\xd8\xf2"
EOF
cat >$WORK/b001/importcfg << 'EOF' # internal
# import config
packagefile fmt=/usr/local/go/pkg/darwin_arm64/fmt.a
packagefile runtime=/usr/local/go/pkg/darwin_arm64/runtime.a
EOF
cd /Users/wujie/GolangProjects/src/rpc-test/demo
/usr/local/go/pkg/tool/darwin_arm64/compile -o $WORK/b001/_pkg_.a -trimpath "$WORK/b001=>" -shared -p main -lang=go1.17 -complete -buildid z6kI6nBzEUeSZK47HxuV/z6kI6nBzEUeSZK47HxuV -goversion go1.17.8 -D _/Users/wujie/GolangProjects/src/rpc-test/demo -importcfg $WORK/b001/importcfg -pack ./demo3.go $WORK/b001/_gomod_.go
/usr/local/go/pkg/tool/darwin_arm64/buildid -w $WORK/b001/_pkg_.a # internal
cat >$WORK/b001/importcfg.link << 'EOF' # internal
packagefile command-line-arguments=$WORK/b001/_pkg_.a
packagefile fmt=/usr/local/go/pkg/darwin_arm64/fmt.a
packagefile runtime=/usr/local/go/pkg/darwin_arm64/runtime.a
packagefile errors=/usr/local/go/pkg/darwin_arm64/errors.a
packagefile internal/fmtsort=/usr/local/go/pkg/darwin_arm64/internal/fmtsort.a
packagefile io=/usr/local/go/pkg/darwin_arm64/io.a
packagefile math=/usr/local/go/pkg/darwin_arm64/math.a
packagefile os=/usr/local/go/pkg/darwin_arm64/os.a
packagefile reflect=/usr/local/go/pkg/darwin_arm64/reflect.a
packagefile strconv=/usr/local/go/pkg/darwin_arm64/strconv.a
packagefile sync=/usr/local/go/pkg/darwin_arm64/sync.a
packagefile unicode/utf8=/usr/local/go/pkg/darwin_arm64/unicode/utf8.a
packagefile internal/abi=/usr/local/go/pkg/darwin_arm64/internal/abi.a
packagefile internal/bytealg=/usr/local/go/pkg/darwin_arm64/internal/bytealg.a
packagefile internal/cpu=/usr/local/go/pkg/darwin_arm64/internal/cpu.a
packagefile internal/goexperiment=/usr/local/go/pkg/darwin_arm64/internal/goexperiment.a
packagefile runtime/internal/atomic=/usr/local/go/pkg/darwin_arm64/runtime/internal/atomic.a
packagefile runtime/internal/math=/usr/local/go/pkg/darwin_arm64/runtime/internal/math.a
packagefile runtime/internal/sys=/usr/local/go/pkg/darwin_arm64/runtime/internal/sys.a
packagefile internal/reflectlite=/usr/local/go/pkg/darwin_arm64/internal/reflectlite.a
packagefile sort=/usr/local/go/pkg/darwin_arm64/sort.a
packagefile math/bits=/usr/local/go/pkg/darwin_arm64/math/bits.a
packagefile internal/itoa=/usr/local/go/pkg/darwin_arm64/internal/itoa.a
packagefile internal/oserror=/usr/local/go/pkg/darwin_arm64/internal/oserror.a
packagefile internal/poll=/usr/local/go/pkg/darwin_arm64/internal/poll.a
packagefile internal/syscall/execenv=/usr/local/go/pkg/darwin_arm64/internal/syscall/execenv.a
packagefile internal/syscall/unix=/usr/local/go/pkg/darwin_arm64/internal/syscall/unix.a
packagefile internal/testlog=/usr/local/go/pkg/darwin_arm64/internal/testlog.a
packagefile internal/unsafeheader=/usr/local/go/pkg/darwin_arm64/internal/unsafeheader.a
packagefile io/fs=/usr/local/go/pkg/darwin_arm64/io/fs.a
packagefile sync/atomic=/usr/local/go/pkg/darwin_arm64/sync/atomic.a
packagefile syscall=/usr/local/go/pkg/darwin_arm64/syscall.a
packagefile time=/usr/local/go/pkg/darwin_arm64/time.a
packagefile unicode=/usr/local/go/pkg/darwin_arm64/unicode.a
packagefile internal/race=/usr/local/go/pkg/darwin_arm64/internal/race.a
packagefile path=/usr/local/go/pkg/darwin_arm64/path.a
EOF
mkdir -p $WORK/b001/exe/
cd .
/usr/local/go/pkg/tool/darwin_arm64/link -o $WORK/b001/exe/a.out -importcfg $WORK/b001/importcfg.link -buildmode=exe -buildid=HyEwprdTF5HC5t9zYVBP/z6kI6nBzEUeSZK47HxuV/z6kI6nBzEUeSZK47HxuV/HyEwprdTF5HC5t9zYVBP -extld=clang $WORK/b001/_pkg_.a
/usr/local/go/pkg/tool/darwin_arm64/buildid -w $WORK/b001/exe/a.out # internal
mv $WORK/b001/exe/a.out demo3

```

它会经过下面几个步骤：

-   词法分析
-   句法分析
-   语义分析
-   中间码生成
-   代码优化
-   机器码生成
-   链接



### 词法分析

-   将源代码翻译成`Token`
-   `Token`是代码中的最小语义结构，为了下一步句法分析



### 句法分析

>   `Token`序列经过处理，变成语法树

![语法树](https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/4021/20220513214940.png)



### 语义分析

-   类型检查
-   类型推断，推断变量的类型
-   查看类型是否匹配
-   函数调用内联
-   逃逸分析(变量是在堆上还是在栈上)



### 中间码生成(SSA)

>   为了处理不同平台的差异 ，先生成中间码(SSA)，看起来非常像汇编语言，其实不是。类似下图的内容：

![SSA](https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/4021/20220513215210.png)

查看从代码到SSA中间码的整个过程：

```bash
windows:powershell: $env:GOSSAFUNC="main"
linux or mac: export GOSSAFUNC=main

# 最后执行
go build
```

```bash
➜ go build demo3.go   
# runtime
dumped SSA to /Users/wujie/GolangProjects/src/rpc-test/demo/ssa.html
# command-line-arguments
dumped SSA to ./ssa.html

```

![ssa](https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/4021/20220513215545.png)

生成的`ssa.html`即上述样子，我们可以分别点开去查看。





### 代码优化

>   其实上述每一步可能都会有代码优化



### 机器码生成

-   先生成`Plan9`汇编代码，就是和平台相关的代码。

-   最后编译为机器码

-   输出的机器码为`.a`文件

-   查看`Plan9`汇编代码

    ```bash
    go build -gcflags -S demo3.go
    ```



```
➜ go build -gcflags -S demo3.go
# runtime
dumped SSA to /Users/wujie/GolangProjects/src/rpc-test/demo/ssa.html
# command-line-arguments
dumped SSA to ./ssa.html
"".main STEXT size=144 args=0x0 locals=0x58 funcid=0x0
        0x0000 00000 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       TEXT    "".main(SB), ABIInternal, $96-0
        0x0000 00000 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       MOVD    16(g), R1
        0x0004 00004 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       PCDATA  $0, $-2
        0x0004 00004 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       MOVD    RSP, R2
        0x0008 00008 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       CMP     R1, R2
        0x000c 00012 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       BLS     120
        0x0010 00016 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       PCDATA  $0, $-1
        0x0010 00016 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       MOVD.W  R30, -96(RSP)
        0x0014 00020 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       MOVD    R29, -8(RSP)
        0x0018 00024 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       SUB     $8, RSP, R29
        0x001c 00028 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       FUNCDATA        ZR, gclocals·33cdeccccebe80329f1fdbee7f5874cb(SB)
        0x001c 00028 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       FUNCDATA        $1, gclocals·f207267fbf96a0178e8758c6e3e0ce28(SB)
        0x001c 00028 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       FUNCDATA        $2, "".main.stkobj(SB)
        0x001c 00028 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:6)       STP     (ZR, ZR), ""..autotmp_9-16(SP)
        0x0020 00032 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:6)       MOVD    $type.string(SB), R0
        0x0028 00040 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:6)       MOVD    R0, ""..autotmp_9-16(SP)
        0x002c 00044 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:6)       MOVD    $""..stmp_0(SB), R0
        0x0034 00052 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:6)       MOVD    R0, ""..autotmp_9-8(SP)
        0x0038 00056 (<unknown line number>)    NOP
        0x0038 00056 ($GOROOT/src/fmt/print.go:274)     MOVD    $os.Stdout(SB), R0
        0x0040 00064 ($GOROOT/src/fmt/print.go:274)     MOVD    (R0), R0
        0x0044 00068 ($GOROOT/src/fmt/print.go:274)     MOVD    $go.itab.*os.File,io.Writer(SB), R1
        0x004c 00076 ($GOROOT/src/fmt/print.go:274)     MOVD    R1, 8(RSP)
        0x0050 00080 ($GOROOT/src/fmt/print.go:274)     MOVD    R0, 16(RSP)
        0x0054 00084 ($GOROOT/src/fmt/print.go:274)     MOVD    $""..autotmp_9-16(SP), R0
        0x0058 00088 ($GOROOT/src/fmt/print.go:274)     MOVD    R0, 24(RSP)
        0x005c 00092 ($GOROOT/src/fmt/print.go:274)     MOVD    $1, R0
        0x0060 00096 ($GOROOT/src/fmt/print.go:274)     MOVD    R0, 32(RSP)
        0x0064 00100 ($GOROOT/src/fmt/print.go:274)     MOVD    R0, 40(RSP)
        0x0068 00104 ($GOROOT/src/fmt/print.go:274)     PCDATA  $1, ZR
        0x0068 00104 ($GOROOT/src/fmt/print.go:274)     CALL    fmt.Fprintln(SB)
        0x006c 00108 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:7)       MOVD    -8(RSP), R29
        0x0070 00112 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:7)       MOVD.P  96(RSP), R30
        0x0074 00116 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:7)       RET     (R30)
        0x0078 00120 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:7)       NOP
        0x0078 00120 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       PCDATA  $1, $-1
        0x0078 00120 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       PCDATA  $0, $-2
        0x0078 00120 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       MOVD    R30, R3
        0x007c 00124 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       CALL    runtime.morestack_noctxt(SB)
        0x0080 00128 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       PCDATA  $0, $-1
        0x0080 00128 (/Users/wujie/GolangProjects/src/rpc-test/demo/demo3.go:5)       JMP     0
        0x0000 81 0b 40 f9 e2 03 00 91 5f 00 01 eb 69 03 00 54  ..@....._...i..T
        0x0010 fe 0f 1a f8 fd 83 1f f8 fd 23 00 d1 ff ff 04 a9  .........#......
        0x0020 00 00 00 90 00 00 00 91 e0 27 00 f9 00 00 00 90  .........'......
        0x0030 00 00 00 91 e0 2b 00 f9 00 00 00 90 00 00 00 91  .....+..........
        0x0040 00 00 40 f9 01 00 00 90 21 00 00 91 e1 07 00 f9  ..@.....!.......
        0x0050 e0 0b 00 f9 e0 23 01 91 e0 0f 00 f9 e0 03 40 b2  .....#........@.
        0x0060 e0 13 00 f9 e0 17 00 f9 00 00 00 94 fd 83 5f f8  .............._.
        0x0070 fe 07 46 f8 c0 03 5f d6 e3 03 1e aa 00 00 00 94  ..F..._.........
        0x0080 e0 ff ff 17 00 00 00 00 00 00 00 00 00 00 00 00  ................
        rel 0+0 t=24 type.string+0
        rel 0+0 t=24 type.*os.File+0
        rel 32+8 t=3 type.string+0
        rel 44+8 t=3 ""..stmp_0+0
        rel 56+8 t=3 os.Stdout+0
        rel 68+8 t=3 go.itab.*os.File,io.Writer+0
        rel 104+4 t=9 fmt.Fprintln+0
        rel 124+4 t=9 runtime.morestack_noctxt+0
os.(*File).close STEXT dupok size=32 args=0x18 locals=0x0 funcid=0x0 leaf
        0x0000 00000 (<autogenerated>:1)        TEXT    os.(*File).close(SB), DUPOK|LEAF|NOFRAME|ABIInternal, $0-24
        0x0000 00000 (<autogenerated>:1)        FUNCDATA        ZR, gclocals·e6397a44f8e1b6e77d0f200b4fba5269(SB)
        0x0000 00000 (<autogenerated>:1)        FUNCDATA        $1, gclocals·69c1753bd5f81501d95132d08af04464(SB)
        0x0000 00000 (<autogenerated>:1)        FUNCDATA        $5, os.(*File).close.arginfo1(SB)
        0x0000 00000 (<autogenerated>:1)        MOVD    ""..this(FP), R0
        0x0004 00004 (<autogenerated>:1)        MOVD    (R0), R0
        0x0008 00008 (<autogenerated>:1)        MOVD    R0, ""..this(FP)
        0x000c 00012 (<autogenerated>:1)        STP     (ZR, ZR), "".~r0+8(FP)
        0x0010 00016 (<autogenerated>:1)        JMP     os.(*file).close(SB)
        0x0000 e0 07 40 f9 00 00 40 f9 e0 07 00 f9 ff 7f 01 a9  ..@...@.........
        0x0010 00 00 00 14 00 00 00 00 00 00 00 00 00 00 00 00  ................
        rel 16+4 t=9 os.(*file).close+0
go.cuinfo.producer.main SDWARFCUINFO dupok size=0
        0x0000 2d 73 68 61 72 65 64                             -shared
go.cuinfo.packagename.main SDWARFCUINFO dupok size=0
        0x0000 6d 61 69 6e                                      main
go.string."0w\xaf\f\x92t\b\x02A\xe1\xc1\a\xe6\xd6\x18\xe6path\tcommand-line-arguments\nmod\trpc-test\t(devel)\t\n\xf92C1\x86\x18 r\x00\x82B\x10A\x16\xd8\xf2" SRODATA dupok size=82
        0x0000 30 77 af 0c 92 74 08 02 41 e1 c1 07 e6 d6 18 e6  0w...t..A.......
        0x0010 70 61 74 68 09 63 6f 6d 6d 61 6e 64 2d 6c 69 6e  path.command-lin
        0x0020 65 2d 61 72 67 75 6d 65 6e 74 73 0a 6d 6f 64 09  e-arguments.mod.
        0x0030 72 70 63 2d 74 65 73 74 09 28 64 65 76 65 6c 29  rpc-test.(devel)
        0x0040 09 0a f9 32 43 31 86 18 20 72 00 82 42 10 41 16  ...2C1.. r..B.A.
        0x0050 d8 f2                                            ..
""..inittask SNOPTRDATA size=32
        0x0000 00 00 00 00 00 00 00 00 01 00 00 00 00 00 00 00  ................
        0x0010 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
        rel 24+8 t=1 fmt..inittask+0
go.info.fmt.Println$abstract SDWARFABSFCN dupok size=42
        0x0000 04 66 6d 74 2e 50 72 69 6e 74 6c 6e 00 01 01 11  .fmt.Println....
        0x0010 61 00 00 00 00 00 00 11 6e 00 01 00 00 00 00 11  a.......n.......
        0x0020 65 72 72 00 01 00 00 00 00 00                    err.......
        rel 0+0 t=23 type.[]interface {}+0
        rel 0+0 t=23 type.error+0
        rel 0+0 t=23 type.int+0
        rel 19+4 t=31 go.info.[]interface {}+0
        rel 27+4 t=31 go.info.int+0
        rel 37+4 t=31 go.info.error+0
go.string."hello world" SRODATA dupok size=11
        0x0000 68 65 6c 6c 6f 20 77 6f 72 6c 64                 hello world
runtime.modinfo SDATA size=16
        0x0000 00 00 00 00 00 00 00 00 52 00 00 00 00 00 00 00  ........R.......
        rel 0+8 t=1 go.string."0w\xaf\f\x92t\b\x02A\xe1\xc1\a\xe6\xd6\x18\xe6path\tcommand-line-arguments\nmod\trpc-test\t(devel)\t\n\xf92C1\x86\x18 r\x00\x82B\x10A\x16\xd8\xf2"+0
go.info.runtime.modinfo SDWARFVAR dupok size=32
        0x0000 08 72 75 6e 74 69 6d 65 2e 6d 6f 64 69 6e 66 6f  .runtime.modinfo
        0x0010 00 09 03 00 00 00 00 00 00 00 00 00 00 00 00 01  ................
        rel 19+8 t=1 runtime.modinfo+0
        rel 27+4 t=31 go.info.string+0
""..stmp_0 SRODATA static size=16
        0x0000 00 00 00 00 00 00 00 00 0b 00 00 00 00 00 00 00  ................
        rel 0+8 t=1 go.string."hello world"+0
runtime.nilinterequal·f SRODATA dupok size=8
        0x0000 00 00 00 00 00 00 00 00                          ........
        rel 0+8 t=1 runtime.nilinterequal+0
runtime.memequal64·f SRODATA dupok size=8
        0x0000 00 00 00 00 00 00 00 00                          ........
        rel 0+8 t=1 runtime.memequal64+0
runtime.gcbits.01 SRODATA dupok size=1
        0x0000 01                                               .
type..namedata.*interface {}- SRODATA dupok size=15
        0x0000 00 0d 2a 69 6e 74 65 72 66 61 63 65 20 7b 7d     ..*interface {}
type.*interface {} SRODATA dupok size=56
        0x0000 08 00 00 00 00 00 00 00 08 00 00 00 00 00 00 00  ................
        0x0010 4f 0f 96 9d 08 08 08 36 00 00 00 00 00 00 00 00  O......6........
        0x0020 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
        0x0030 00 00 00 00 00 00 00 00                          ........
        rel 24+8 t=1 runtime.memequal64·f+0
        rel 32+8 t=1 runtime.gcbits.01+0
        rel 40+4 t=5 type..namedata.*interface {}-+0
        rel 48+8 t=1 type.interface {}+0
runtime.gcbits.02 SRODATA dupok size=1
        0x0000 02                                               .
type.interface {} SRODATA dupok size=80
        0x0000 10 00 00 00 00 00 00 00 10 00 00 00 00 00 00 00  ................
        0x0010 e7 57 a0 18 02 08 08 14 00 00 00 00 00 00 00 00  .W..............
        0x0020 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
        0x0030 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
        0x0040 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
        rel 24+8 t=1 runtime.nilinterequal·f+0
        rel 32+8 t=1 runtime.gcbits.02+0
        rel 40+4 t=5 type..namedata.*interface {}-+0
        rel 44+4 t=-32763 type.*interface {}+0
        rel 56+8 t=1 type.interface {}+80
type..namedata.*[]interface {}- SRODATA dupok size=17
        0x0000 00 0f 2a 5b 5d 69 6e 74 65 72 66 61 63 65 20 7b  ..*[]interface {
        0x0010 7d                                               }
type.*[]interface {} SRODATA dupok size=56
        0x0000 08 00 00 00 00 00 00 00 08 00 00 00 00 00 00 00  ................
        0x0010 f3 04 9a e7 08 08 08 36 00 00 00 00 00 00 00 00  .......6........
        0x0020 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
        0x0030 00 00 00 00 00 00 00 00                          ........
        rel 24+8 t=1 runtime.memequal64·f+0
        rel 32+8 t=1 runtime.gcbits.01+0
        rel 40+4 t=5 type..namedata.*[]interface {}-+0
        rel 48+8 t=1 type.[]interface {}+0
type.[]interface {} SRODATA dupok size=56
        0x0000 18 00 00 00 00 00 00 00 08 00 00 00 00 00 00 00  ................
        0x0010 70 93 ea 2f 02 08 08 17 00 00 00 00 00 00 00 00  p../............
        0x0020 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
        0x0030 00 00 00 00 00 00 00 00                          ........
        rel 32+8 t=1 runtime.gcbits.01+0
        rel 40+4 t=5 type..namedata.*[]interface {}-+0
        rel 44+4 t=-32763 type.*[]interface {}+0
        rel 48+8 t=1 type.interface {}+0
type..namedata.*[1]interface {}- SRODATA dupok size=18
        0x0000 00 10 2a 5b 31 5d 69 6e 74 65 72 66 61 63 65 20  ..*[1]interface 
        0x0010 7b 7d                                            {}
type.*[1]interface {} SRODATA dupok size=56
        0x0000 08 00 00 00 00 00 00 00 08 00 00 00 00 00 00 00  ................
        0x0010 bf 03 a8 35 08 08 08 36 00 00 00 00 00 00 00 00  ...5...6........
        0x0020 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
        0x0030 00 00 00 00 00 00 00 00                          ........
        rel 24+8 t=1 runtime.memequal64·f+0
        rel 32+8 t=1 runtime.gcbits.01+0
        rel 40+4 t=5 type..namedata.*[1]interface {}-+0
        rel 48+8 t=1 type.[1]interface {}+0
type.[1]interface {} SRODATA dupok size=72
        0x0000 10 00 00 00 00 00 00 00 10 00 00 00 00 00 00 00  ................
        0x0010 50 91 5b fa 02 08 08 11 00 00 00 00 00 00 00 00  P.[.............
        0x0020 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
        0x0030 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
        0x0040 01 00 00 00 00 00 00 00                          ........
        rel 24+8 t=1 runtime.nilinterequal·f+0
        rel 32+8 t=1 runtime.gcbits.02+0
        rel 40+4 t=5 type..namedata.*[1]interface {}-+0
        rel 44+4 t=-32763 type.*[1]interface {}+0
        rel 48+8 t=1 type.interface {}+0
        rel 56+8 t=1 type.[]interface {}+0
go.itab.*os.File,io.Writer SRODATA dupok size=32
        0x0000 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
        0x0010 44 b5 f3 33 00 00 00 00 00 00 00 00 00 00 00 00  D..3............
        rel 0+8 t=1 type.io.Writer+0
        rel 8+8 t=1 type.*os.File+0
        rel 24+8 t=-32767 os.(*File).Write+0
type..importpath.fmt. SRODATA dupok size=5
        0x0000 00 03 66 6d 74                                   ..fmt
type..importpath.unsafe. SRODATA dupok size=8
        0x0000 00 06 75 6e 73 61 66 65                          ..unsafe
gclocals·33cdeccccebe80329f1fdbee7f5874cb SRODATA dupok size=8
        0x0000 01 00 00 00 00 00 00 00                          ........
gclocals·f207267fbf96a0178e8758c6e3e0ce28 SRODATA dupok size=9
        0x0000 01 00 00 00 02 00 00 00 00                       .........
"".main.stkobj SRODATA static size=32
        0x0000 01 00 00 00 00 00 00 00 f0 ff ff ff 10 00 00 00  ................
        0x0010 10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
        rel 24+8 t=1 runtime.gcbits.02+0
gclocals·e6397a44f8e1b6e77d0f200b4fba5269 SRODATA dupok size=10
        0x0000 02 00 00 00 03 00 00 00 01 00                    ..........
gclocals·69c1753bd5f81501d95132d08af04464 SRODATA dupok size=8
        0x0000 02 00 00 00 00 00 00 00                          ........
os.(*File).close.arginfo1 SRODATA static dupok size=3
        0x0000 00 08 ff                                         ...

```



### 链接

>   将各个包进行链接，包括`runtime`



我们只需要如何查看生成的中间码和`plan9`的码即可。