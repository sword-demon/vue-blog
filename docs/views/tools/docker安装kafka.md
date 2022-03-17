---
title: 'docker安装kafka'
date: 2022-03-17 22:53:15
# 永久链接
permalink: '/tools/dockerkafka'
sidebar: 'auto'
isShowComment: true
categories:
 - tools
tags:
 - null
---



## docker安装kafka

1.   下载镜像

     ```bash
     docker pull wurstmeister/zookeeper  
     docker pull wurstmeister/kafka 
     ```

2.   启动`zookeeper`容器

     ````bash
     docker run -d --name zookeeper -p 2181:2181 -t wurstmeister/zookeeper
     ````

3.   启动`kafka`容器

     ```bash
     docker run  -d --name kafka -p 9092:9092 -e KAFKA_BROKER_ID=0 -e KAFKA_ZOOKEEPER_CONNECT=ip:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://ip:9092 -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 -t wurstmeister/kafka
     ```

     

