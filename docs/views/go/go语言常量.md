---
title: 'go语言常量'
date: 2021-10-12 23:10:15
# 永久链接
permalink: '/go/const'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - const
---



## 常量概述

>   指的是在整个程序运行期间，它的值都不会发生改变。



<!-- more -->



### 定义和使用

常量的关键字：`const`

```go
const constVariables1 float64 = 3.1415926

const constVariables2, constVariables3 = 100, "无解" // 编辑器编译期的一个行为
```



特殊的常量`iota`

```go
const (
	iota1 = iota // 0
    iota2 = iota // 1
    iota3 = iota // 2
)

const iota4 = iota // 0
```

:::tip

`iota`在每次const出现的第一次的时候被重置为0，后续的连续的会进行+1

:::



## 常量的作用与应用场景

>   传统的编程语言中都有枚举类型，`enum`关键字用来声明枚举类型。go语言中可以使用const来定义一个常用的枚举的内容

```go
const (
	Monday = iota
    Tuesday
    Wednesday
    Thursday
    Friday
    Saturday
    Sunday
)

// 0 1 2 3 4 5 6  可以很好的用来表现星期对应的数字
```



```go
const (
	iota1, iota2, iota3 = iota, iota, iota // 都是0
)
```



```go
const (
	iota1 = iota // 0
    iota2 = "wujie" // wujie
    iota3 = iota // 2
)
```

:::tip

如果第二个不是iota的连续下去的，它会跳过那个数字

:::

