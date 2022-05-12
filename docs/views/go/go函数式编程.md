---
title: 'go函数式编程'
date: 2022-03-22 21:22:15
# 永久链接
permalink: '/go/func'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - null
---



## 函数与闭包

-   函数是一等公民：参数、变量，返回值都可以是函数
-   高阶函数
-   函数 -> 闭包



### ”正统“函数式编程

-   不可变性：不能有状态，只有常量和函数
-   函数只能有一个参数



小案例：累加器函数

```go
package main

import "fmt"

func adder() func(int) int {
	sum := 0
	return func(v int) int {
		sum += v
		return sum
	}
}

func main() {
	a := adder()
	for i := 0; i < 10; i++ {
		fmt.Println(a(i))
	}
}

```

![闭包](https://gitee.com/wxvirus/img/raw/master/img/20220323214433.png)



这里，`sum`是一个自由变量，`sum`变量会保存在这个闭包里。



稍微正统的函数式写法：

```go
type iAdder func(int) (int, iAdder)

func adder2(base int) iAdder {
	return func(v int) (int, iAdder) {
		return base + v, adder2(base + v)
	}
}

func main() {
	a := adder2(0)
	for i := 0; i < 10; i++ {
		var s int
		s, a = a(i)
		fmt.Printf("0 + 1 + ... + %d = %d\n", i, s)
	}
}
```



### python中的闭包

```python
def adder():
    sum = 0
    def f(value):
        nonlocal sum
        sum += value
        return sum
    return f
```

-   `python`原生支持闭包
-   使用`__closure__`来查询闭包内容



### C++中的闭包

```c++
auto adder() {
    auto sum = 0;
    return [=] (int value) mutable {
        sum += value;
        return sum
    };
}
```

-   过去：`STL`或者`boost`带有类似库
-   C++11及以后：支持闭包



### Java中的闭包

```java
Function<Integer, Integer> adder() {
    final Holder<Integer> sum = new Holder<>(0);
    return (Integer value) -> {
        sum.value += value;
        return sum.value;
    }
}
```



-   jdk1.8以后：使用`Function`接口和`Lambda`表达式来创建函数对象
-   匿名类或者`Lambda`表达式均支持闭包



## go语言闭包的应用



### 斐波那契数列

```go
package main

import "fmt"

// 1, 1, 2, 3, 5, 8, 13...
// 	  a, b
//       a a+b
func fibonacci() func() int {
	a, b := 0, 1
	return func() int {
		a, b = b, a+b
		return a
	}
}

func main() {
	f := fibonacci()

	fmt.Println(f())
	fmt.Println(f())
	fmt.Println(f())
	fmt.Println(f())
	fmt.Println(f())
	fmt.Println(f())
	fmt.Println(f())
	fmt.Println(f())
	fmt.Println(f())
}

```



给函数实现接口

```go
package main

import (
	"bufio"
	"fmt"
	"io"
	"strings"
)

// 1, 1, 2, 3, 5, 8, 13...
// 	  a, b
//       a a+b
func fibonacci() intGen {
	a, b := 0, 1
	return func() int {
		a, b = b, a+b
		return a
	}
}

type intGen func() int

func (g intGen) Read(p []byte) (n int, err error) {
	// 取得下一个元素
	next := g()
	if next > 10000 {
		return 0, io.EOF
	}
	// 把下一个元素写进 p []byte
	s := fmt.Sprintf("%d\n", next)
    // TODO: incorrect if p is too small!
	return strings.NewReader(s).Read(p)
}

func printFileContents(reader io.Reader) {
	scanner := bufio.NewScanner(reader)

	for scanner.Scan() {
		fmt.Println(scanner.Text())
	}
}

func main() {
	f := fibonacci()

	printFileContents(f)
}

```



### 使用函数来遍历二叉树

```go
package tree

import "fmt"

func (node *Node) Traverse() {
	node.TraverseFunc(func(n *Node) {
		n.Print()
	})
	fmt.Println()
}

func (node *Node) TraverseFunc(f func(*Node)) {
	if node == nil {
		return
	}
	// 中序遍历 左中右
	node.Left.TraverseFunc(f)
	f(node)
	node.Right.TraverseFunc(f)
}

```



<span style="color: green;font-size: 30px;">go语言闭包的应用</span>：

-   更为自然，不需要修饰如何访问自由变量
-   没有`Lambda`表达式，但是有匿名函数





## defer调用

-   确保调用在函数结束时发生

-   参数在`defer`语句时计算

    ```go
    func tryDefer() {
    	for i := 0; i < 100; i++ {
    		defer fmt.Println(i)
    		if i== 30 {
    			panic("printed to many")
    		}
    	}
    }
    ```

    它只会打印`0~30`，因为是后进先出，所以是倒过来的**30~0**

-   `defer`列表为后进先出，和栈的含义类似



>   何时使用`defer`调用

-   `Open/Close`
-   `Lock/Unlock`
-   `PrintHeader/PrintFooter`



>   写文件关资源案例：

```go
func fib() func() int {
	a, b := 0, 1
	return func() int {
		a, b = b, a+b
		return a
	}
}

func writeFile(filename string) {
	// 打开一个文件
	file, err := os.Create(filename)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	// 先写到内存里
	writer := bufio.NewWriter(file)
	// 刷到硬盘里
	defer writer.Flush()

	f := fib()
	for i := 0; i < 20; i++ {
		_, err := fmt.Fprintln(writer, f())
		if err != nil {
			return
		}
	}
}
```



## 函数类型和函数签名

>   只要以`type`关键字开头的都是定义类型。

```go
type f func() // 自定义类型 类型名 f 具体是一个函数类型 没有参数没有返回值
```

