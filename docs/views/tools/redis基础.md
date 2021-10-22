---
title: 'redis基础'
date: 2021-10-22 21:18:15
# 永久链接
permalink: '/tools/redis/base'
sidebar: 'auto'
isShowComment: true
categories:
 - tools
tags:
 - redis
---



## redis介绍

Redis是一个高性能的`key-value`数据格式的内存缓存，`NoSQL`数据库。`NoSQL`:`not only sql`，泛指非关系型数据库。

关系型数据库有：MySQL、Oracle、SQL Server、Sqlite

非关系型数据库：redis、hadoop、mangoDB

-   没有数据表的概念，不用的nosql数据库存放数据位置不同
-   nosql数据库没有通用操作语言
-   基本不支持事务，**redis支持简单事务**

---

它的存储类型有：

-   string 字符串
-   list 链表
-   set 集合
-   zset （sorted set 有序集合）
-   hash 哈希类型

>   这些数据类型都支持`push/pop、add/remove`及取交集并集和差集以及丰富的操作。而且这些操作是原子性的。在此基础上，redis支持各种不同方式的排序。与`memcached`一样，为了保证效率，数据都是缓存在内存中。区别的是`redis`会周期性的把更新的数据写入磁盘或者把修改的操作写入追加的记录文件，并且在此基础上实现了`master-slave`(主从)同步。redis是一款基于`CS`架构的数据库，所以redis有客户端，也有服务端。其中，客户端可以使用`python`等编程语言，也可以使用终端命令行工具。



### 优点

-   异常快速：redis是非常快的，每秒可以执行大约110000设置操作，81000个/秒的读取操作
-   支持丰富的数据类型
-   原子性：redis的所有操作都是原子性的，意思就是要么成功执行，要么失败完全不执行。当个操作时原子性的。多个操作也支持事务，即原子性，通过`MULTI`和`EXEC`指令包起来。
-   redis是一个多功能实用工具，可以再很多如，消息队列中实用（redis原生支持发布/订阅）
-   单线程特性，秒杀系统，基于redis是单线程特征，防止出现数据库“爆破”





## 典型应用

### 一、性能

redis中缓存热点数据，能够保护数据库，提高查询效率。当我们碰到需要执行耗时特别久，且结果不频繁变动的SQL，就特别适合将运行结果放入缓存，这样，后面的请求就去缓存中读取，使得请求能够迅速响应。



### 二、并发

在大量并发的情况下，所有的请求直接访问数据库，数据库会出现连接异常。这个时候，就需要使用redis做一个缓冲的操作，让请求先访问到redis，而不是直接访问数据库。



## 安装redis

-   系统：Ubuntu

```bash
sudo apt-get update
sudo apt-get install redis-server
```

-   MacOS

    ```bash
    brew install redis-cli
    ```

-   windows

    直接去找redis的客户端exe下载安装就完了。



**启动redis**

```bash
# 进入到redis安装目录
# linux

# 启动
redis-server  # 服务端

# 查看是否正在运行
redis-cli   # 客户端

# 将会打开一个redis提示符
redis 127.0.0.1:6379>

# 输入 ping
应答：PONG # 说明成功地在计算机上安装了redis
```

