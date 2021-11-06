---
title: 'JavaBean'
date: 2021-11-06 11:08:15
# 永久链接
permalink: '/java/javabean'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## JavaBean

>   是一种Java语言协程的可重用的组件。

所谓JavaBean就是符合如下标准的Java类

-   类是公共的
-   有一个无参的公共的构造器
-   有属性，属性一般是私有的，且有对应的`get、set`方法



:::tip

用户可以使用JavaBean将功能、处理、值、数据库访问和其他任何可以用Java代码创造的对象进行打包，并且其他的开发者可以通过内部的`jsp`页面、Servlet、其他JavaBean、applet程序或者应用来使用这些对象。用户可以认为JavaBean提供了一种随时随地的复制和粘贴的功能，而不用关心任何改变。

:::

一个典型的JavaBean案例

```java
/**
 * 一个javabean
 * 私有的属性
 * 属性对应的get和set方法
 * 无参构造
 */
public class Person1 {
    private String name;
    private int sex;
    private int age;

    // 无参构造
    public Person1() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSex() {
        return sex;
    }

    public void setSex(int sex) {
        this.sex = sex;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}

```

