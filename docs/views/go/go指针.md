---
title: 'go指针'
date: 2021-10-13 22:49:15
# 永久链接
permalink: '/go/pointer'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - pointer
---



:::tip

指针，存储的是一个变量的内存地址

:::

## 指针的作用

1.   节省内存空间，提高程序执行效率
2.   间接访问与修改变量的值



## 指针的运算和多级指针

修改变量的值

```go
package main

import "fmt"

func main() {
	var intVariables int = 100

	fmt.Printf("intVariables的值=%d,地址=%v\n", intVariables, &intVariables)

	var pointerVariables *int = &intVariables
	fmt.Printf("pointerVariables=%d,地址=%v\n", pointerVariables, &pointerVariables)

	// 修改变量的值
	*pointerVariables = 200

	fmt.Println(*pointerVariables)
}

```



### 值类型

-   整型
-   浮点型
-   bool
-   数组
-   string



:::tip

值类型在栈中进行分配

:::



### 引用类型

-   指针
-   slice
-   map
-   chan
-   interface

:::tip

引用类型在堆中进行分配

:::



>   当我们定义一个指针的时候，并未分配任何变量，它的默认值是`nil`，如果通过`*变量 = 10`来赋值，会报错。



