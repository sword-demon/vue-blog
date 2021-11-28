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

>   本地仓库指的是本机的一份拷贝，用来缓存远程下载，包含你尚未发布的临时构件。

:::tip

建议windwos用户本地仓库别放在C盘

:::

## 配置仓库

### 本地仓库配置：

打开`settings.xml`

```xml
<localRepository>对应你本地的repository的地址填入</localRepository>
```

:::tip

正常的来说，这个是注释掉的，最好重新复制一份，进行设置

:::



### 镜像仓库配置

>   如果仓库A可以提供仓库B存储的所有内容，那么就可以认为A是B的一个镜像，Maven的中央仓库是Apache的在国外，国内下载速度非常慢，这时，我们可以使用阿里云提供的镜像`http://maven.aliyun.com/nexus/content/groups/public/`来替换中央仓库`http://repol.maven.org/maven2/`，修改`maven`的`settings.xml`文件。

```xml
<mirror>
	<!-- 指定镜像id 可以自己改名 -->
    <id>nexus-aliyun</id>
    <!-- 匹配中央仓库 阿里云的仓库名称，不可以自己起名，必须这么写 -->
    <mirrorOf>central</mirrorOf>
    <!-- 指定镜像名称 可以自己改名 -->
    <name>Nexus aliyun</name>
    <!-- 指定镜像路径 镜像地址 -->
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
</mirror>
```

**找到`<mirrors></mirrors>`标签里面进行粘贴即可**



## 仓库优先级

1.   最先从本地仓库中找
2.   如果本地没有，去配置文件中指定的仓库中查找
3.   也没有，就去中央仓库找
4.   最后到中央仓库



## JDK的配置

>   当你的IDEA中有多个JDK的时候，就需要指定你编译和运行的JDK

在`settings.xml`中配置：

```xml
<profile>
	<!-- 告诉maven我们使用jdk1.8  -->
    <id>jdk-1.8</id>
    <!-- 开启JDK的使用 -->
    <activation>
    	<activeByDefault>true</activeByDefault>
        <jdk>1.8</jdk>
    </activation>
    <properties>
    	<!-- 配置编译期信息 -->
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        		<maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
    </properties>
</profile>
```

:::warning

settings.xml中的id不能随便起；且配置的前提是你有JDK1.8。

:::

