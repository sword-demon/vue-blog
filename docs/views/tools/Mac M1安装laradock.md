---
title: 'Mac M1安装laradock'
date: 2022-02-21 21:04:15
# 永久链接
permalink: '/tools/installlaradock'
sidebar: 'auto'
isShowComment: true
categories:
 - tools
tags:
 - null
---



## 安装配置

github地址：[https://github.com/laradock/laradock](https://github.com/laradock/laradock)

文档、官网地址：[http://laradock.io/](http://laradock.io/)



1.   克隆代码

     ```bash
     git clone https://github.com/Laradock/laradock.git
     ```

2.   复制配置文件

     ```bash
     cp .env.example .env
     ```

3.   因为是M1系统，所以需要在`docker-compose.yml`中的`mysql`部分进行修改

     ```yaml
     mysql:
           image: mysql:8.0.19
           platform: 'linux/x86_64'
           build:
             context: ./mysql
             args:
               - MYSQL_VERSION=${MYSQL_VERSION}
           environment:
             - MYSQL_DATABASE=${MYSQL_DATABASE}
             - MYSQL_USER=${MYSQL_USER}
             - MYSQL_PASSWORD=${MYSQL_PASSWORD}
             - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
             - TZ=${WORKSPACE_TIMEZONE}
           volumes:
             - ${DATA_PATH_HOST}/mysql:/var/lib/mysql
             - ${MYSQL_ENTRYPOINT_INITDB}:/docker-entrypoint-initdb.d
           ports:
             - "${MYSQL_PORT}:3306"
           networks:
             - backend
           user: mysql
     ```

4.   后面还可能因为网络问题，导致`Service php-fpm build failed`，修改`docker-compose.yml`

     ```yaml
     WORKSPACE_TIMEZONE=UTC  # 换成 PRC
     ```

     如果没有很好的访问国外`raw.github.com`类似的网址的，建议去`hosts`文件添加，如果有，那就另当别论。

5.   启动容器 ，根据自己需要的镜像来启动

     ```bash
     docker-compose up -d redis mysql nginx workspace
     ```

     进行等待漫长的下载过程即可。



如果最后都有一个绿色的`done`显示，并且没有`error`，再使用`docker ps`查看运行的容器是否运行成功。



因为我们使用这个，仅仅需要一个`workspace`，所以我们需要进入`workspace`的控制台。

```bash
docker-compose up exec workspace bash
```



![文件映射关系](https://gitee.com/wxvirus/img/raw/master/img/20220221211556.png)

我这里目录放的有点草率了，导致当前上一级目录都被映射到容器内部去了，浪费了。所以你们需要找一个当前`laradock`目录上一级是个除了`laradock`以外没啥东西的地方去弄比较合适。

