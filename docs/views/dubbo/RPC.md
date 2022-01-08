---
title: 'RPC'
date: 2022-01-08 13:49:15
# 永久链接
permalink: '/dubbo/rpc'
sidebar: 'auto'
isShowComment: true
categories:
 - dubbo
tags:
 - null
---



# RPC



## 什么是RPC

> RPC【Remote Procedure Call】是指远程过程调用，是一种进程间通信的方式，他是一种技术的思想，而不是规范。它允许程序调用另一个地址空间(通常是共享网络上的另一台机器上)的过程或函数，而不用程序员显式编程这个远程调用的细节。即程序员无论是调用本地还是远程的函数，本质上编写的调用代码基本相同。



## RPC基本原理

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20220108134343.png" alt="rpc原理图" /></p>

即：A服务器先跟B服务器先建立起网络连接，将信息传送给B服务器，B服务器就知道A需要调用哪些方法，就调用方法，调用完将返回值通过网络在返回给A服务器，A服务器再接收到具体的返回值信息。



1.   A和B要建立连接，即通信效率
2.   A和B传递数据需要序列化和反序列化



>   所以，影响一个`RPC`框架性能的有两点，看一个`RPC`框架能否快速的在各个服务器之间建立连接，以及序列化和反序列化速度快不快。



RPC的框架有很多：

-   dubbo
-   gRPC
-   Thrift
-   HSF(High Speed Service Framework)



