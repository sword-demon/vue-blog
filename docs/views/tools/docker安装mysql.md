---
title: 'docker安装mysql'
date: 2022-01-10 00:16:15
# 永久链接
permalink: '/tools/docker-mysql'
sidebar: 'auto'
isShowComment: true
categories:
 - tools
tags:
 - null
---



## 下载镜像文件

```bash
sudo docker pull mysql:5.7
```

等待下载完成即可



下载完成后，使用`docker info`或者`docker images`来查看是否下载成功。



## 创建实例并启动

```bash
sudo docker run -p 3306:3306 --name mysql \
-v /mydata/mysql/log:/var/log/mysql \
-v /mydata/mysql/data:/var/lib/mysql \
-v /mydata/mysql/conf:/etc/mysql \
-e MYSQL_ROOT_PASSWORD=root \
-d mysql:5.7
```

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20220110001837.png" alt="参数说明" /></p>



:::tip sudo问题

如果我们连续使用`sudo`加上，会嫌比较麻烦，我们可以切换到`root`用户，且密码和`vagrant`一样

```bash
sudo root
# 输入 vagrant 即可
```

我这个是用`vagrant`创建的`centos7`虚拟机，如果是正常的服务器，可以不必这样。

:::



---

`mysql`容器运行后，我们查看是否运行成功：

```bash
docker ps
```

可以查看正在运行的容器。



我们使用本地数据库连接工具进行连接测试，连接地址为我们先前设置的虚拟机的`ip`地址即可。



---

我们可以进入容器交互的内部：

```bash
docker exec -it 可以写容器的id/或者容器名称 /bin/bash
```

可以进入到容器内部的控制台，我们可以查看`mysql`安装在哪里：

```bash
whereis mysql
```

```bash
mysql: /user/bin/mysql /user/lib/mysql /etc/mysql /user/share/mysql
```

可以看到以上的一些目录。



## 配置mysql

因为mysql内部配置的本身是没有`my.cnf`存在的，但是我们挂载的时候，就需要在我们本地创建一个对应的目录和配置文件，我们在外部的挂载的配置进行修改即可，就会同步docker的mysql修改。

`vim /mydata/mysql/conf/my.cnf`

```ini
[client]
default-character-set=utf8
 
[mysql]
default-character-set=utf8
 
[mysqld]
init_connect='SET collation_connection = utf8_unicode_ci'
init_connect='SET NAMES utf8'
character-set-server=utf8
collation-server=utf8_unicode_ci
skip-character-set-client-handshake
skip-name-resolve

```

修改完之后，需要输入`:wq`保存退出并且重启`mysql`服务

```bash
docker restart mysql
```



## 配置自动启动

>   我们开发的时候，虚拟机开启的时候，docker也不会自动启动，更别说docker的mysql容器也自动启动了。所以我们需要配置一下。

```bash
sudo docker update mysql --restart=always
```

设置mysql在docker启动的时候就会自动重启。