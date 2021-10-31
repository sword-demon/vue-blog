---
title: 'java方法'
date: 2021-10-31 19:32:15
# 永久链接
permalink: '/java/function/'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## 何谓方法

`System.out.println()`前面我们遇到的这个是是怎么呢？

-   System：是一个类
-   out：是一个输出对象
-   println：是一个方法



>   Java方法是语句的集合，它们在一起执行一个功能。

-   方法是解决一类问题的步骤的有序组合
-   方法包含于类或对象中
-   方法在程序中被创建，在其他地方被引用



:::tip

设计方法的原则：方法的本意是功能块，就是实现某个功能的语句块的集合。我们设计方法的时候，最好保持方法的原子性，**就是一个方法只完成一个功能，这样有利于我们后期的扩展。**

:::



<!-- more -->

## 方法的定义和调用

案例：

```java
package com.method;

public class Demo01 {

    // main 方法
    public static void main(String[] args) {
        int sum = add(1, 2);
        System.out.println(sum);
    }

    // 加法
    public static int add(int a, int b) {
        return a + b;
    }
}

```

