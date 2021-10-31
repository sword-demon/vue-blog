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

### 方法的定义

**一个方法包含一个方法头和一个方法体**

-   修饰符：修饰符，这是可选的，告诉编译器如何调用该方法。定义了该方法的访问类型
-   返回值类型：方法可能会返回值。`returnValueType`是方法返回值的数据类型。有些方法执行所需的操作，但没有返回值。在这种情况下，`returnValueType`是关键字`void`
-   方法名：是方法的实际名称。方法名和参数表共同构成方法签名
-   参数类型：参数像是一个占位符。参数是可选的，方法可以不包含任何参数
    -   形式参数：在方法被调用时，用于接收外接输入的数据
    -   实参：调用方法时，实际传给方法的数据
-   方法体：方法体包含具体的语句，定义该方法的功能。



```java
修饰符 返回值类型 方法名(参数类型 参数名) {
    // 方法体
    
    return 返回值;
}
```





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



### 方法的调用

调用方法：**对象名.方法名(实参列表)**

Java支持两种调用方法的形式，根据方法是否返回值来选择。

当方法范湖一个值的时候，方法调用通常被当做一个值，例如：

```java
int larger = max(30, 40);
```

如果方法返回值是`void`，方法调用一定是一条语句。

```java
System.out.println("Hello");
```



```java
package com.method;

public class Demo01 {

    // main 方法
    public static void main(String[] args) {
        int sum = add(1, 2);
        System.out.println(sum);

        int max = compareMax(10, 20);
        System.out.println(max);
    }

    // 加法 形式参数，用来定义作用的
    public static int add(int a, int b) {
        return a + b;
    }

    /**
     * 比大小
     * @param num1 int
     * @param num2 int
     * @return int
     */
    public static int compareMax(int num1, int num2) {
        int result = 0;
        if (num1 == num2) {
            System.out.println("num1==num2");
            return 0;
        }
        if (num1 > num2) {
            result = num1;
        } else {
            result = num2;
        }

        return result;
    }
}

```

