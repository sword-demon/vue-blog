---
title: 'JDBC'
date: 2021-12-01 19:37:15
# 永久链接
permalink: '/java/jdbc'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## 简介

### 概念

>   JDBC就是使用Java语言操作关系型数据库的一套API
>
>   全称：(**J**ava **D**ata**B**ase **C**onnectitity) Java 数据库连接。

### 本质

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20211201195055.png" alt="JDBC本质" /></p>

期望：同一套代码操作不同的关系型数据库

**Sun**公司站出来了，定义了一套代码，JDBC，即一个规则，也就是Java语言里的接口，让不同的数据库厂商去实现各自的实现类。

>   我们可以使用这套接口(JDBC)编程，真正执行代码的是驱动`jar`包中的实现类。

### 好处

-   各数据库厂商使用相同的接口，Java代码不需要针对不同数据库分别开发
-   可以随时替换底层数据库，访问数据库的Java代码基本不变



<!-- more -->

## 快速入门

### 步骤

1.   创建工程，导入驱动`jar`包：`mysql-connector-java-5.1.48.jar`,驱动下载地址：[https://mirrors.tuna.tsinghua.edu.cn/mysql/downloads/Connector-J/](https://mirrors.tuna.tsinghua.edu.cn/mysql/downloads/Connector-J/)

     使用IDEA如何导入放进去的jar包：对着jar包右键找到添加到库，`add as library字样即可`，然后`level`选择模块库，`Globale library全局有效`，`Project library`工程有效，`module library`模块有效。

2.   注册驱动

     ```java
     Class.forName("com.mysql.jdbc.Driver");
     ```

3.   获取连接

     ```java
     Connection conn = DriverManager.getConnection(url, username, password);
     ```

4.   定义SQL语句

     ```java
     String sql = "update ...";
     ```

5.   获取执行SQL对象

     ```java
     Statement stmt = conn.createStatement();
     ```

6.   执行SQL

     ```java
     stmt.executeUpdate(sql);
     ```

7.   处理返回结果

8.   释放资源

```java
import java.sql.*;

public class JDBCDemo {

    public static void main(String[] args) throws Exception {

        String url = "jdbc:mysql://127.0.0.1:3306/db1";
        String username = "root";
        String password = "";

        // 1. 注册驱动
        Class.forName("com.mysql.jdbc.Driver");

        // 2. 获取连接
        Connection conn = DriverManager.getConnection(url, username, password);

        // 3. 定义sql
        String sql = "update goods set goods_stock = goods_stock + 100 where id = 1";

        // 4. 获取执行sql的对象
        Statement stmt = conn.createStatement();

        // 5. 执行sql
        int count = stmt.executeUpdate(sql);

        // 6. 处理结果
        System.out.println(count);

        // 7. 释放资源
        stmt.close();
        conn.close();
    }
}
```

执行结果：

```bash
1
```





## API详解

-   DriverManager
-   Connection
-   Statement
-   ResultSet
-   PreparedStatement



### DriverManager

驱动管理类的作用：

1.   注册驱动

     :::details mysql驱动

     ```java
     package com.mysql.jdbc;
     
     import java.sql.DriverManager;
     import java.sql.SQLException;
     
     public class Driver extends NonRegisteringDriver implements java.sql.Driver {
         public Driver() throws SQLException {
         }
     
         static {
             try {
                 DriverManager.registerDriver(new Driver());
             } catch (SQLException var1) {
                 throw new RuntimeException("Can't register driver!");
             }
         }
     }
     ```

     :::

     

     :::tip

     MySQL5之后的驱动

     ```java
     Class.forName("com.mysql.jdbc.Driver");
     ```

     这一行可以不写了。

     原因是`MySQL`的jar包里的`META-INF/serivces`有一个保存驱动的文件，会去读取里面的字符串进行加载类。

     :::

2.   获取数据库连接

     参数：

     1.   url：连接路径

          >   语法：`jdbc:mysql://ip地址(域名):端口号/数据库名称?参数键值对1&参数键值对2...`
          >
          >   示例：`jdbc:mysql://127.0.0.1:3306/db1`
          >
          >   细节：
          >
          >   -   如果是连接的本机mysql服务器，并且mysql服务器的端口是3306，则url可以简写为`jdbc:mysql:///数据库名称?参数键值对`
          >   -   配置`useSSL=false`参数，禁用安全连接方式，解决警告提示

          **Wed Dec 01 20:49:00 CST 2021 WARN: Establishing SSL connection without server's identity verification is not recommended. According to MySQL 5.5.45+, 5.6.26+ and 5.7.6+ requirements SSL connection must be established by default if explicit option isn't set. For compliance with existing applications not using SSL the verifyServerCertificate property is set to 'false'. You need either to explicitly disable SSL by setting useSSL=false, or set useSSL=true and provide truststore for server certificate verification.**

          即配置为`jdbc:mysql:///db1?useSSL=false`

     2.   user：用户名

     3.   password：密码



### Connection

数据库连接对象的作用：

1.   获取执行SQL的对象

     1.   普通执行SQL对象

          `Statement createStatement()`

     2.   预编译SQL的执行SQL对象：防止SQL注入

          ```java
          PreparedStatement prepareStatement(sql);
          ```

     3.   执行存储过程的对象

          ```java
          CallableStatement prepareCall(sql);
          ```

          

2.   管理事务

     -   MySQL事务管理

         ```sql
         # 开启事务
         BEGIN TRANSACTION;
         # 或者
         START TRANSACTION;
         
         # 提交事务
         COMMIT;
         
         # 回滚事务
         ROLLBACK;
         
         # MYSQL默认自动提交事务
         ```

     -   JDBC事务管理：`Connection`接口中定义了3个对应的方法

         ```java
         // 开启事务
         setAutoCommit(boolean autoCommit); // true 为自动提交事务; false 为手动提交事务，即为开启事务
         
         // 提交事务
         commit();
         
         // 回滚事务
         rollback();
         ```



**事务案例代码**

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class JDBC_Connection {
    public static void main(String[] args) throws Exception {

        String url = "jdbc:mysql:///db1?useSSL=false";
        String username = "root";
        String password = "";

        // 1. 注册驱动
        Class.forName("com.mysql.jdbc.Driver");

        // 2. 获取连接
        Connection conn = DriverManager.getConnection(url, username, password);

        // 3. 定义sql
        String sql1 = "update goods set goods_stock = goods_stock + 100 where id = 1";
        String sql2 = "update goods set goods_stock = goods_stock + 200 where id = 2";


        // 4. 获取执行sql的对象
        Statement stmt = conn.createStatement();

        try {
            // 开启事务
            conn.setAutoCommit(false);

            // 5. 执行sql
            int count1 = stmt.executeUpdate(sql1);
            int count2 = stmt.executeUpdate(sql2);

            // 6. 处理结果
            System.out.println(count1);
            System.out.println(count2);

            // 提交事务
            conn.commit();
        } catch (SQLException throwables) {
            // 回滚事务
            conn.rollback();
            throwables.printStackTrace();
        }


        // 7. 释放资源
        stmt.close();
        conn.close();
    }
}

```

:::warning

回滚异常的，需要将MySQL表的存储引擎换成`InnoDB`，默认的`MyISAM不支持事务。

:::



### Statement

>   就是用来执行SQL语句的。

```java
int executeUpdate(sql); // 执行DML DDL语句的
```

DDL：对表和库的增删改查操作

DML：对数据的增删改操作



返回值：

1.   DML语句影响的行数
2.   DDL语句执行后，执行成功也可能返回0

```java
ResultSet executeQeury(sql); // 执行DQL语句 对数据的查询操作
```

DQL：对数据的查询操作

返回值：

`ResultSet`结果集对象



```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class JDBCDemo_Statement {

    static String url = "jdbc:mysql://127.0.0.1:3306/db1";
    static String username = "root";
    static String password = "";

    public static void testDML() throws Exception {
        // 2. 获取连接
        Connection conn = DriverManager.getConnection(url, username, password);

        // 3. 定义sql
        String sql = "update goods set goods_stock = goods_stock + 100 where id = 1";

        // 4. 获取执行sql的对象
        Statement stmt = conn.createStatement();

        // 5. 执行sql
        int count = stmt.executeUpdate(sql);

        if (count > 0) {
            System.out.println("修改成功");
        } else {
            System.out.println("修改失败");
        }

        // 6. 处理结果
        System.out.println(count);

        // 7. 释放资源
        stmt.close();
        conn.close();
    }

    public static void testDDL() throws Exception {
        Connection conn = DriverManager.getConnection(url, username, password);

        // 3. 定义sql
        String sql = "create database db2";

//        String sql2 = "drop database db2";

        // 4. 获取执行sql的对象
        Statement stmt = conn.createStatement();

        // 5. 执行sql
        int count = stmt.executeUpdate(sql);

        // 6. 处理结果 DDL 不一定返回0
        System.out.println(count);

        // 7. 释放资源
        stmt.close();
        conn.close();
    }

    public static void main(String[] args) throws Exception {
        testDML();
        testDDL();
    }
}

```



### ResultSet

结果集对象的作用：

1.   封装了DQL查询语句的结果

     ```java
     ResultSet stmt.executeQuery(sql); // 执行DQL语句，返回ResultSet对象
     ```

2.   获取查询结果

     ```java
     boolean next();
     ```

     -   将光标从当前位置向后移动一行
     -   判断当前行是否为有效行

     返回值：

     -   true：有效行，当前行有数据
     -   false：无效行，当前行没数据

     ---

     ```java
     xxx getXxx(参数); // 获取数据
     
     xxx 数据类型；如 int getInt(参数); String getString(参数);
     ```

     参数：

     -   int：**列的编号，从1开始**
     -   String：列的名称



---

使用步骤：

1.   游标向下移动一行，并判断该行是否有数据：`next()`
2.   获取数据，getXxx(参数)

```java
// 循环判断游标是否是最后一行末尾
while (rs.next()) {
    // 获取数据
    rs.getXxx(参数);
}
```



案例：

```java
package com.wx.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class JDBCDemo_ResultSet {

    public static void main(String[] args) throws Exception {

        String url = "jdbc:mysql://127.0.0.1:3306/db1";
        String username = "root";
        String password = "";

        // 1. 注册驱动
        Class.forName("com.mysql.jdbc.Driver");

        // 2. 获取连接
        Connection conn = DriverManager.getConnection(url, username, password);

        // 3. 定义sql
        String sql = "select * from goods";

        // 4. 获取执行sql的对象
        Statement stmt = conn.createStatement();

        ResultSet rs = stmt.executeQuery(sql);

        // 遍历rs的所有数据
        while (rs.next()) {
            int id = rs.getInt(1);
            String goods_name = rs.getString(2);
            int goods_stock = rs.getInt(3);

            System.out.println(id);
            System.out.println(goods_name);
            System.out.println(goods_stock);
        }

        // 7. 释放资源
        rs.close();
        stmt.close();
        conn.close();
    }
}

```

```java
while (rs.next()) {
	// 换一种方式获取数据
    int id = rs.getInt("id");
    String goods_name = rs.getString("goods_name");
    int goods_stock = rs.getInt("goods_stock");

    System.out.println(id);
    System.out.println(goods_name);
    System.out.println(goods_stock);
}
```

---

**ResultSet案例**

>   需求：查询`goods`表数据，封装为`Goods`对象，并且存储到`ArrayList`集合中。

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20211201224559.png" alt="转换过程" /></p>



1.   定义实体类`Goods`，一般是放在以`pojo`命名的包中

     ```java
     package com.wx.pojo;
     
     // 一般表名叫啥，类名就叫啥
     public class Goods {
     
         // 和数据表的字段类型一一对应
         private int id;
         private String goods_name;
         private int goods_stock;
     
         @Override
         public String toString() {
             return "Goods{" +
                     "id=" + id +
                     ", goods_name='" + goods_name + '\'' +
                     ", goods_stock=" + goods_stock +
                     '}';
         }
     
         public int getId() {
             return id;
         }
     
         public void setId(int id) {
             this.id = id;
         }
     
         public String getGoods_name() {
             return goods_name;
         }
     
         public void setGoods_name(String goods_name) {
             this.goods_name = goods_name;
         }
     
         public int getGoods_stock() {
             return goods_stock;
         }
     
         public void setGoods_stock(int goods_stock) {
             this.goods_stock = goods_stock;
         }
     }
     
     ```

2.   查询数据

     ```java
     package com.wx.jdbc;
     
     import com.wx.pojo.Goods;
     
     import java.sql.Connection;
     import java.sql.DriverManager;
     import java.sql.ResultSet;
     import java.sql.Statement;
     import java.util.ArrayList;
     import java.util.List;
     
     public class JDBCDemo_ResultSet {
     
         public static void main(String[] args) throws Exception {
     
             String url = "jdbc:mysql://127.0.0.1:3306/db1";
             String username = "root";
             String password = "";
     
             // 1. 注册驱动
             Class.forName("com.mysql.jdbc.Driver");
     
             // 2. 获取连接
             Connection conn = DriverManager.getConnection(url, username, password);
     
             // 3. 定义sql
             String sql = "select * from goods";
     
             // 4. 获取执行sql的对象
             Statement stmt = conn.createStatement();
     
             ResultSet rs = stmt.executeQuery(sql);
     
             // 创建一个集合
             List<Goods> goodsList = new ArrayList<>();
     
             // 遍历rs的所有数据
             while (rs.next()) {
                 
                 // 对象的创建
                 Goods goods = new Goods();
     
                 int id = rs.getInt("id");
                 String goods_name = rs.getString("goods_name");
                 int goods_stock = rs.getInt("goods_stock");
     
                 // 给对象赋值
                 goods.setId(id);
                 goods.setGoods_name(goods_name);
                 goods.setGoods_stock(goods_stock);
     
                 // 存到集合里
                 goodsList.add(goods);
             }
     
             // 7. 释放资源
             rs.close();
             stmt.close();
             conn.close();
     
             // 验证集合
             System.out.println(goodsList);
         }
     }
     
     ```

     结果：

     ```bash
     [Goods{id=1, goods_name='无解', goods_stock=200}, Goods{id=2, goods_name='带我去多', goods_stock=21}]
     ```

     



### PreparedStatement

>   继承自`Statement`。所以它也是用来执行SQL的对象。

作用：

1.   预编译SQL语句并执行：**预防SQL注入问题**
2.   SQL注入：是通过操作输入修改事先定好的SQL语句，用于达到执行代码对服务器进行**攻击**的方法。



:::danger

登录的接口，经常是判断用户名和密码是否一致的时候，才能进行登录；加入此时输入的密码的内容为

`' or '1' == '1`，再次点击登录的时候，没做SQL注入防护的可能可以直接登录成功。

登录案例SQL：

```sql
select * from user where username = 'dwqdqwdqw' and password = '123';
```

SQL注入：

```sql
select * from user where username = 'dwqdqwdqw' and password = '' or '1' == '1';
```

这个操作就是，你直接将上面的输入的内容，直接复制到单引号内即可达到效果。

:::



建立对应的数据库和数据表(数据库还是db1)

```sql
drop table if exists user;
create table user (
	id int,
    username varchar(20),
    password varchar(20)
);

-- 添加数据
insert into user values(1, '张三', '123'), (2, '李四', '123');
```



**成功案例**

```java
package com.wx.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class JDBCDemo_UserLogin {

    public static void main(String[] args) throws Exception {

        String url = "jdbc:mysql://127.0.0.1:3306/db1";
        String username = "root";
        String password = "";

        // 1. 注册驱动
        Class.forName("com.mysql.jdbc.Driver");

        // 2. 获取连接
        Connection conn = DriverManager.getConnection(url, username, password);


        String name = "张三";
        String pwd = "123";

        // 3. 定义sql
        String sql = "select * from user where username = '" + name + "' and password = '" + pwd + "'";

        // 4. 获取执行sql的对象
        Statement stmt = conn.createStatement();

        ResultSet rs = stmt.executeQuery(sql);
        if (rs.next()) {
            System.out.println("登录成功");
        } else {
            System.out.println("登录失败");
        }
        // 7. 释放资源
        rs.close();
        stmt.close();
        conn.close();
    }
}

```



**SQL注入案例**

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20211201231646.png" alt="SQL注入案例" /></p>

```java
package com.wx.jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class JDBCDemo_UserLogin {

    public static void main(String[] args) throws Exception {
        testInjectSQL();
    }

    public static void testInjectSQL() throws Exception {
        String url = "jdbc:mysql://127.0.0.1:3306/db1";
        String username = "root";
        String password = "9264946";

        // 1. 注册驱动
        Class.forName("com.mysql.jdbc.Driver");

        // 2. 获取连接
        Connection conn = DriverManager.getConnection(url, username, password);


        String name = "张三";
        String pwd = "' or '1' = '1";

        // 3. 定义sql
        String sql = "select * from user where username = '" + name + "' and password = '" + pwd + "'";

        System.out.println(sql);

        // 4. 获取执行sql的对象
        Statement stmt = conn.createStatement();

        ResultSet rs = stmt.executeQuery(sql);
        if (rs.next()) {
            System.out.println("登录成功");
        } else {
            System.out.println("登录失败");
        }
        // 7. 释放资源
        rs.close();
        stmt.close();
        conn.close();
    }
}

```

```bash
select * from user where username = '张三' and password = '' or '1' = '1'
登录成功
```

:::tip

`and`会先执行，前面2个为true，后面在和`or`进行判断，后面是恒等的，就等于查询全部。

:::