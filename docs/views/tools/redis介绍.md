---
title: 'redis介绍'
date: 2021-11-05 23:04:15
# 永久链接
permalink: '/tools/redis'
sidebar: 'auto'
isShowComment: true
categories:
 - tools
tags:
 - redis
---



## 支持的数据类型

-   String：最基本的类型
-   List：可以当成栈或者队列，使用链表实现
-   Hash：常用于存储个人信息，可以想象成Java的HashMap
-   Set：存储不重复的元素
-   SortedSet：有序，按照字节排序，常用于排行榜数据



### 特性

-   Redis的所有操作都是原子的
-   Redis可以对key设置过期时间
    -   定时删除
    -   惰性删除：被动删除
    -   定期删除：定期删除
-   Redis支持两种持久化方式：RDB(快照、默认)【了解即可，基本不用】、AOF(保存命令)



