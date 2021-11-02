---
title: 'Arrays类'
date: 2021-11-03 00:06:15
# 永久链接
permalink: '/java/Arrays/'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



# Arrays类

>   数组的工具类`java.util.Arrays`

由于数组对象本身并没有什么方法可以供我们调用，但API中提供了一个工具类`Arrays`供我们使用，从而可以对数据对象进行一些基本的操作。



:::tip

`Arrays`类中的方法都是`static`修饰的静态方法，在使用的时候可以直接使用类名进行调用，而不用使用对象来调用，(**注意：是不用而不是不能**)。

:::



具有以下常用功能：

-   给数组赋值：通过`fill`方法
-   给数组排序：通过`sort`方法，按升序
-   比较数组：通过`equals`方法俺比较数组中元素是否相等
-   查找数组元素：通过`binarySearch`方法能对排序好的数组进行二分查找操作



## 打印数组

`toString`方法

```java
package com.array;

import java.util.Arrays;

public class ArraysDemo03 {
    public static void main(String[] args) {
        int[] a = {1, 2, 3, 423, 312, 312312, 4342342};

        System.out.println(a); // 对象

        // 打印数组元素
        System.out.println(Arrays.toString(a));

        printArray(a);
    }

    // 自己实现的打印数组元素
    public static void printArray(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            if (i == 0) {
                System.out.print("[");
            }
            if (i == arr.length - 1) {
                System.out.print(arr[i] + "]");
            } else {
                System.out.print(arr[i] + ", ");
            }
        }
        System.out.println();
    }
}

```



## 排序

```java
package com.array;

import java.util.Arrays;

public class ArraysDemo04 {
    public static void main(String[] args) {
        int[] a = {1, 2, 3, 423, 312, 312312, 4342342};

        // 打印数组元素
        System.out.println(Arrays.toString(a));

        // 数组排序
        Arrays.sort(a);
        System.out.println(Arrays.toString(a));
    }
}

```

