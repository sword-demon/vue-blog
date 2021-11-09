---
title: 'java类和对象内存分析'
date: 2021-11-09 21:39:15
# 永久链接
permalink: '/java/class/asy'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## 创建对象分析

```java
public class Person {

    int id;
    int age;

    public static void main(String[] args) {
        Person p1 = new Person();
    }
}

```

![对象内存分析1](https://gitee.com/wxvirus/img/raw/master/img/20211109214047.png)



## 分析2

```java
public class Person {

    int id;
    int age;
    String school;

    public Person(int id, int age, String school) {
        this.id = id;
        this.age = age;
        this.school = school;
    }

    public static void main(String[] args) {
        Person p1 = new Person(1, 20, "朝阳");
    }
}
```

运行分析：

1.   生成字节码
2.   从方法区里加载字节码
3.   在堆中生成对象以及内存地址以及变量初始化
     1.   `int id`初始值为0
     2.   `int age`初始值为0
     3.   `String school`初始值为`null`
4.   在栈中压入`main()`方法
5.   产生变量`p1`并保存其对应的关联的对象的内存地址
6.   调用构造器，构造器方法压栈，并对局部变量进行初始化
7.   初始化完毕之后，进行赋值
     1.   `id = 1`
     2.   `age = 20`
     3.   `school`是字符串，是引用类型，会在方法区的字符串常量中生成一个字符串`朝阳`以及其对应的内存地址 ，这里保存的是内存地址
8.   对应的堆中的对象里的属性值也随之变更
9.   构造器结束之后，出栈
10.   最后main方法出栈，结束



![内存分析2](https://gitee.com/wxvirus/img/raw/master/img/20211109220148.png)



## 小结

栈存储内容：

-   局部变量
-   形参
-   方法



堆：

-   对象
-   数组



方法区：

-   字节码信息
-   字符串常量池
-   静态域：**类加载的时候，会将静态内容也加载到方法区的静态域中，静态的内容先于对象存在，被该类下的所有对象共享，推荐访问方式，通过类名进行访问**



`static`修饰的应用场景：

-   某些特定的数据想要在内存中共享，只有一块，这个情况下可以使用`static`修饰该属性，即类变量，也称之为静态属性。
-   在静态方法中不能访问非静态属性，静态属性和方法先于对象存在，没有对象，就没法进行访问非静态变量
-   在静态方法中不能使用`this`关键字

