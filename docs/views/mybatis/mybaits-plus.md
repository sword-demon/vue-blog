---
title: '持久层框架MyBatis-Plus'
date: 2022-02-16 22:54:15
# 永久链接
permalink: '/mybatis/mp'
sidebar: 'auto'
isShowComment: true
categories:
 - mybatis
tags:
 - null
---



## MyBatis-Plus是什么

>   MyBatis-Plus(简称MP)是一个MyBatis的增强工具，在MyBatis的基础上只做增强不做改变，为简化开发、提高效率而生。

-   润物无声
-   只做增强不做改变，引入它不会对现有工程产生影响
-   效率至上
-   只需简单配置，即可快速CRUD操作，从而节省时间
-   拥有热加载、代码生成、分页、性能分析等功能一应俱全



## MP入门

### 创建数据库，创建数据库表

数据库名为：`mybatis_plus`

其对应的数据库`Schema`脚本如下：

```sql
create table user 
(
    id BIGINT(20) not null comment '主键ID',
    name varchar(30) null default null comment '姓名',
    age int(11) null default null comment '年龄',
    email varchar(50) null default null comment '邮箱',
    primary key (id)
);
```

并进行填充数据。



### 创建工程`springboot`

#### 初始化工程

使用`Spring Initializr`快速初始化一个`SpringBoot`工程

Group: `com.wjstar`

Artifact: `demomybatis_plus`



#### 引入依赖

**注意：引入`MyBatis-Plus`之后请不要再次引入`MyBatis`，以避免版本差异导致的问题**

```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.3.1</version>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```



#### 配置数据库信息

在`application.properties`配置文件中添加`MySQL`数据库相关的配置



`SpringBoot 2.0`（内置jdbc5驱动）

```properties
# mysql 数据库连接
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/mybatis_plus?characterEncoding=utf-8&useSSL=false
spring.datasource.username=gulimall
spring.datasource.password=root
```



`SpringBoot 2.1及以上`(内置jdbc8驱动)

**注意：`Driver`和`url`的变化**

```properties
# mysql 数据库连接
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/mybatis_plus?serverTimezone=GMT%2B8
spring.datasource.username=gulimall
spring.datasource.password=root
```

**注意，这里url加了时区后缀，因为8.0版本的jdbc驱动需要添加这个后缀，否则运行测试用例会报错**



:::danger

java.sql.SQLException: The server time zone value 乱码 unrecognized or represents more

:::



这里的`driver-class-name`使用了`com.mysql.cj.jdbc.Driver`，在jdbc8中建议使用这个驱动，否则运行的时候会有`WARN`信息。



### 添加实体类

添加`entity`实体类的包名

```java
package com.wjstar.demomptest.entity;

import lombok.Data;

@Data
public class User {
    private Long id;
    private String name;
    private Integer age;
    private String email;
}

```

这里使用了`lombok`的`@Data`注解来代替`getter`和`setter`方法



### 添加mapper

创建包`mapper`编写`Mapper`接口

```java
package com.wjstar.demomptest.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.wjstar.demomptest.entity.User;

public interface UserMapper extends BaseMapper<User> {
}

```



### 启动类加上`MapperScan`注解

```java
package com.wjstar.demomptest;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.wjstar.demomptest.mapper")
public class DemomptestApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemomptestApplication.class, args);
    }

}

```



### 编写测试代码

```java
package com.wjstar.demomptest;

import com.wjstar.demomptest.entity.User;
import com.wjstar.demomptest.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class DemomptestApplicationTests {

    @Autowired
    private UserMapper userMapper;

    @Test
    void contextLoads() {
    }

    @Test
    public void findAll() {
        List<User> users = userMapper.selectList(null);
        System.out.println(users);
    }
}

```

会发现此时：`userMapper`是爆红的，其实我们可以不用管，但是看着别扭的人，可以去`UserMapper`加上`@Respository`注解即可。



运行结果

```bash
2022-02-16 23:31:26.718  INFO 13010 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2022-02-16 23:31:27.017  INFO 13010 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
[User(id=1, name=Jone, age=18, email=123@qq.com), User(id=2, name=jack, age=19, email=dwq@qq.com), User(id=3, name=tom, age=20, email=tom@qq.com)]

```

