---
title: 'java数据类型'
date: 2021-10-30 14:40:15
# 永久链接
permalink: '/java/type/'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## 数据类型

-   强类型语言
    -   **要求变量的使用要严格符合规定，所有变量都必须先定义后才能使用**
    -   安全性高
    -   速度会相对慢一点
-   弱类型语言

---

Java的数据类型分为两大类：

-   基本类型(primitive type)
    -   数值类型
        -   整数类型
            -   byte占1个字节范围：-128~127
            -   short占2个字节，范围：-32768~32767
            -   int占4个字节，范围：-2147483648~2147483647
            -   long占8个字节，范围：-9223372036854775808~9223372036854775807
        -   浮点类型
            -   float占4个字节
            -   double占8个字节
        -   字符类型 char 占2个字节
    -   boolean类型：占1位其值只有true和false两个
-   引用类型(reference type)
    -   类
    -   接口
    -   数组



```java
package com;

public class Demo02 {

    // 八大基本数据类型

    // 整数
    int num1 = 10;
    byte num2 = 20;
    short num3 = 30;
    long num4 = 40L; // long 类型要在数字后面加个L

    // 浮点数
    float num5 = 50.1F; // float类型要在后面加一个F
    double num6 = 3.14159265;

    // 字符
    char name = '无';

    // 布尔值
    boolean flag = true;
}

```

如何查看对应的类型的最大值和最小值呢，他们每个都有对应的一个类，都是其首字母大写的类里 ，比如`int`，就在`Integer`类里。



## 字节

### 位(bit)

>   是计算机内部是护具存储的最小单位，`11001100`是一个八位二进制数。



### 字节(byte)

>   是计算机中数据处理的基本单位，习惯上用大写B来表示

`1B(字节) = 8bit(位)`



### 字符

>   是指计算机中使用的字母、数字、字和符号。





### 换算

-   1bit表示1位
-   1Byte表示一个字节 1B = 8bit
-   1024B = 1KB
-   1024KB = 1M
-   1024M = 1G



## 扩展

```java
package com;

public class Demo02 {
    public static void main(String[] args) {
        // 整数扩展：进制
        int i = 10;
        int i1 = 010; // 八进制
        int i2 = 0x10; // 十六进制
        System.out.println(i);
        System.out.println(i1);
        System.out.println(i2);

        // 浮点数扩展
        // 银行业务如何表示 使用float和double是有问题的 使用 BigDecimal 数学工具类
        // float 有限 离散 舍入误差 大约 无限接近但不等于
        float f = 0.1f;     // 0.1
        double d = 1.0 / 10;// 0.1
        System.out.println(f == d); // false

        float d1 = 123213213213123f;
        float d2 = d1 + 1;
        System.out.println(d1 == d2); // 诡异的是 : true

        // 字符扩展
        // 所有的字符本质都还是数字
        // Unicode编码 2个字节 65536
        char c1 = 'a';
        char c2 = '中';
        System.out.println(c1);
        System.out.println((int) c2); // 转换为数字 20013

        char c3 = '\u0061'; // unicode 编码
        System.out.println(c3); // a

        // 转义字符
        // \t 制表符
        // \n 换行
        System.out.println("hello\tworld");
        System.out.println("hello\nworld");

        String sa = new String("hello world");
        String sb = new String("hello world");
        System.out.println(sa.equals(sb)); // true
        System.out.println(sa == sb); // false

        String sc = "hello world";
        String sd = "hello world";
        System.out.println(sc == sd); // true
    }
}

```



## 类型转换

Java是强类型语言 ，运算时需要用到类型转换。

```java
低 ----------------------------> 高
byte, short, char -> int -> long -> float -> double
```

不同类型的数据先转化为同一类型，然后进行运算。



强制类型转换：高 -> 低

自动类型转换：低 -> 高



:::warning

注意点：

1.   不能对布尔值进行转换
2.   不能把对象类型转换为不相干的类型
3.   在把高容量的转换到低容量的时候，强制转换
4.   转换的时候可能存在内存溢出，或者精度问题！

:::



```java
package com;

public class Demo03 {
    public static void main(String[] args) {
        int i = 128;
        byte b = (byte) i; // 最大值为127  就会内存溢出 转换的时候尽量避免这种内存溢出的情况
        System.out.println(i); // 128
        System.out.println(b); // -128

        double c = i;
        System.out.println(c); // 128.0

        System.out.println((int) 23.7); // 23
        System.out.println((int) -45.89f); // -45

        char d = 'a';
        int e = d + 1;
        System.out.println(e); // 98
        System.out.println((char) e); // b

        // JDK7新特性，数字之间可以使用下划线分割
        int money = 10_0000_0000;
        System.out.println(money);
        int years = 20;
        int total = money * years;
        System.out.println(total); // -1474836480 计算的时候溢出了
        long total2 = money * ((long) years); // 先把一个数转换为long
        System.out.println(total2); // 20000000000

        // L l 最好使用大写的L来表示浮点数
        
    }
}

```

