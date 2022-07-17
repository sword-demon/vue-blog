---
title: 'UNIX TCP'
date: 2022-07-07 20:45:15
# 永久链接
permalink: '/net/unix_tcp'
sidebar: 'auto'
isShowComment: true
categories:
 - net
tags:
 - null
---

## UNIX TCP

>   UNIX 通信域 TCP 套接字

服务端

```php
<?php


$socket = socket_create(AF_UNIX, SOCK_STREAM, 0);

socket_bind($socket, "unix.sock");

socket_listen($socket, 5);

$conn = socket_accept($socket);

if (is_resource($conn)) {
    echo "new recv from" . socket_read($conn, 128) . PHP_EOL;
    echo "write len:" . socket_write($conn, "hello", 5);
}

socket_close($conn);
socket_close($socket);
```

客户端

```php
<?php


$socket = socket_create(AF_UNIX, SOCK_STREAM, 0);

if (socket_connect($socket, "unix.sock")) {
    fprintf(STDOUT, "connect ok!\r\n");
    echo "send:" . socket_write($socket, "client", 6);

    echo "recv:" . socket_read($socket, 128);
}

socket_close($socket);
```



```bash
[root@jb51 process]# php unix_server.php 
new recv fromclient
write len:5
```

```bash
[root@jb51 process]# php unix_client.php 
connect ok!
send:6recv:hello
```

此时调用完了，会生成一个文件`unix.sock`，下次再次运行就会进行报错，因为它已经存在了，所以下次我们运行的时候需要将它删除。



```bash
rm -rf unix.sock
```



使用`strace -f -s 6550 php unix_client.php`

```bash
read(3, "<?php\n\n\n$socket = socket_create(AF_UNIX, SOCK_STREAM, 0);\n\nif (socket_connect($socket, \"unix.sock\")) {\n    fprintf(STDOUT, \"connect ok!\\r\\n\");\n    echo \"send:\" . socket_write($socket, \"client\", 6);\n\n    echo \"recv:\" . socket_read($socket, 128);\n}\n\nsocket_close($socket);", 4096) = 270
close(3)                                = 0
munmap(0x7f3254f9c000, 4096)            = 0
socket(AF_UNIX, SOCK_STREAM, 0)         = 3
connect(3, {sa_family=AF_UNIX, sun_path="unix.sock"}, 11) = 0
write(1, "connect ok!\r\n", 13connect ok!
)         = 13
write(3, "client", 6)                   = 6
write(1, "send:6", 6send:6)                   = 6
recvfrom(3, "hello", 128, 0, NULL, NULL) = 5
write(1, "recv:hello", 10recv:hello)              = 10
close(3)                                = 0
close(0)                         
```

可以看到一些底层使用的函数和调用的方法。