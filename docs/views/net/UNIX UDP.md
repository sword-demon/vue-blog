---
title: 'UNIX UDP'
date: 2022-07-07 21:45:15
# 永久链接
permalink: '/net/unix_udp'
sidebar: 'auto'
isShowComment: true
categories:
 - net
tags:
 - null
---



## UNIX UDP

unix域有2种套接字：TCP和UDP

命名UNIX，需要绑定地址



服务端

```php
<?php

$unix_sock = "udp.sock";

$sock = socket_create(AF_UNIX, SOCK_DGRAM, 0);

if (!socket_bind($sock, $unix_sock)) {
    fprintf(STDOUT, "bind error:%s\n", socket_strerror(socket_last_error($sock)));
}

if (socket_recvfrom($sock, $buf, 1024, 0, $unixFile)) {
    fprintf(STDOUT, "data :%s, file :%s\n", $buf, $unixFile);

    socket_sendto($sock, $buf, strlen($buf), 0, $unixFile);
}

socket_close($sock);
```

客户端

```php
<?php

$server_unix_sock = "udp.sock";
$client_unix_sock = "udp1.sock";

$sock = socket_create(AF_UNIX, SOCK_DGRAM, 0);

// 绑定客户端的文件
if (!socket_bind($sock, $client_unix_sock)) {
    fprintf(STDOUT, "bind error:%s\n", socket_strerror(socket_last_error($sock)));
}

echo socket_sendto($sock, "test", 4, 0, $server_unix_sock);

echo socket_recvfrom($sock, $buf, 128, 0, $unixFile);
fprintf(STDOUT, "data :%s, file :%s\n", $buf, $unixFile);

socket_close($sock);
```

运行

```bash
[root@jb51 process]# php unix_udp_server.php 
data :test, file :udp1.sock
```

```bash
[root@jb51 process]# php unix_udp_client.php 
44data :test, file :udp.sock
```

