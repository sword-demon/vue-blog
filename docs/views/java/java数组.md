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



## 稀疏数组

>   当一个数组中大部分元素是0，或者同一值的数组时，可以使用稀疏数组来保存该数组。

稀疏数组的处理方式是 ：

-   记录数组一共有几行几列，有多少个不同值
-   把具有不同值的元素和行列及值记录在一个小规模的数组中，从而缩小程序的规模

如图所示：

![image-20211103210117359](/vue-blog/assets/images/image-20211103210117359.png)



:::tip

第一行：6行代表数组有6行，有7列 ，真正有值的个数是8个

第二行：记录有效数字的坐标，第0行第三列，记录其值为22

下面一次类推。

:::



### 需求：编写五子棋，有存盘退出和续上盘的功能

使用二维数组记录棋盘。

**因为该二维数组记录了很多的默认0值，存在很多没有意义的数据**

>   使用稀疏数组进行压缩。



**假设一个11*11规格的棋盘，0：没有棋子，1：黑棋 2：白棋**

```txt
0	0	0	0	0	0	0	0	0	0	0	
0	0	1	0	0	0	0	0	0	0	0	
0	0	0	1	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
```



```java
package com.array;

import java.util.Arrays;

public class ArrayDemo04 {
    public static void main(String[] args) {
        // 创建一个二维数组 11*11 0没有旗子， 1黑棋 2白棋
        int[][] array1 = new int[11][11];
        array1[1][2] = 1;
        array1[2][3] = 1;

        // 输出原始的数组
        for (int[] ints : array1) {
            for (int anInt : ints) {
                System.out.print(anInt + "\t");
            }
            System.out.println();
        }

        System.out.println("--------------------------->");

        // 转换为稀疏数组来保存
        // 获取有效值的个数
        int sum = 0;
        for (int i = 0; i < array1.length; i++) {
            for (int j = 0; j < array1.length; j++) {
                if (array1[i][j] != 0) {
                    sum++;
                }
            }
        }

        System.out.println("有效值的个数: " + sum);

        // 创建一个稀疏数组
        int[][] array2 = new int[sum + 1][3]; // 列是固定3列
        array2[0][0] = 11;
        array2[0][1] = 11;
        array2[0][2] = sum;

        // 遍历二维数组，将非0的值存放到稀疏数组中
        int count = 0;
        for (int i = 0; i < array1.length; i++) {
            for (int j = 0; j < array1[i].length; j++) {
                if (array1[i][j] != 0) {
                    count++;
                    array2[count][0] = i; // 会在第几行第1个数字 横坐标
                    array2[count][1] = j; // 会在第几行第1个数字 纵坐标
                    array2[count][2] = array1[i][j];
                }
            }
        }

        // 输出稀疏数组
        for (int i = 0; i < array2.length; i++) {
            System.out.println(array2[i][0] + "\t"
                    + array2[i][1] + "\t"
                    + array2[i][2]);
        }

        System.out.println("------------------------->");
        System.out.println("还原");

        // 读取稀疏数组
        int[][] array3 = new int[array2[0][0]][array2[0][1]]; // 多少行 多少列

        // 给其中的元素还原它的值
        for (int i = 1; i < array2.length; i++) {
            array3[array2[i][0]][array2[i][1]] = array2[i][2];
        }

        // 打印还原数组
        for (int[] ints : array3) {
            for (int anInt : ints) {
                System.out.print(anInt + "\t");
            }
            System.out.println();
        }
    }
}

```

```bash
0	0	0	0	0	0	0	0	0	0	0	
0	0	1	0	0	0	0	0	0	0	0	
0	0	0	1	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
--------------------------->
有效值的个数: 2
11	11	2
1	2	1
2	3	1
--------------------------->
还原
0	0	0	0	0	0	0	0	0	0	0	
0	0	1	0	0	0	0	0	0	0	0	
0	0	0	1	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
0	0	0	0	0	0	0	0	0	0	0	
```

