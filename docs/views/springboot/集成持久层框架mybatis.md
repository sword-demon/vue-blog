---
title: '集成持久层框架Mybatis'
date: 2021-12-11 19:59:15
# 永久链接
permalink: '/springboot/mybatis'
sidebar: 'auto'
isShowComment: true
categories:
 - springboot
tags:
 - null
---



## 集成持久层框架Mybatis

依赖

```xml
 <!-- 集成mybatis -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>1.3.2</version>
</dependency>
 <!-- mysql驱动 mysql5.7的可以用 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.37</version>
</dependency>
```

`mysql8`的

```xml
 <!-- 集成mybatis -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.3</version>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.22</version>
</dependency>
```

**引入mybatis，就得去配置数据源，否则启动会报错**



:::warning 数据库配置

如果是`mysql5.7`或者以下的，使用配置文件的时候驱动类不需要加上`cj`

:::

```yaml
# mybatis配置
# 增加数据库连接
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/wiki?characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai
    username: root
    password: 1
    driver-class-name: com.mysql.jdbc.Driver
```

如果是8的就加上`cj`，即：`com.mysql.jdbc.cj.Driver`



---

编写测试案例

1.   编写实体类

     先创建`domain`包用于存储实体类

     `Test.java`

     ```java
     package com.wx.wiki.domain;
     
     public class Test {
         private Integer id;
         private String name;
         private String password;
     
         public Integer getId() {
             return id;
         }
     
         public void setId(Integer id) {
             this.id = id;
         }
     
         public String getName() {
             return name;
         }
     
         public void setName(String name) {
             this.name = name;
         }
     
         public String getPassword() {
             return password;
         }
     
         public void setPassword(String password) {
             this.password = password;
         }
     }
     
     ```

2.   编写接口

     由于`mybatis`的后面命名为`XxxMapper`，所以这里不沿用以前的`XxxDao`

     `TestMapper.java`

     ```java
     package com.wx.wiki.mapper;
     
     import com.wx.wiki.domain.Test;
     
     import java.util.List;
     
     public interface TestMapper {
     
         List<Test> list();
     }
     
     ```

3.   编写xml

     这里将对于的编写`SQL`的地方放到`resources/mapper`目录下

     `TestMapper.xml`

     ```xml
     <?xml version="1.0" encoding="UTF-8" ?>
     <!DOCTYPE mapper
             PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
             "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
     
     <mapper namespace="com.wx.wiki.mapper.TestMapper">
     
         <select id="list" resultType="com.wx.wiki.domain.Test">
             select `id`, `name`, `password` from `test`
         </select>
     </mapper>
     ```

4.   我们需要让整个项目知道`Mapper`就是持久层

     >   在启动类上加上`@MapperScan`的注解，用来知晓哪个是持久层

     ```java
     import org.mybatis.spring.annotation.MapperScan;
     import org.slf4j.Logger;
     import org.slf4j.LoggerFactory;
     import org.springframework.boot.SpringApplication;
     import org.springframework.boot.autoconfigure.SpringBootApplication;
     import org.springframework.core.env.Environment;
     
     @SpringBootApplication
     @MapperScan("com.wx.wiki.mapper")
     public class XxxApplication {
     
         private static final Logger LOG = LoggerFactory.getLogger(XxxApplication.class);
     
         public static void main(String[] args) {
             SpringApplication app = new SpringApplication(XxxApplication.class);
             Environment env = app.run(args).getEnvironment();
             LOG.info("启动成功!");
             LOG.info("地址: \thttp://127.0.0.1:{}", env.getProperty("server.port"));
         }
     }
     ```

5.   要让整个项目知道`xml`就是要执行的SQL

     ```properties
     # 配置mybatis所有Mapper.xml所在的路径
     mybatis.mapper-locations=classpath:/mapper/**/*.xml
     ```

     ```yaml
     mybatis:
       mapper-locations: classpath:/mapper/**/*.xml
     ```

     `classpath`可以理解为`resources`，就是说`mapper`下面不管多少层，只要是`.xml`的都能识别

6.   新建`service`来进行调用

     ```java
     import com.wx.wiki.domain.Test;
     import com.wx.wiki.mapper.TestMapper;
     import org.springframework.stereotype.Service;
     
     import javax.annotation.Resource;
     import java.util.List;
     
     @Service
     public class TestService {
     
         @Resource
         private TestMapper testMapper;
     
         public List<Test> list() {
             return testMapper.list();
         }
     }
     ```

7.   最后在`controller`层调用服务

     ```java
     import com.wx.wiki.domain.Test;
     import com.wx.wiki.service.TestService;
     import org.springframework.beans.factory.annotation.Value;
     import org.springframework.web.bind.annotation.GetMapping;
     import org.springframework.web.bind.annotation.RequestMapping;
     import org.springframework.web.bind.annotation.RestController;
     
     import javax.annotation.Resource;
     import java.util.List;
     
     @RestController
     public class TestController {
     
         @Resource
         private TestService testService;
     
         @GetMapping("/test/list")
         public List<Test> list() {
             return testService.list();
         }
     }
     
     ```

8.   编写测试代码

     ```http
     GET http://localhost:8880/test/list
     #Accept: application/json
     
     ###
     ```

     ```bash
     GET http://localhost:8880/test/list
     
     HTTP/1.1 200 
     Content-Type: application/json
     Transfer-Encoding: chunked
     Date: Sat, 11 Dec 2021 14:50:00 GMT
     Keep-Alive: timeout=60
     Connection: keep-alive
     
     [
       {
         "id": 1,
         "name": "无解",
         "password": "123"
       }
     ]
     
     Response code: 200; Time: 257ms; Content length: 39 bytes
     
     ```

     

:::danger 记录一次犯病的错误

```yaml
mybatis:
  mapper-locations=classpath:/mapper/**/*.xml
```

如上所见，我在`yml`格式的里面写了`properties`的格式，导致报错

:::

