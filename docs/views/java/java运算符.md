---
title: 'java运算符'
date: 2021-10-31 09:29:15
# 永久链接
permalink: '/java/calc/'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## Java运算符

额，一些基本的自增自减啥的，加减乘除啥的，就略过了。



<!-- more -->



## 逻辑运算符

-   与
    -   和前面说的与两个($)符号的的不一样，这个是一个符号的，下面也都是一个符号的
    -   两个都为1的运算才为1
-   或
    -   两个运算有1的都为1，0还是0
-   非
    -   1则为0，0则为1
-   异或
    -   相同则为0，不同则为1



位运算举例：

```
A = 0011 1100
B = 0000 1101

A & B 0000 1100 A与B
A | B 0011 1101 A或B
A ^ B 0011 0001 A异或B
~B    1111 0010 取反
```



---

左移右移运算符

-   `<<` 左移 相当于 `*2`
-   `>>`右移相当于`/2`

案例：`2 * 8`怎么运算最快？

`2 * 2 * 2 * 2 `这样是最快的，就相当于向左移三位

```java
System.out.println(2 << 3);
```



## 三元运算符

>x ? y : z 如果x==true，则结果为y，否则结果为z

就是将`if else`简化了 一个过程

```java
package com;

import java.util.Scanner;

public class Demo08 {
    public static void main(String[] args) {
        // 三元运算符
        // x ? y : z 如果x==true，则结果为y，否则结果为z

        int score;
        Scanner scanner = new Scanner(System.in);
        score = scanner.nextInt();
        String result = score < 60 ? "不及格" : "及格";
        System.out.println(result);
    }
}

```



## 优先级问题

说实在的也没啥必要，一开始不能理解的，就进行加括号即可。