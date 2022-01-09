---
title: 'nacos注册中心'
date: 2022-01-09 23:47:15
# 永久链接
permalink: '/springcloud/nacos-server'
sidebar: 'auto'
isShowComment: true
categories:
 - springcloud
tags:
 - null
---



## 使用Nacos作为注册中心

> Nacos是阿里巴巴开源的更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。他是使用java编程。需要依赖java环境。
> Nacos文档地址：[https://nacos.io/zh-cn/docs/quick-start.html](https://nacos.io/zh-cn/docs/quick-start.html)



## 下载Nacos-server

[https://github.com/alibaba/nacos/release](https://github.com/alibaba/nacos/release)



nacos与springcloud alibaba和springboot的之间的版本选择

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/92e3aa67482b220fec796c18b96cb09f.png" alt="版本选择图" /></p>

## 启动nacos-server

- 打开命令终端：`sh startup.sh`
- 访问：`http://localhost:8848/nacos`
- 使用默认的`nacos/nacos`进行登录
- `sh startup.sh -m standalone`使用单机模式启动
- 输入`jps`查看运行的进程

```bash
➜ jps
62867 nacos-server.jar
64598 Jps
64234 Launcher
64235 MemberApplication
64158 CouponApplication
59359 RemoteMavenServer36
```

出现以下内容：

```bash
nacos is starting with standalone
nacos is starting，you can check the /Users/用户/soft/nacos1.4.2/logs/start.out
```

即可，输入命令查看运行日志

```bash
tail -200f /Users/用户/soft/nacos1.4.2/logs/start.out
```

主要查看下面的一句话：

```txt
2022-01-09 23:25:05,546 INFO Tomcat initialized with port(s): 8848 (http)

2022-01-09 23:25:08,188 INFO Tomcat started on port(s): 8848 (http) with context path '/nacos'
```

说明访问的地址是以`/nacos`开头的,端口为：`8848`

访问网址：[http://localhost:8848/nacos](http://localhost:8848/nacos)

输入：`nacos`用户名

密码：`nacos`即可登录



## 将微服务注册到nacos中

1.   首先，修改`pom.xml`文件，引入`Nacos Discovery Starter`，在`project-common`的的`pom.xml`文件引入，别的微服务引入`common`模块即可。

     ```xml
     <dependency>
         <groupId>com.alibaba.cloud</groupId>
         <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
     </dependency>
     ```

2.   在应用的`/src/main/resources/application.yml`配置文件中配置`nacos-server`地址

     ```yaml
     spring:
       cloud:
         nacos:
           discovery:
             server-addr: 127.0.0.1:8848
       application:
         # 必须给当前服务起名字
         name: member
     ```

3.   使用`@EnableDiscoveryClient`注解开启服务注册发现功能

     ```java
     package com.wxvirus.project.member;
     
     import org.springframework.boot.SpringApplication;
     import org.springframework.boot.autoconfigure.SpringBootApplication;
     import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
     
     @EnableDiscoveryClient
     @SpringBootApplication
     public class MemberApplication {
     
         public static void main(String[] args) {
             SpringApplication.run(MemberApplication.class, args);
         }
     
     }
     
     ```

4.   启动应用，观察nacos服务列表是否有已经注册上的服务

     :::warning 注意必须写应用名称

     每一个应用都应该有名字，这样才能注册上去

     :::



:::tip 总结

Nacos使用三步：

1.   导包`nacos-discovery`
2.   写配置，指定`nacos-server`地址，指定应用名字
3.   开启服务注册发现功能：`@EnableDiscoveryClient`

:::

