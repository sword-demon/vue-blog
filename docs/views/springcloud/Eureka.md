---
title: 'SpringCloud Eureka'
date: 2022-01-12 21:54:15
# 永久链接
permalink: '/springcloud/Eurekadesc'
sidebar: 'auto'
isShowComment: true
categories:
 - springcloud
tags:
 - null
---



## 介绍

核心功能：

-   `Service Registry(服务注册)`
-   `Service Discovery(服务发现)`



## 基本架构

Eureka由3个角色组成

-   **Eureka Server，提供服务注册与发现**
-   **Service Provider，服务提供方，将自身服务注册到 Eureka Server 上，从而让 Eureka Server 持有服务的元信息，让其他的服务消费方能够找到当前服务**
-   **Service Consumer，服务消费方，从 Eureka Server 上获取注册服务列表，从而能够消费服务**
-   **Service Provider/Consumer 相对于 Server，都叫做 Eureka Client**



## Eureka高可用

>**问题说明：单节点的 Eureka Server 虽然能够实现基础功能，但是存在单点故障的问题，不能实现高可用。因为 Eureka Server 中存储了整个系统中所有的微服务的元数据信息，单节点一旦挂了，所有的服务信息都会丢失，造成整个系统的瘫痪。**

**解决办法：搭建 Eureka Server 集群，让各个 Server 节点之间互相注册，从而实现微服务元数据的复制/备份，即使单个节点失效，其他的 Server 节点仍可以继续提供服务**

```yaml
# 优先加载
# 模拟多个实例

spring:
  application:
    name: coupon-eureka
  profiles: server1
server:
  port: 8000
eureka:
  instance:
    # 需要指定修改本机 hosts 指定的ip地址
    hostname: server1
    # SpringCloud不允许通过同一个ip地址的来配置相同的多个实例，这里需要改为false
    # 因为每一台单机，体现不出来高可用
    prefer-ip-address: false
  client:
    service-url:
      # 发现另外两个地址 实现互相注册的目的
      defaultZone: http://server2:8001/eureka/,http://server3:8002/eureka/

---
spring:
  application:
    name: coupon-eureka
  profiles: server2
server:
  port: 8001
eureka:
  instance:
    hostname: server2
    prefer-ip-address: false
  client:
    service-url:
      defaultZone: http://server1:8000/eureka/,http://server3:8002/eureka/

---
spring:
  application:
    name: coupon-eureka
  profiles: server3
server:
  port: 8002
eureka:
  instance:
    hostname: server3
    prefer-ip-address: false
  client:
    service-url:
      defaultZone: http://server1:8000/eureka/,http://server2:8001/eureka/
```

上述即为简单在本机实现多实例。