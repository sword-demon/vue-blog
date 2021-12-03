---
title: 'MyBatis'
date: 2021-12-04 00:16:15
# 永久链接
permalink: '/java/MyBatis'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



<p align="center"><h1>MyBatis</h1></p>



## 简介

-   MyBatis是一款优秀的**持久层框架**，用于简化JDBC开发
-   MyBatis本事Apache的一个开源项目iBatis，2021年这个项目由apache software foundation迁移到了google code，并且改名为MyBatis。2013年11月迁移到Github
-   官网：[https://mybatis.org/mybatis-3/zh/index.html](https://mybatis.org/mybatis-3/zh/index.html)



### 持久层

-   负责将数据保存到**数据库**的那一层代码
-   JavaEE三层架构：表现层、业务层、**持久层**



### 框架

-   框架就是一个<kbd>半成品软件</kbd>，是一套可重用的、通用的、软件基础代码模型
-   在框架的基础上构建软件编写更加高效、规范、通用、可扩展



<!-- more -->



### JDBC缺点

1.   硬编码	=>	配置文件
     1.   注册驱动、获取连接
     2.   SQL语句
2.   操作繁琐   =>  自动完成
     1.   手动设置参数
     2.   手动封装结果集



连接数据库案例配置文件

```xml
<dataSource type="POOLED">
	<property name="driver" value="com.mysql.jdbc.Driver" />
    <property name="url" value="jdbc:mysql:///db1?useSSL=false" />
    <property name="username" value="root" />
    <property name="password" value="" />
</dataSource>
```

SQL语句案例配置文件

```xml
<select id="selectByGender" parameterType="string" resultType="com.wx.pojo.User">
	select * from user where gender = #{gender};
</select>
```

结果集案例

```java
List<User> users = sqlSession.selectList("test.selectByGender", "男");
```



>   MyBatis免除了几乎所有的JDBC代码以及设置参数获取结果集的工作。