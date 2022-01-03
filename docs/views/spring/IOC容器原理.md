---
title: 'IOC容器原理'
date: 2022-01-02 21:12:15
# 永久链接
permalink: '/spring/ioc1'
sidebar: 'auto'
isShowComment: true
categories:
 - spring
tags:
 - null
---



## 概念

>   控制反转(Inversion of Control)，是面向对象编程中的一种设计原则，可以用来减低计算机之间的**耦合读**。其中最常见的方式叫做**依赖注入**(Dependency Injection, 简称**DI**)。

1.   **把对象创建和对象之间的调用过程，交给Spring进行管理**
2.   目的：为了耦合度降低
3.   入门案例就是IOC实现



## IOC底层原理

1.   `xml`解析、工厂设计模式、反射



原始方式

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20220102212458.png" alt="两个类之间生成对象调用方法1" /></p>

于是有了**工厂模式**来降低耦合度

```java
class UserDao {
    void add() {
        // ...
    }
}
```

```java
class UserFactory {
    public static UserDao getDao() {
        return new UserDao();
    }
}
```

```java
class UserService {
    void execute() {
        UserDao dao = UserFactory.getDao();
        dao.add();
    }
}
```

使用工厂来降低了`service`和`dao`之间的耦合度。但是你会发现，工厂还是会有耦合。



:::tip 目的

耦合度降低到最低限度

:::





## IOC过程

1.   配置`xml`文件，配置创建的对象

     ```xml
     <!-- 配置User类对象创建 -->
     <bean id="user" class="com.wx.spring5.User"/>
     ```

2.   有`service`类和`dao`类，创建工厂类

     ```java
     class UserFactory {
         public static UserDao getDao() {
             // 通过xml的解析 + 反射来获取类对象
             String classValue = class属性值; // xml 解析得到 com.wx.spring5.User
             
             // 通过反射创建对象
             // 得到类的字节码文件
             Class clazz = Class.forName(classValue);
             
             // 创建对象
             return (UserDao) clazz.newInstance();
         }
     }
     ```

**进一步降低耦合度**



## IOC接口

-   IOC思想基于IOC容器完成，IOC容器底层就是对象工厂。
-   Spring提供了IOC容器实现的2种方式(2个接口)
    -   `BeanFactory`
    -   `ApplicationContext`



### BeanFactory

>   IOC容器最基本的实现方式，是Spring自带的，内部的使用的接口，一般是在内部使用，不提供开发人员进行使用。

:::tip 特点

**加载配置文件的时候，不会去创建你的对象，而是你在使用的时候才会去创建对象**

:::

### ApplicationContext

>   是`BeanFactory`接口的子接口，提供更多更强大的功能，一般是由开发人员进行使用的。

:::tip 特点

**加载配置文件的时候就会把配置文件的对象进行创建**

:::



:::tip 哪个更合适

一般认为，第一种更合适使用，它只会在你使用的时候进行创建对象，看起来比较节省资源。但是呢，我们一般都是开发web项目，都是用Spring框架，把这种耗时耗资源的操作都在我们项目启动的时候去处理，而不是什么时候用什么时候创建。

:::



### ApplicationContext实现类

IDEA选中ApplicationContext类，按下`Ctrl h`查看结构

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20220103123216.png" alt="两个实现类" /></p>



## IOC操作Bean管理

### 1. Bean管理

Bean管理指的是两个操作：

1.   由Spring创建对象
2.   由Spring进行属性的注入



### 2. Bean管理操作有2种方式

-   基于`xml`配置文件方式实现
-   基于`注解`方式实现



### 基于xml方式创建对象

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- 配置User类对象创建 -->
    <bean id="user" class="com.wx.spring5.User"/>
</beans>
```

1.   在Spring配置文件中使用`bean`标签，标签里面添加上对应的属性，就可以实现对象的创建
2.   在`bean`标签有很多的属性，常用的属性：
     1.   `id`属性：就是给你的对象起个别名，名称标识，唯一标识
     2.   `class`属性：就写你要创建的类的全路径(包类的路径)
     3.   `name`属性：和`id`属性差不多，就是可以添加特殊符号，了解即可
3.   创建对象的时候，默认也是执行无参数的构造方法

### 基于xml方式注入属性

