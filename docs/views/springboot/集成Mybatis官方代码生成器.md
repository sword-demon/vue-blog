---
title: '集成Mybatis官方代码生成器'
date: 2021-12-12 15:36:15
# 永久链接
permalink: '/springboot/mybatis-generator'
sidebar: 'auto'
isShowComment: true
categories:
 - springboot
tags:
 - null
---



## 集成Mybatis官方代码生成器

测试数据和数据表

```sql
drop table if exists `demo`;
create table `demo` (
    `id` bigint not null comment 'id',
    `name` varchar(50) comment '名称',
    primary key (`id`)
)engine=innodb default charset=utf8mb4 comment '测试代码生成器';
```





导入依赖

```xml
<build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>2.3.4.RELEASE</version>
            </plugin>

            <!-- mybatis generator 自动生成代码插件 -->
            <plugin>
                <groupId>org.mybatis.generator</groupId>
                <artifactId>mybatis-generator-maven-plugin</artifactId>
                <version>1.4.0</version>
                <configuration>
                    <configurationFile>src/main/resources/generator/generator-config.xml</configurationFile>
                    <overwrite>true</overwrite>
                    <verbose>true</verbose>
                </configuration>
                <dependencies>
                    <dependency>
                        <groupId>mysql</groupId>
                        <artifactId>mysql-connector-java</artifactId>
                        <version>8.0.22</version>
                    </dependency>
                </dependencies>
            </plugin>
        </plugins>
    </build>
```







`resrouces/generator/generator-config.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">

<generatorConfiguration>
    <context id="Mysql" targetRuntime="MyBatis3" defaultModelType="flat">

        <!-- 自动检查关键字，为关键字增加反引号 -->
        <property name="autoDelimitKeywords" value="true"/>
        <property name="beginningDelimiter" value="`"/>
        <property name="endingDelimiter" value="`"/>

        <!--覆盖生成XML文件-->
        <plugin type="org.mybatis.generator.plugins.UnmergeableXmlMappersPlugin"/>
        <!-- 生成的实体类添加toString()方法 -->
        <plugin type="org.mybatis.generator.plugins.ToStringPlugin"/>

        <!-- 不生成注释 -->
        <commentGenerator>
            <property name="suppressAllComments" value="true"/>
        </commentGenerator>

        <jdbcConnection driverClass="com.mysql.cj.jdbc.Driver"
                        connectionURL="jdbc:mysql://localhost:3306/wiki?serverTimezone=Asia/Shanghai"
                        userId="root"
                        password="1">
        </jdbcConnection>

        <!-- domain类的位置 -->
        <javaModelGenerator targetProject="src\main\java"
                            targetPackage="com.xxx.wiki.domain"/>

        <!-- resources目录下的 mapper xml的位置 -->
        <sqlMapGenerator targetProject="src\main\resources"
                         targetPackage="mapper"/>

        <!-- mapper类的位置 -->
        <javaClientGenerator targetProject="src\main\java"
                             targetPackage="com.xxx.wiki.mapper"
                             type="XMLMAPPER"/>

        <!--<table tableName="demo" domainObjectName="Demo"/>-->
        <!--<table tableName="ebook"/>-->
        <!--<table tableName="category"/>-->
        <!--<table tableName="doc"/>-->
        <!--<table tableName="content"/>-->
        <!--<table tableName="user"/>-->
        <table tableName="ebook_snapshot"/>
    </context>
</generatorConfiguration>
```



## 配置IDEA生成运行

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20211212164646.png" alt="配置maven运行生成器" /></p>





## mybatis生成器的问题和解决

`mac m1`电脑的`targetProject`的目录不能写`\`要写`/`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">

<generatorConfiguration>
    <context id="Mysql" targetRuntime="MyBatis3" defaultModelType="flat">

        <!-- 自动检查关键字，为关键字增加反引号 -->
        <property name="autoDelimitKeywords" value="true"/>
        <property name="beginningDelimiter" value="`"/>
        <property name="endingDelimiter" value="`"/>

        <!--覆盖生成XML文件-->
        <plugin type="org.mybatis.generator.plugins.UnmergeableXmlMappersPlugin"/>
        <!-- 生成的实体类添加toString()方法 -->
        <plugin type="org.mybatis.generator.plugins.ToStringPlugin"/>

        <!-- 不生成注释 -->
        <commentGenerator>
            <property name="suppressAllComments" value="true"/>
        </commentGenerator>

        <jdbcConnection driverClass="com.mysql.cj.jdbc.Driver"
                        connectionURL="jdbc:mysql://localhost:3306/wiki?serverTimezone=Asia/Shanghai"
                        userId="root"
                        password="root">
        </jdbcConnection>

        <!-- domain类的位置 -->
        <javaModelGenerator targetProject="src/main/java"
                            targetPackage="com.Xxx.wiki.domain"/>

        <!-- resources目录下的 mapper xml的位置 -->
        <sqlMapGenerator targetProject="src/main/resources"
                         targetPackage="mapper"/>

        <!-- mapper类的位置 -->
        <javaClientGenerator targetProject="src/main/java"
                             targetPackage="com.Xxx.wiki.mapper"
                             type="XMLMAPPER"/>

        <table tableName="demo" domainObjectName="Demo"/>
        <!--<table tableName="ebook"/>-->
        <!--<table tableName="category"/>-->
        <!--<table tableName="doc"/>-->
        <!--<table tableName="content"/>-->
        <!--<table tableName="user"/>-->
        <table tableName="ebook_snapshot"/>
    </context>
</generatorConfiguration>
```
**不然使用生成器的时候会提示：`src/main/java`目录找不到**

还有就是，有的人生成器，没有生成代码，感觉也没啥问题，创建`demo`的表也执行了，表也存在但是就是没有生成类，因为你没有定义你要生成的表的内容。
```xml
<table tableName="demo" domainObjectName="Demo"/>
```
是注释状态，以及下面都是注释状态，我们需要在生成某个表的代码的时候进行取消注释即可。





## 代码测试

`DemoService.java`

```java
import com.wx.wiki.domain.Demo;
import com.wx.wiki.domain.DemoExample;
import com.wx.wiki.mapper.DemoMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class DemoService {

    @Resource
    private DemoMapper demoMapper;

    public List<Demo> list() {
        // 注意生成的代码，这个是要传入一个搜索的参数的，这边查询所有就传递一个对象或者null即可
        return demoMapper.selectByExample(new DemoExample());
    }
}

```

`DemoController.java`

```java
import com.wx.wiki.domain.Demo;
import com.wx.wiki.service.DemoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
public class DemoController {

    @Resource
    private DemoService demoService;

    @GetMapping("/demo/list")
    public List<Demo> list() {
        return demoService.list();
    }
}

```

`demo.http`测试代码

```http
GET http://localhost:8880/demo/list
#Accept: application/json

###
```

测试结果

```bash
GET http://localhost:8880/demo/list

HTTP/1.1 200 
Content-Type: application/json
Transfer-Encoding: chunked
Date: Sun, 12 Dec 2021 08:48:31 GMT
Keep-Alive: timeout=60
Connection: keep-alive

[]

Response code: 200; Time: 348ms; Content length: 2 bytes

```

因为表里暂无数据，就是空列表。