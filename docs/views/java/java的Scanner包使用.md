---
title: 'java的Scanner包使用'
date: 2021-10-31 15:48:15
# 永久链接
permalink: '/java/package/scanner/'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - Scanner
---



## Scanner包的进阶使用

### 案例1：

```java
package com.scanner;

import java.util.Scanner;

public class Demo01 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int i = 0;
        float f = 0.0f;

        System.out.println("请输入整数: ");
        // 如果输入的是真的整数
        if (scanner.hasNextInt()) {
            i = scanner.nextInt();
            System.out.println(i);
        } else {
            System.out.println("你输入的不是整数数据");
        }

        System.out.println("请输入小数: ");
        // 如果输入的是真的浮点数
        if (scanner.hasNextFloat()) {
            f = scanner.nextFloat();
            System.out.println(f);
        } else {
            System.out.println("你输入的不是浮点数据");
        }

        scanner.close();
    }
}

```



### 案例2：

```java
package com.scanner;

import java.util.Scanner;

public class Demo02 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // 和
        double sum = 0;

        // 计算输入了多少个数字
        int m = 0;

        // 通过循环判断是否还有输入，并在里面对每一次进行求和和统计
        while (scanner.hasNextDouble()) {
            double x = scanner.nextDouble();
            System.out.println("你输入了第" + m + "个数据, 然后当前的结果为sum=" + sum);
            m++;

            sum += x;
        }

        System.out.println(m + "个数的和为: " + sum);
        System.out.println(m + "个数的平均数为: " + (sum / m));

        scanner.close();
    }
}

```

