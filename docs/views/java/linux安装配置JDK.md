---
title: 'linux安装配置JDK'
date: 2022-01-01 18:26:15
# 永久链接
permalink: '/java/jdkinstall'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - jdk
---



## 下载

去`oracle`的官网去下载JDK即可，或者别的啥资源地址。



## Linux安装配置

通过SFTP或者FTP或者SSH连接到服务器将对应的JDK发送到服务器

例：`jdk-8u202-linux-x64.tar.gz`

先进行解压

```bash
tar -zxvf jdk-8u202-linux-x64.tar.gz
```

解压完，对文件目录进行重新命名为简单的名称：`jdk1.8`

---

找到`/etc/profile`文件，以文本形式打开，新增三行代码

```txt
export JAVA_HOME=/root/jdk1.8
export PATH=$JAVA_HOME/bin:$PATH
export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
```

然后更新到服务器上。



执行指令，让这三行生效

```bash
source /etc/profile
```

输出`java -version`进行检测

