---
title: 'java变量'
date: 2021-10-30 15:50:15
# 永久链接
permalink: '/java/parameter/'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## 变量

-   变量：就是可以变化的量

-   Java是强类型语言，每个变量都必须声明其类型
-   Java变量是程序中最基本的存储单元，其要素包括变量名，变量类型和**作用域**



```java
type varName [=value] [{, varName[=value]}];

// 数据类型 变量名 = 值; 可以使用逗号进行隔开来声明多个同类型的变量
```



:::warning

-   每个变量都有类型，类型可以是基本类型，也可以是引用类型
-   变量名必须是合法的标识符
-   变量声明时一条完整的语句，因此每个声明都必须以分号结尾

:::



```java
package com;

public class Demo04 {
    public static void main(String[] args) {

        // 要注意程序可读性

        int a = 1, b = 2, c = 3;
        String name = "wujie";
        char x = '无';
        double pi = 3.141592653;

        System.out.println(a);
        System.out.println(name);
        System.out.println(x);
        System.out.println(pi);
    }
}

```





### 变量作用域

-   类变量：关键字：`static`
-   实例变量：从属于对象；如果不自行初始化，这个类型的默认值 0，0.0，布尔值默认值为false，除了基本类型其他的都是`null`；
-   局部变量：**必须声明和初始化值**

```java
package com;

public class Demo04 {
    static int allClicks = 0; // 类变量
    String str = "hello world"; // 实例变量

    public void method() {
        int i = 0; // 局部变量
    }
}

```



## 常量(Constant)

>   初始化后不能再修改其值，不会变动的值！

```java
final 常量名 = 值;

final double PI = 3.14;
```

**常量名一般使用大写字符**

```java
// 修饰符 不存在前后顺序
static final double PI = 3.14;
```



## 变量的命名规范

-   所有变量、方法、类名：见名知意
-   类成员变量：首字母小写和驼峰原则：monthSalay除了第一个单词以外，后面的单词首字母都大写
-   局部变量：首字母小写和驼峰原则
-   常量：大写字母和下划线组合
-   类名：首字母大写和驼峰原则
-   方法名：首字母小写和驼峰原则