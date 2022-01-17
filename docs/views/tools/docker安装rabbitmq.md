---
title: 'docker安装rabbitMQ'
date: 2022-01-16 23:11:15
# 永久链接
permalink: '/tools/docker-rabbitmq'
sidebar: 'auto'
isShowComment: true
categories:
 - tools
tags:
 - RabbitMQ
---



## 安装RabbitMQ

拉取镜像

```bash
docker pull rabbitmq:3.8.9
```



创建容器，分配300M内存

```bash
docker run -it -d --name mq -m 300m \
-p 4369:4369 -p 5672:5672 -p 15672:15672 -p 25672:25672 \
-e TZ=Asia/Shanghai \
rabbitmq:3.8.9

```



:::tip 注意

如果`docker pull rabbitmq`后面不带`management`，启动`rabbitmq`后是无法打开管理界面的，所以还是得下载带`management`插件的`rabbitmq`

```bash
docker search rabbitmq:management

docker pull rabbitmq:management

docker images
```

:::



## 创建容器

`rabbitmq`需要有映射以下端口：`5671`、`5672`、`4369`、`15671`、`15672`、`25672`

-   15672 (if management plugin is enabled)
-   15671 management监听端口，前台浏览器的控制界面
-   5672 5671 (AMQP 0-9-1 without and with TLS)
-   4368(epmd) epmd代表`Erlang`端口映射守护进程
-   25672 (Erlang distrubution)



```bash
docker run -d --hostname rabbit --name rabbit -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin -p 15672:15672 -p 5672:5672 rabbitmq:management
```

```bash
docker run -di --name=rabbit -e -p 5672:5672 -p 5671:5671 -p 4369:4369 -p 15671:15671 -p 15672:15672 -p 25672:25672 rabbitmq:management
```

>--hostname：设定容器的主机名，它会被写到容器内的 /etc/hostname 和 /etc/hosts，作为容器主机IP的别名，并且将显示在容器的bash中
>
>
>
>-e 参数
>RABBITMQ_DEFAULT_USER 用户名
>RABBITMQ_DEFAULT_PASS 密码
>
>不加则默认为 guest



创建后，控制台出现一行字符串表示创建成功

```bash
docker ps
```

查看运行中的容器



## 访问

`web`管理端

```
http://宿主机ip:15672

用户和密码都是 guest
```



## 启动失败处理

-   使用`docker ps`查看`mq`是否启动成功
-   使用`docker ps -a`查看是否启动进程
-   如果都没有成功，则查看是否有镜像：`docker images`
-   最后，可以使用`docker inspec 容器id/容器名称`查看是否有配置问题
-   `docker logs -f 容器id/容器名称`查看容器日志

