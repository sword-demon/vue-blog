---
title: 'nacos部署'
date: 2021-11-13 22:31:15
# 永久链接
permalink: '/java/nacos/bs'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## 部署Alibaba Nacos 单机版本

-   下载地址：[nacos release下载地址](https://github.com/alibaba/nacos/releases)
-   [nacos官网](https://nacos.io/zh-cn/index.html)



**将下载的gz包进行解压缩**

```bash
tar -zxvf nacos-server-2.0.0.tar.gz
```

**进入nacos目录运行**

Linux/Unix/Mac

```bash
 cd nacos/bin
 ./startup.sh -m standalone
```

Windows

```powershell
startup.cmd -m standalone
```



```bash
jps # 查看当前运行的进程

40595 nacos-server.jar
57351 Jps
```

出现上述的`nacos-server.jar`即可

到浏览器里输入 [127.0.0.1:8848/nacos](127.0.0.1:8848/nacos)即可进行访问

因为它的配置文件(`nacos/conf/application.properties`)里

```properties
 server.servlet.contextPath=/nacos
```

所以需要访问的时候加上`nacos`结尾。



这里需要对配置文件进行小小的修改一下：

```properties
 #*************** Config Module Related Configurations ***************#
 ### If use MySQL as datasource:
 spring.datasource.platform=mysql
 
 ### Count of DB:
 db.num=1
 
 ### Connect URL of DB:
 db.url.0=jdbc:mysql://127.0.0.1:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&soc    ketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
 db.user.0=root
 db.password.0=root
```

需要将`MySQL`的配置注释的地方进行删除，配置nacos的`MySQL`数据库名称为`nacos-config`，或者不改也行。其他的数据库的用户名和密码就按照各自的来。

`nacos`配置文件夹里也有案例的`sql`文件：`schema.sql`、`nacos-mysql.sql`，数据库的里的表基本是来自于这两个`sql`，可以各自去对照着，如果你的数据库名称改了，也要相对于的进行修改一下。在去数据库里执行相关的`sql`。

如果能够访问`nacos`的网页了，我们进行一项测试，打开命名空间，添加一个你自己想要添加的命名空间，然后去数据库里输入以下查询命令查看是否添加成功。

```sql
SELECT COUNT(*) as count FROM `nacos_config`.`tenant_info`;
```

如果有内容了，说明你添加成功了。基础的配置到这里也就完成了。