---
title: 'SUID特权进程'
date: 2022-04-12 09:10:15
# 永久链接
permalink: '/php/suid'
sidebar: 'auto'
isShowComment: true
categories:
 - php
tags:
 - null
---



## SUID，SGID

>   `set user ID` 设置用户ID
>
>   `set group Id` 设置组ID



```bash
[root@jb51 process]# ls -al demo1.c 
-rw-r--r-- 1 root root 239 Mar 31 22:26 demo1.c
```

-   `-`：代表是普通文件

-   `rw-`：代表是`root`用户的可读可写

-   后面只有读权限

    

>   当特殊标志`s`这个字符出现在文件拥有者的`x`权限位的时候就叫`set UID`，简称`SUID`，或是叫`SUID`特权
>
>   如果出现在组的权限位的时候就叫`SGID`



一个特殊的文件

```bash
[root@jb51 process]# ls -al /bin/passwd 
-rwsr-xr-x 1 root root 27856 Apr  1  2020 /bin/passwd
```

这个文件是`ELF`可执行文件

```bash
[root@jb51 process]# file /bin/passwd 
/bin/passwd: setuid ELF 64-bit LSB shared object, x86-64, version 1 (SYSV), dynamically linked (uses shared libs), for GNU/Linux 2.6.32, BuildID[sha1]=dee1b9ab6618c6bfb84a14f85ba258c742cf4aec, stripped
```



## SUID,SGID的用途

>   一般来说，以`root`用户启动的程序都是超级进程，它这种进程权限特别大，一般来说都是一些重要的服务程序，有时候我们经常是以普通用户来执行程序的，比如：`web`目录一般是以`www`用户。但有时候普通进程需要访问一些特殊的资源，这个时候就需要提升权限来访问，比如修改密码之后普通用户来查看密码文件。

```bash
[root@jb51 process]# ls -al /etc/shadow
---------- 1 root root 842 Apr  8 12:53 /etc/shadow
```

这里可以看出普通用户是没有任何权限的。但是普通用户是可以通过`/bin/passwd`这个`ELF`可执行文件来修改`/etc/shadow`文件以达到修改密码，但不可以直接去修改密码文件。

这个程序你之所以可以使用，是因为有一个`s`在`x`权限位，特权，你才能进行修改。



如何设置`SUID`：

>   就在可执行文件的权限`x`位上设置`chmod u/g/o + s (elf file 即ELF文件)`



我们可以使用`root`用户创建一个`pwd.txt`文件，切换普通用户去测试。

这里我们还写了一个可执行文件，使用`c`语言写一个文件的设置特权的代码。

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>

int main()
{
    char *fileName = "pwd.txt";

    int uid = getuid();
    int euid = geteuid();

    printf("uid: %d, euid: %d\n", uid, euid);

    setuid(euid)
    seteuid(euid);

    uid = getuid();
    euid = geteuid();
    printf("uid=%d, euid=%d\n", uid, euid);

    if (access(fileName, W_OK) == 0)
    {
        printf("我能修改此文件\n");
    }
    else
    {
        printf("我不能修改此文件\n");
    }
    return 0;
}
```

然后对其进行编译得到可执行文件`pwd`，然后使用`linux`创建一个新的用户，切换，使用`pwd`可执行文件来运行即可。



我们来使用`php`来重写一下：

```php
<?php

$file = "pwd.txt";

$uid = posix_getuid();
$euid = posix_geteuid();

fprintf(STDOUT, "uid: %d, euid: %d\n", $uid, $euid);

// 这样设置是不行的
posix_setuid($euid);
posix_seteuid($euid);

// 判断是否可以写
if (posix_access($file, POSIX_W_OK)) {
    fprintf(STDOUT, "File %s is writable\n", $file);
} else {
    fprintf(STDOUT, "File %s is not writable\n", $file);
}
```

```bash
[root@jb51 process]# php demo_12.php 
uid: 0, euid: 0
File pwd.txt is writable
```

现在`demo12.php`并不是可执行文件，只是一个普通的文本文件，是无法直接执行的。如果直接使用`chmod u+s demo12.php`是不行的，权限位会变成大写的`S`，毫无意义，所以还是需要改回来，`chmod u-s demo12.php`，所以说，我们应该在`php`的解释器的可执行文件，`chmod u+s /usr/bin/php` 设置`SUID`，然后以普通用户执行`php demo12.php`即可修改。



我们可以加上一段代码来进行测试

```php
<?php

$file = "pwd.txt";

// 当前账号uid
$uid = posix_getuid();
$euid = posix_geteuid();

fprintf(STDOUT, "uid: %d, euid: %d\n", $uid, $euid);

// 这样设置是不行的
posix_setuid($euid);
posix_seteuid($euid);

// 提权，【修改权限以便能访问特殊资源】
$uid = posix_getuid();
$euid = posix_geteuid();

fprintf(STDOUT, "uid: %d, euid: %d\n", $uid, $euid);

// 判断是否可以写
if (posix_access($file, POSIX_W_OK)) {
    fprintf(STDOUT, "File %s is writable\n", $file);
    $fd = fopen($file, "a");
    fwrite($fd, "php is the best!\n");
    fclose($fd);
} else {
    fprintf(STDOUT, "File %s is not writable\n", $file);
}
```

然后进行查看文件是否真得改了。

```bash
[root@jb51 process]# php demo_12.php 
uid: 1001, euid: 0
File pwd.txt is writable
[root@jb51 process]# cat pwd.txt 
hello world
php is the best!
```



:::warning 注意

平常开发，程序一般是以普通用户启动的进程，它是无法访问需要权限的资源的，所以我们通过`SUID`提权以便能访问需要权限的资源。



>   注意：提权访问完之后，一定要改回来，改回普通用户，后果可能会很严重！在编写特权进程时，提权访问资源之后一定要改回来！

:::