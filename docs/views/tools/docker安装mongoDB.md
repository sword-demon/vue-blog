---
title: 'docker安装mongoDB'
date: 2022-01-16 23:11:15
# 永久链接
permalink: '/tools/docker-mongodb'
sidebar: 'auto'
isShowComment: true
categories:
 - tools
tags:
 - mongo
---



## 安装mongo镜像

可以搜索一下有什么适合你的版本的我这里下的是<kbd>4.4.7</kbd>

```bash
docker search mongo
```

```bash
docker pull mongo:4.4.7
```



## 配置本地卷

在你们合适的目录新建对应的进行映射的目录，我是在用户目录下新建了一个`mydata/mongo`文件夹，用于存储映射的一些相关的文件。



需要在目录下新建一个配置文件：`mongod.conf`

```conf
net:
   port: 27017
   bindIp: "0.0.0.0"

storage:
   dbPath: "/data/db"

security:
   authorization: enabled

```



:::tip

MacOS无法使用`root`目录，所以我们需要换成其他的目录，别的系统的就算了。

:::



## 创建容器运行

>   创建容器，为MongoDB分配500M内存

```bash
docker run -it -d --name mongo -p 27017:27017 \
-v /Users/yourname/mydata/mongo:/etc/mongo -m 500m \
-e MONGO_INITDB_ROOT_USERNAME=admin \
-e MONGO_INITDB_ROOT_PASSWORD=admin \
-e TZ=Asia/Shanghai \
mongo:4.4.7 --config /etc/mongo/mongod.conf

```

-   MONGO_INITDB_ROOT_USERNAME: 设置用户名
-   MONGO_INITDB_ROOT_PASSWORD: 设置密码



## 本地连接测试

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20220116231846.png" alt="本地连接测试" /></p>

:::warning 注意主机名

先前我默认是`localhost`，出现错误，后来也换了我本机的`ip`地址进行测试，谁知道最后直接`127.0.0.1`就可以。

:::