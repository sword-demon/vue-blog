---
title: 'bash进程与终端'
date: 2022-05-03 08:24:15
# 永久链接
permalink: '/php/bash'
sidebar: 'auto'
isShowComment: true
categories:
 - php
tags:
 - null
---



## bash进程与终端





>   我们通过`ssh client`连接`sshd`服务，它是一个守护进程，它的实现协议是`tcp/ip`
>
>   `sshd`接收客户端连接之后，通过`clone,fork一个进程`，同时打开伪终端主设备文件`/dev/ptmx`
>
>   然后再`fork`一个进程，同时启动`bin/bash [etc/passwd] 进程`，该进程会打开一个伪终端从设备文件`dev/pts`，这个伪终端能实现数据输入，还能实现数据输出。这个进程对应的键盘、显示器，假设对应关系为，键盘：0，显示器1,2
>
>   主从设备终端通过伪终端设备驱动程序进行通信的
>
>    
>
>   `ssh`客户端输入的数据，我们可以认为，当做远程服务器的输入
>
>   远程服务器的输出通过`tcp/ip`协议传输到`ssh`客户端
>
>    
>
>   `bin/bash`接收到数据是要经过`tcp/ip`，伪终端设备驱动程序来完成的，
