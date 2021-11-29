---
title: 'Maven插件配置'
date: 2021-11-29 21:03:15
# 永久链接
permalink: '/java/maven/plugins'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - Maven
---



## 编译器插件

**配置Maven的编译插件**

在`<project></project>`包裹之下

```xml
<build>
    <plugins>
        <!-- JDK编译插件 -->
        <plugin>
            <!-- 插件坐标 -->
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.2</version>

            <configuration>
                <!-- 源代码使用JDK版本 -->
                <source>1.8</source>
                <!-- 源代码编译为.class的文件的版本，和上面保持一致 -->
                <target>1.8</target>
                <encoding>UTF-8</encoding>
            </configuration>
        </plugin>
    </plugins>
</build>
```



## 资源拷贝插件

>   Maven在打包时默认只将`src/main/resources`里的配置文件拷贝到项目中并做打包处理，而非`resources`目录下的配置文件在打包的时候不会添加到项目中。

我们的配置文件一般都放在`src/main/resources`

然后打包后配置文件就会在`target`的`classes`下面放着。



现在想把非`resources`下的文件也打包到`classes`下面，需要配置如下：

```xml
<build>
    <resources>
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>**/*.xml</include>
            </includes>
        </resource>
        <resource>
            <directory>src/main/resources</directory>
            <includes>
                <include>**/*.xml</include>
                <include>**/*.properties</include>
            </includes>
        </resource>
    </resources>
</build>
```





## Tomcat插件

我们如果创建`war`项目，必然要部署在服务器上，方式：

1.   部署在远程服务器上
2.   将IDEA和外部Tomcat产生关联，然后将项目部署在外部Tomcat上



>   现在学习一个新的方式，不再依赖外部的`Tomcat`，`Maven`提供了`Tomcat`插件，可以配置来使用。
>
>   使用`Tomcat`插件发布部署并执行`war`工程的时候，需要使用启动命令，启动命令为：`tomcat7:run`，命令中的`tomcat7`是插件名，由插件提供商决定。`run`为插件中的具体功能。

新建`war`项目：IDEA新建Project，选择Maven，选择从原型创建，选择`webapp`下一步到完成即可。

在`src/main/webapp/`目录下新建`index.jsp`

```jsp
<%--
  Created by IntelliJ IDEA.
  User: wangxin
  Date: 2021/11/29
  Time: 9:38 下午
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>JSP Index</title>
</head>
<body>
<h2>this is my first jsp</h2>
</body>
</html>
```

在配置文件中加入以下配置

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.tomcat.maven</groupId>
            <artifactId>tomcat7-maven-plugin</artifactId>
            <version>2.2</version>
            <configuration>
                <!-- 配置端口 -->
                <port>8080</port>
                <!-- 配置项目的访问路径 Application Context -->
                <path>/</path>
            </configuration>
        </plugin>
    </plugins>
</build>
```

执行命令：

`tomcat7:run`，估计你得配置JDK1.7的8估计不得劲

或者使用以下方式

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20211129214400.png" alt="maven工具里点击执行命令" /></p>

因为我没有JDK1.7，所以直接说结果了，反正最终结果，是一个`h2`的`this is my first jsp`页面。

访问：[http://localhost:8080](http://localhost:8080)即可

