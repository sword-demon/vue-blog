---
title: 'SpringCloudGateway'
date: 2022-01-15 22:17:15
# 永久链接
permalink: '/springcloud/gateway'
sidebar: 'auto'
isShowComment: true
categories:
 - springcloud
tags:
 - null
---



## 简介

>   网关作为流量的入口，通常功能包括路由转发、权限校验、限流控制等。而`SpringCloud Gateway`作为`SpringCloud`官方推出的第二代网关框架，取代了`Zuul`网关。



>   网关提供API全托管服务，丰富的API管理功能，辅助企业管理大规模的API，以降低管理成本和安全风险，包括协议适配、协议转发、安全策略、防刷、流量、监控日志等功能。



官方文档地址：

[https://docs.spring.io/spring-cloud-gateway/docs/3.1.1-SNAPSHOT/reference/html/](https://docs.spring.io/spring-cloud-gateway/docs/3.1.1-SNAPSHOT/reference/html/)



## [Glossary](https://docs.spring.io/spring-cloud-gateway/docs/2.2.9.RELEASE/reference/html/#glossary)

-   **Route**: The basic building block of the gateway. It is defined by an ID, a destination URI, a collection of predicates, and a collection of filters. A route is matched if the aggregate predicate is true(网关的基本构件。它由一个ID、一个目标URI、一个谓词集合和一个过滤器集合定义。如果聚合谓词为真，则匹配路由。).
-   **Predicate**: This is a [Java 8 Function Predicate](https://docs.oracle.com/javase/8/docs/api/java/util/function/Predicate.html). The input type is a [Spring Framework `ServerWebExchange`](https://docs.spring.io/spring/docs/5.0.x/javadoc-api/org/springframework/web/server/ServerWebExchange.html). This lets you match on anything from the HTTP request, such as headers or parameters(这是一个[Java 8函数谓词](https://docs.oracle.com/javase/8/docs/api/java/util/function/Predicate.html)。输入类型是[Spring Framework ' ServerWebExchange '](https://docs.spring.io/spring/docs/5.0.x/javadoc-api/org/springframework/web/server/ServerWebExchange.html)。这允许您匹配来自HTTP请求的任何内容，例如头信息或参数。).
-   **Filter**: These are instances of [`GatewayFilter`](https://github.com/spring-cloud/spring-cloud-gateway/tree/2.2.x/spring-cloud-gateway-server/src/main/java/org/springframework/cloud/gateway/filter/GatewayFilter.java) that have been constructed with a specific factory. Here, you can modify requests and responses before or after sending the downstream request.(这些是[' GatewayFilter '](https://github.com/spring-cloud/spring-cloud-gateway/tree/2.2.x/spring-cloud-gateway-server/src/main/java/org/springframework/cloud/gateway/filter/GatewayFilter.java)的实例，它们是用一个特定的工厂构造的。在这里，您可以在发送下游请求之前或之后修改请求和响应。)



总结：

1.   请求发送到网关
2.   网关断言判断是否符合路由规则
3.   符合则路由到指定的地方，就会经过一系列的过滤器进行过滤



:::tip

即：我们需要写哪些路由信息，断言是怎么判断的，要写一些适合的过滤器。

:::



## 创建&测试API网关

我们先在项目中创建一个模块，为`项目名-gateway`，使用`spring initializr`的方式，下一步下一步之后，搜索`gateway`加入即可点击完成。



然后配置`pom.xml`文件

:::tip 依赖问题

哎，无解的问题，我试了半天的版本，如下：

`springboot`版本

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.2.2.RELEASE</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>
```

`SpringCloud`版本

```xml
<properties>
    <java.version>1.8</java.version>
    <spring-cloud.version>Hoxton.SR1</spring-cloud.version>
</properties>
```

然后还得引入之前使用的`项目-common`模块，里面有注册中心和服务发现的相关依赖

```xml
<dependency>
    <groupId>com.wxvirus.gulimall</groupId>
    <artifactId>gulimall-common</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</dependency>
```

:::



1.   我们要在应用启动类上加上注解

     ```java
     import org.springframework.boot.SpringApplication;
     import org.springframework.boot.autoconfigure.SpringBootApplication;
     import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
     import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
     
     /**
      * 1. 开启服务注册发现
      * 2. 配置nacos的注册中心地址
      */
     @EnableDiscoveryClient
     // 排除数据源的配置
     @SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
     public class MallGatewayApplication {
     
         public static void main(String[] args) {
             SpringApplication.run(MallGatewayApplication.class, args);
         }
     
     }
     ```

     因为这里，我们使用了`项目-common`模块，里面有配置`mybatis-plus`相关的数据源的依赖，但是我们现在这个模块并没有配置数据源信息，所以启动会报错，我们进行忽略。

2.   配置`nacos`注册中心地址

     `application.properties`

     ```properties
     spring.cloud.nacos.discovery.server-addr=127.0.0.1:8848
     spring.application.name=gulimall-gateway
     ```

     然后在`nacos`创建新的命名空间为`gateway`，并为之创建对应的配置文件，这里取名为`application.yml`，`yml`文件比较符合官网的配置路由的那些格式。

     首先写一些应用名称即可

     ```yaml
     spring:
       application:
         name: 项目-gateway
     ```

      

     配置`bootstrap.properties`配置中心

     ```properties
     spring.application.name=项目名-gateway
     spring.cloud.nacos.config.server-addr=127.0.0.1:8848
     # gateway的名称空间的id
     spring.cloud.nacos.config.namespace=14316d98-d69e-47fe-86a1-6cae3536812b
     server.port=88
     ```

     下面即可启动应用类查看是否有问题。

3.   配置相关路由断言

     这里写在`application.yml`呼应上述在`nacos`中写的配置信息

     ```yaml
     spring:
       cloud:
         gateway:
           routes:
             - id: test_route
               uri: https://www.baidu.com
               predicates:
                 - Query=url, baidu
     
             - id: qq_route
               uri: https://www.qq.com
               predicates:
                 - Query=url, qq
     ```

     使用的是：[The Query Route Predicate Factory](https://docs.spring.io/spring-cloud-gateway/docs/2.2.9.RELEASE/reference/html/#the-query-route-predicate-factory)这个路由断言规则

     它需要一个参数，后面则是进行正则匹配的项。

     -   id：表示一个代名词，名称
     -   uri：表示路由到的地址
     -   predicates：配置断言规则
         -   和id一样是数组格式，在`yml`文件类型中 `-`代表数组的意思
         -   Query：代表访问页面`?`开头的参数
             -   第一个参数：参数名称
             -   第二个参数：参数与之匹配的正则内容，这里写的是死内容

     意思：

     >   -   如果访问：`127.0.0.1:88?url=baidu`，则跳转到百度页面
     >   -   如果访问：`127.0.0.1:88?url=qq`，则跳转到QQ官网

4.   测试结果

     <p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20220118003002.png" alt="测试结果" /></p>