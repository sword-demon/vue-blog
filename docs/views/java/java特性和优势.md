---
title: 'java特性和优势'
date: 2021-10-29 21:40:15
# 永久链接
permalink: '/java/advantage/'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - 特性
 - 优势
---



## Java特性和优势

-   简单性
-   面向对象
-   可移植性
-   高性能
-   分布式
-   动态性
-   多线程
-   安全性
-   健壮性



## Java三大版本

:::tip

`Write Once、Run Anywhere`

created by JVM

:::



-   JavaSE: 标准版（桌面程序、控制台开发...）
-   javaME：嵌入式开发（手机、小家电...）
-   javaEE：E企业级开发（web端、服务器开发...）



## JDK、JRE、JVM

-   JDK：Java Development Kit
-   JRE：Java Runtime Environment
-   JVM：Java Virtual Machine



## 卸载JDK

找到环境变量里的`JAVA_HOME`对应的地址，直接删除对应的文件夹，然后再讲有关的环境变量都删掉即可。

验证：

打开cmd,输入`java -version`是否可用。不可用则代表卸载完成。



总结：

1.   删除Java的安装目录
2.   删除`JAVA_HOME`环境变量
3.   删除`path`下有关Java的目录
4.   进行验证



## 安装JDK

1.   百度搜索JDK8，找到下载地址

2.   同意相关协议

3.   下载电脑对应版本

4.   双击安装JDK

5.   可以更改安装路径，`windows`一般不建议直接安装在C盘

6.   然后都是下一步

7.   配置环境变量

     1.   我的电脑 -> 属性 -> 高级系统设置 -> 环境变量 -> 系统变量
     2.   新建 -> 变量名：`JAVA_HOME`，变量值：Java安装的路径
     3.   配置`path`变量，在系统 变量里找到`Path`，添加两个值
          1.   `%JAVA_HOME%\bin`，对应Java安装目录的`bin`目录
          2.   `%JAVA_HOME%\jre\bin`，对应Java的JRE下的bin目录
     4.   全部确定

8.   打开CMD进行验证：`java -version`出现版本信息即可

     这是我的java版本，我是M1的Mac，所以下了下面的版本。

     ```bash
     openjdk version "15.0.2" 2021-01-19
     OpenJDK Runtime Environment (build 15.0.2+7-27)
     OpenJDK 64-Bit Server VM (build 15.0.2+7-27, mixed mode, sharing)
     ```

     

## 第一个Java程序Hello World

1.   建立一个文件夹，用于存放代码
2.   新建一个java文件
     1.   后缀名为`.java`
     2.   `Hello.java`
3.   文件类型为JAVA文件
4.   **windows注意，一开始新建的时候需要打开隐藏的后缀，打开文件扩展名。**

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```

下面进行编译运行

打开cmd

1.   `javac Hello.java`没有出现任何问题且生成了一个`.class`文件即可
2.   `java Hello`使用`java`命令来运行程序，会在控制台输出一个`Hello World`



### 可能会遇到的情况

1.   每个单词的大小不能出现问题，**Java是大小写敏感的**
2.   有的人输出中文，会出现问题，尽量使用英文
3.   文件名和类名必须保证一致，并且首字母大写
4.   符号使用了中文，必须使用英文的符号



## Java的运行机制

-   编译型

    >   `compile`，案例：国人想看一个国外的文学作品，你得直接去找一个全部翻译成全部中文的。后续如果作者更新了 ，也得全部在翻译一遍。

-   解释型

    >   案例：国人找一个翻译 ，看到哪里，翻译跟着翻译到哪里。



### 运行机制

-   `.java`源文件
-   通过Java编译器
-   变成了字节码`.class`文件
-   然后 通过类状态器、字节码校验器、解释器，最后到操作系统平台
-   既有编译型的特征，也有解释型的特征

