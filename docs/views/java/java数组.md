---
title: 'java数组'
date: 2021-11-02 23:40:15
# 永久链接
permalink: '/java/array/'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## Java数组的三种初始化

### 静态初始化

` = 创建 + 赋值`

```java
int[] a = {1, 2, 3};
```



### 动态初始化

```java
int[] a = new int[2];
a[0] = 1;
a[1] = 2;
```

包含了默认初始化



### 数组默认初始化

>   数组是引用类型，它的元素相当于类的实例变量，因此数组一经分配空间，其中的每个元素也按照实例变量同样的方式被隐式初始化。



## 数组的四个基本特点

-   长度是确定的，数组一旦创建，它的大小就是不可以改变的
-   元素必须是相同类型的元素，不允许出现混合类型
-   数组中的元素可以是任何数据类型，包括基本类型和引用类型
-   数组变量属于引用类型，数组也可以看出对象，数组中的每个元素相当于该对象的成员变量。

数组本身就是对象，Java中对象是在堆中，因此数组无论保存原始类型还是其他对象类型，**数组对象本身是在堆中的**。



## 数组的边界

下标的合法区间：`[0, length - 1]`，如果越界就会报错。

**ArrayIndexOutOfBoundsException: 数组下标越界异常**



## 数组使用

### For-Each循环

```java
package com.array;

public class ArrayDemo02 {
    public static void main(String[] args) {
        int[] arrays = {1, 2, 3, 4, 5};

        for (int i = 0; i < arrays.length; i++) {
            System.out.println(arrays[i]);
        }

        System.out.println("=======");

        // 打印全部的数组元素
        for (int array : arrays) {
            System.out.println(array);
        }

        System.out.println("=======");

        
        // 查找最大元素
        int max = arrays[0];
        for (int array : arrays) {
            if (array > max) {
                max = array;
            }
        }
        System.out.println(max);
    }
}

```



### 数组作方法入参和作返回值

```java
package com.array;

import java.util.Arrays;

public class ArrayDemo03 {
    public static void main(String[] args) {
        int[] arrays = {1, 2, 3, 4, 5};

        int[] result = reverse(arrays);
        printArray(result);
    }

    // 打印数组元素
    public static void printArray(int[] arrays) {
        for (int i = 0; i < arrays.length; i++) {
            System.out.println(arrays[i] + " ");
        }
    }

    // 反转数组
    public static int[] reverse(int[] arrays) {
        int[] result = new int[arrays.length];

        for (int i = 0, j = result.length - 1; i < arrays.length; i++, j--) {
            result[j] = arrays[i];
        }

        return result;
    }
}

```

