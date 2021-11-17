---
title: 'Maven目录结构'
date: 2021-11-17 23:53:15
# 永久链接
permalink: '/java/maven/tree'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - Maven
---



## Maven的下载

[官网链接](https://maven.apache.org/)

[下载地址](https://maven.apache.org/download.cgi)

[历史版本](https://maven.apache.org/docs/history.html)



## Maven的目录结构

```txt
├── LICENSE
├── NOTICE
├── README.txt
├── bin
│   ├── m2.conf
│   ├── mvn
│   ├── mvn.cmd
│   ├── mvnDebug
│   ├── mvnDebug.cmd
│   └── mvnyjp
├── boot
├── conf
└── lib
```

`bin`：存放的是执行文件，以及命令。

但是在`IDEA`中可以直接集成使用`Maven`，如果想用更高的版本或者固定的版本就去瞎子啊，然后再`IDEA`中设置对应的`Maven`的目录

`conf/settings.xml`：非常重要的文件，是`Maven`的核心配置文件/核心配置文件

第一次使用的时候，你会找不到`IDEA`中的`.m2`文件夹，你只需要使用以下`mvn`的命令，它就会在对应的默认位置生成`.m2`路径。

命令：`mvn help:system`

前提是`mvn`的命令，得有效，也需要将`maven`的安装目录下的`bin`目录里的`mvn`的指向加入到环境变量中。

**只需关注配置文件和相关命令即可。**

