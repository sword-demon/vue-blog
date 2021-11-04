---
title: 'Maven基础'
date: 2021-11-04 22:59:15
# 永久链接
permalink: '/java/maven/base'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - Maven
---



## Maven基础

`pom.xml`文件

### 坐标

-   groupId：这是工程组的标识。它在一个组织或者项目中通常是唯一的。
-   artifactId：这是工程的标识。它通常是工程的名称。groupId和artifactId一起定义了artifact在仓库中的位置。
-   version：这是工程的版本号，用来区分不同的版本。



### 常用命令

-   `mvn -v`：查看Maven的版本，也用来检查Maven是否安装成功
-   `mvn compile`：编译，将Java源文件编异成class文件
-   `mvn test`：执行test目录下的测试用例
-   `mvn package`：打包，将Java工程打包成jar包
-   `mvn clean`：清理环境，清除target文件夹
-   `mvn install`：安装，将当前项目安装到Maven的本地仓库中



## Maven相关特性

### 传递依赖

>   如果我们的项目引用了一个`jar`包，而该`jar`包又引用了其他的`jar`包。那么，在默认情况下，项目编译时，Maven会把直接引用和间接 引用的`jar`包都下载到本地(`~/.m2/repository`)



### 传递依赖

>   如果我们只想下载直接引用的`jar`包，那么需要在`pom.xml`文件中做如下配置(给出需要排除的坐标)



```xml
<dependency>
	<groupId>org.apache.hbase</groupId>
    <artifactId>hbase</artifactId>
    <version>0.9417</version>
    <exclustions>
    	<exclusion>
        	<groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
        </exclusion>
    </exclustions>
</dependency>
```



### 依赖冲突

>   若项目中多个`jar`同时引用了相同的`jar`时，会产生依赖冲突，但Maven采用了两种避免冲突的策略，因此在Maven中是不存在依赖冲突的。



-   短路优先

    ```
    本项目 -> A.jar -> B.jar -> X.jar
    本项目 -> C.jar -> X.jar
    
    使用最短的
    ```

-   声明优先

    若引用路径长度相同时，在`pom.xml`中谁先被声明，就使用谁。

    



### 多模块项目/聚合

```
PROJECT
|
|-PROJECT-MODEL
|	|
|   |- SRC
|   |- POM (JAR)
|
|
|
|-PROJECT-DAO
|	|
|   |- SRC
|   |- POM (JAR)
|
|
|-PROJECT-SERVICE
|	|
|   |- SRC
|   |- POM (JAR)
|
|-PROJECT-WEB
|	|
|   |- SRC
|   |- POM (JAR)
|
|
|
|- POM.XML(POM)
|

```

-   父模块`pom`文件的配置：`packaging`类型必须是`pom`

    ```xml
    <groupId>com.xxx.xxx</groupId>
    <artifactI>xxx.xxx</artifactI>
    <packaging>pom</packaging>
    <version>0.0.1-SNAPSHOT</version>
    ```

-   聚合子模块：使用`modules`标签

    ```xml
    <modules>
    	<module>xxx-common</module>
        <module>xxx-template</module>
        <module>xxx-settlement</module>
        <module>xxx-distribution</module>
    </modules>
    ```

-   父模块统一管理依赖包：使用`dependencyManagement`标签

    ```xml
    <!-- 标识 SpringCloud 的版本 -->
    <dependencyManagement>
    	<dependencies>
        	<dependency>
            	<groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    ```

-   子模块需要在`pom`中声明父模块：使用`parent`标签

    ```xml
    <parent>
    	<artifactId>xxx-coupon</artifactId>
        <groupId>com.xxx.coupon</groupId>
        <version>0.0.1-SNAPSHOT</version>
    </parent>
    ```





