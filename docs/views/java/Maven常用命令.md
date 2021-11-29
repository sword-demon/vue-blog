---
title: 'Maven常用命令'
date: 2021-11-29 22:14:15
# 永久链接
permalink: '/java/maven/cmd'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - Maven
---



## 常用命令

-   install

    >   本地安装，包含编译，打包，安装到本地仓库

    编译 - javac

    打包 - jar，将代码打包为`jar`文件

    安装到本地仓库 - 将打包的jar文件保存到本地仓库目录中

-   clean

    >清除已编译的信息
    >
    >删除工程的`target`目录

-   compiler

    >   只编译，`javac`命令

-   package

    >   打包。包含编译，打包两个功能

    :::tip

    `install`和`package`的区别：

    >   package命令完成了项目的编译、单元测试、打包功能，但没有吧打好的可执行jar包(war包)部署到本地maven仓库和远程maven私服仓库。
    >
    >   install命令完成了项目编译、单元测试、打包功能，同时把打好的可执行的jar包(war包)部署到本地maven仓库，但没有部署到远程maven私服仓库。
    >
    >   私服命令还要加上一个`deploy`命令，用的不多。

    :::