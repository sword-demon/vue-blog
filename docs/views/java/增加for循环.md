---
title: '增加for循环'
date: 2021-10-31 15:56:15
# 永久链接
permalink: '/java/foreach/'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---

## 增加for循环

>   Java5引入了一种主要用于数组或集合的增强型for循环

格式如下：

```java
for (声明语句 : 表达式) {
    // 代码语句
}
```

- 声明语句：声明新的局部变量，改变量的类型必须和数组元素的类型匹配，其作用域限定在循环语句块，其值与此时数组元素的值相等。
- 表达式：表达式是要访问的数组名，或者是返回值为数组的方法

**遍历数组的元素**

```java
package com.struct;

public class Demo01 {
    public static void main(String[] args) {
        // 定义了一个数组
        int[] nums = {10, 20, 30, 40, 50};
        for (int num : nums) {
            System.out.println(num);
        }
    }
}
```

## 流程控制练习

**打印三角形**(5行)

```java
package com.struct;

public class Test {

    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            // 空格部分
            for (int j = 5; j >= i; j--) {
                System.out.print(" ");
            }
            // 正三角(左边部分)
            for (int j = 1; j <= i; j++) {
                System.out.print("*");
            }
            // 反三角(右边部分)
            for (int j = 1; j < i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }
}
```
