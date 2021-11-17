---
title: 'Maven仓库'
date: 2021-11-18 00:11:15
# 永久链接
permalink: '/java/maven/repo'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - Maven
---



## Maven仓库

:::tip

`Maven`仓库是基于简单的文件系统存储的，集中化管理Java API资源(构件)的一个服务。

仓库中的任何一个构件都有其唯一坐标，根据这个坐标可以定义其在仓库中的唯一存储路径。得益于`Maven`的坐标机制，任何`Maven`项目使用任何一个构件的方式是完全相同的。

`Maven`可以在某个位置统一存储所有的`Maven`项目共享的构件，这个统一的位置就是仓库，项目构建完毕之后的构件也可以安装或者部署到仓库中，供其他项目使用。

仓库就是前面下载下来的`Maven`的`.m2`文件夹下的`repository`

:::



## 远程仓库

>   不在本机中的一切仓库，都是远程仓库：分为**中央仓库**和**本地私服仓库**
>
>   远程仓库是指通过各种协议如`file://`和`http://`访问的其他类型的仓库。这些仓库可能是第三方搭建的真实的远程仓库，用来提供他们的构件(jar包)下载，例如`repo.maven.apache.org`和`uk.maven.org`是`Maven`的中央仓库。其他“远程”仓库可能是你的公司拥有的建立在文件和HTTP服务器上的内部仓库，这个就是公司的私服，用来在开发团队间共享私有构件和管理发布的。



默认的访问的是`Apache`的中央仓库：[地址](https://mvnrepository.com/)

类似`mybatis`的坐标如下

```xml
<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.7</version>
</dependency>
```



## 本地仓库