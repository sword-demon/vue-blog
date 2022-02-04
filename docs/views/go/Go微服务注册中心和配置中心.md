---
title: 'Go微服务注册中心和配置中心'
date: 2022-02-01 22:36:15
# 永久链接
permalink: '/go/consul'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - null
---



Consul官网地址：[https://www.consul.io/](https://www.consul.io/)

## 注册中心Consul的关键功能

-   服务发现：客户端可以注册服务，程序可以轻松找到他们所依赖的服务。
-   运行状态检查：Consul客户端可以提供任意数量的运行状况检查。
-   KV存储：应用程序可以将Consul的层级键、值存储用于任何目的，包括动态配置，功能标记，协调，领导者选举等。
-   安全服务通信：Consul可以为服务生成和分发TLS证书，建立相互的TLS连接。
-   多数据中心：Consul支持多个数据中心。



## 注册中心Consul的两个重要协议

-   Gossip Protocol(八卦协议)

    -   局域网池(LAN Pool)

        >   -   让Client端自动发现Server节点，减少所需的配置量
        >   -   分布式故障检测在某几个Server机上执行
        >   -   能够用来快速的广播事件

    -   广域网池(WAN Pool)

        >-   WAN Pool全局唯一的
        >-   不同的数据中心的Server都会加入 WAN Pool
        >-   允许服务器执行跨数据中心请求

-   Raft Protocol(选举协议)



## 注册中心Consul的主要特性

-   服务发现
-   健康检查
-   键值对存储



## 注册中心Consul的访问过程

![Consul注册中心访问过程](https://gitee.com/wxvirus/img/raw/master/img/20220201224943.png)



## 注册中心Consul安装(Docker)

```bash
docker pull consul

docker run -d -p 8500:8500 consul
```

