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
-   Github搜索：[https://github.com/search?q=mybatis](https://github.com/search?q=mybatis)
-   GitHub源码地址：[https://github.com/mybatis/mybatis-3](https://github.com/mybatis/mybatis-3)
-   Github源码中文注释：[https://github.com/tuguangquan/mybatis](https://github.com/tuguangquan/mybatis)

-   Maven仓库：[https://mvnrepository.com/](https://mvnrepository.com/)

-   Maven依赖

    ```xml
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.2</version>
    </dependency>
    ```



### 持久化

>   持久化就是将程序的数据在持久状态和瞬时状态转化的过程
>
>   内存：**断电即丢失**
>
>   数据库(JDBC)，io文件持久化



为什么需要持久化？

-   有一些对象，不能让它丢掉
-   内存太贵了



### 持久层

>   Dao层、Service层、Controller层。。。

-   负责将数据保存到**数据库**的那一层代码
-   JavaEE三层架构：表现层、业务层、**持久层**
-   POJO（Plain Old Java Objects， 普通老式Java对象）



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





## 第一个MyBatis程序

思路：

1.   搭建环境
2.   导入MyBatis
3.   编写代码
4.   测试



### 搭建环境

搭建数据库

```sql
create table user(
	id INT(20) not null ,
	name VARCHAR(30) not null DEFAULT '',
	pwd VARCHAR(30) not null,
	PRIMARY KEY(id)
)engine=INNODB DEFAULT CHARSET=utf8;
```

```sql
insert into user (id, name, pwd) VALUES (1, '无解', '123456'),(2, '张三', '123456'),(3, '李四', '123456');
```



### 新建项目

1.   新建maven项目

2.   去除`src`目录，为父工程

3.   导入依赖

     ```xml
     <!-- 导入依赖 -->
     <dependencies>
         <!-- mysql驱动 -->
         <dependency>
             <groupId>mysql</groupId>
             <artifactId>mysql-connector-java</artifactId>
             <version>5.1.47</version>
         </dependency>
         <!-- mybatis -->
         <dependency>
             <groupId>org.mybatis</groupId>
             <artifactId>mybatis</artifactId>
             <version>3.5.2</version>
         </dependency>
         <!-- junit -->
         <dependency>
             <groupId>junit</groupId>
             <artifactId>junit</artifactId>
             <version>4.12</version>
             <scope>test</scope>
         </dependency>
     </dependencies>
     ```

4.   创建模块

     1.   编写mybaits的核心配置文件

          ```xml
          <?xml version="1.0" encoding="UTF-8" ?>
          <!DOCTYPE configuration
                  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
                  "http://mybatis.org/dtd/mybatis-3-config.dtd">
          <!--核心配置文件-->
          <configuration>
              <environments default="development">
          
                  <environment id="development">
                      <!-- 事务管理 使用的是JDBC的事务管理 -->
                      <transactionManager type="JDBC"/>
                      <dataSource type="POOLED">
                          <property name="driver" value="com.mysql.jdbc.Driver"/>
                          <!-- &转义 &amp; -->
                          <property name="url" value="jdbc:mysql:///mybatis?useSSL=true&amp;;useUnicode=true&amp;characterEncoding=UTF-8"/>
                          <property name="username" value="root"/>
                          <property name="password" value=""/>
                      </dataSource>
                  </environment>
          
              </environments>
          </configuration>
          ```

          

     2.   编写mybatis的工具类

          ```java
          package com.wx.utils;
          
          import org.apache.ibatis.io.Resources;
          import org.apache.ibatis.session.SqlSession;
          import org.apache.ibatis.session.SqlSessionFactory;
          import org.apache.ibatis.session.SqlSessionFactoryBuilder;
          
          import java.io.IOException;
          import java.io.InputStream;
          
          // SqlSessionFactory 生产 sqlSession
          public class MybatisUtils {
          
              private static SqlSessionFactory sqlSessionFactory;
          
          
              static {
                  try {
                      String resource = "mybatis-config.xml";
                      InputStream inputStream = Resources.getResourceAsStream(resource);
                      // 使用Mybatis获取sqlSessionFactory对象
                      sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
                  } catch (IOException e) {
                      e.printStackTrace();
                  }
              }
          
          
              // 获取SqlSession的实例
              // SqlSession 包含了面向数据库执行SQL的命令所需的所有方法
              public static SqlSession getSqlSession() {
                  return sqlSessionFactory.openSession();
              }
          }
          
          ```

     3.   编写代码

          -   实体类

              ```java
              package com.wx.pojo;
              
              // 实体类
              public class User {
                  private int id;
                  private String name;
                  private String pwd;
              
                  public User() {
                  }
              
                  public User(int id, String name, String pwd) {
                      this.id = id;
                      this.name = name;
                      this.pwd = pwd;
                  }
              
                  @Override
                  public String toString() {
                      return "User{" +
                              "id=" + id +
                              ", name='" + name + '\'' +
                              ", pwd='" + pwd + '\'' +
                              '}';
                  }
              
                  public int getId() {
                      return id;
                  }
              
                  public void setId(int id) {
                      this.id = id;
                  }
              
                  public String getName() {
                      return name;
                  }
              
                  public void setName(String name) {
                      this.name = name;
                  }
              
                  public String getPwd() {
                      return pwd;
                  }
              
                  public void setPwd(String pwd) {
                      this.pwd = pwd;
                  }
              }
              
              ```

              

          -   Dao接口

              ```java
              package com.wx.dao;
              
              import com.wx.pojo.User;
              
              import java.util.List;
              
              // 等价于以后的mapper
              public interface UserDao {
                  List<User> getUserList();
              }
              
              ```

              

          -   接口实现类

              mybatis文档使用了`mapper`这样的定义，我们也就这样进行使用，其实和`UserDao`没啥区别。

              原先我们需要定义`UserDaoImpl`来实现接口

              ```java
              package com.wx.dao;
              
              import com.wx.pojo.User;
              
              import java.util.List;
              
              public class UserDaoImpl implements UserDao {
                  @Override
                  public List<User> getUserList() {
                      // 执行SQL
                      String str = "select * from mybatis.user";
                      // 结果集
                      return null;
                  }
              }
              
              ```

              现在只需要进行`Mapper`配置文件来代替

              ```xml
              <?xml version="1.0" encoding="UTF-8" ?>
              <!DOCTYPE mapper
                      PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
                      "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
              <!--namespace=绑定一个对应的Dao/Mapper接口-->
              <mapper namespace="com.wx.dao.UserDao">
                  <!-- 查询语句 -->
                  <!-- id 对应Dao/Mapper的方法名称 -->
                  <!-- resultType: 返回类型 -->
                  <select id="getUserList" resultType="com.wx.pojo.User">
                      select *
                      from mybatis.user
                  </select>
              </mapper>
              ```

     4.   测试

          :::warning

          ```
          Could not find resource mybatis-config.xml
          ```

          maven由于他的约定大于配置，遇到写的配置文件，无法被导出或者生效的问题，解决方案：

          手动配置资源过滤

          因为我们现在的配置文件在`java目录`

          暂时放在父工程的`pom.xml`保险起见，子模块也放一个

          ```xml
          <build>
              <resources>
                  <resource>
                      <directory>src/main/resources</directory>
                      <includes>
                          <include>**/*.properties</include>
                          <include>**/*.xml</include>
                      </includes>
                      <filtering>true</filtering>
                  </resource>
                  <resource>
                      <directory>src/main/java</directory>
                      <includes>
                          <include>**/*.properties</include>
                          <include>**/*.xml</include>
                      </includes>
                      <filtering>true</filtering>
                  </resource>
              </resources>
          </build>
          ```

          :::

          但是`target`目录没有对应的`UserMapper.xml`

          `mybatis-config.xml`

          ```xml
          <build>
              <resources>
                  <resource>
                      <directory>src/main/resources</directory>
                      <includes>
                          <include>**/*.properties</include>
                          <include>**/*.xml</include>
                      </includes>
                      <filtering>true</filtering>
                  </resource>
                  <resource>
                      <directory>src/main/java</directory>
                      <includes>
                          <include>**/*.properties</include>
                          <include>**/*.xml</include>
                      </includes>
                      <filtering>true</filtering>
                  </resource>
              </resources>
          </build>
          ```
          
          :::warning
          
          可能会遇到的问题：
          
           	1. 配置文件没有注册
           	2. 绑定接口错误
           	3. 方法名不对
           	4. 返回类型不对	
           	5. Maven导出资源的问题
          
          :::
          
          ---
          
          测试校验代码
          
          ```java
          package com.wx.dao;
          
          import com.wx.pojo.User;
          import com.wx.utils.MybatisUtils;
          import org.apache.ibatis.session.SqlSession;
          import org.junit.Test;
          
          import java.util.List;
          
          public class UserDaoTest {
          
              @Test
              public void test() {
                  // 获取 sqlSession
                  SqlSession sqlSession = MybatisUtils.getSqlSession();
          
                  // 方式1： getMapper
                  // 执行SQL
                  // 获取到dao的对象  UserDao => 后续可以重命名为 UserMapper
                  UserDao userDao = sqlSession.getMapper(UserDao.class);
                  List<User> userList = userDao.getUserList();
          
                  for (User user : userList) {
                      System.out.println(user);
                  }
          
                  // 方式2(老的，见见即可)
                  // 完全限定名
                  List<User> userList2 = sqlSession.selectList("com.wx.dao.UserDao.getUserList");
                  for (User user : userList2) {
                      System.out.println(user);
                  }
          
                  // 关闭sqlSession
                  sqlSession.close();
              }
          }
          
          ```
          
          



### 问题处理

```
### Error querying database.  Cause: com.mysql.jdbc.exceptions.jdbc4.CommunicationsException: Communications link failure
```

```xml
package com.wx.dao;

import com.wx.pojo.User;
import com.wx.utils.MybatisUtils;
import org.apache.ibatis.session.SqlSession;
import org.junit.Test;

import java.util.List;

public class UserDaoTest {

    @Test
    public void test() {
        // 获取 sqlSession
        SqlSession sqlSession = MybatisUtils.getSqlSession();

        // 方式1： getMapper
        // 执行SQL
        // 获取到dao的对象  UserDao => 后续可以重命名为 UserMapper
        UserDao userDao = sqlSession.getMapper(UserDao.class);
        List<User> userList = userDao.getUserList();

        for (User user : userList) {
            System.out.println(user);
        }

        // 方式2(老的，见见即可)
        // 完全限定名
        List<User> userList2 = sqlSession.selectList("com.wx.dao.UserDao.getUserList");
        for (User user : userList2) {
            System.out.println(user);
        }

        // 关闭sqlSession
        sqlSession.close();
    }
}


```

需要将`useSSL=true`改为`useSSL=false`不去检测证书。

---

重命名`xml`文件时，可能会变成不识别的类型，需要在IDEA的文件类型里去找到对应的你写的文件名称.xml去删除，就会恢复正常。





## CRUD

### namespace

>   namespace中的包名要和Dao/Mapper接口的名称一致



### select

>   选择，查询语句
