---
title: '进程exec'
date: 2022-04-08 14:33:15
# 永久链接
permalink: '/php/concurrentexec'
sidebar: 'auto'
isShowComment: true
categories:
 - php
tags:
 - null
---



## 进程exec

>   `exec`函数用来执行一个程序，`php`中封装好的`pcntl_exec`函数，它内部的系统调用的是`execve`函数。



一般的用法：

-   父进程先创建一个子进程，然后子进程调用这个函数
-   正文段【代码段】+ 数据段会被新程序替换，它的一些属性会继承父进程的，`PID`并没有发生什么变化



父进程

```php
<?php

function showId()
{
    $pid = posix_getpid();
    fprintf(STDOUT, "pid=%d,ppid=%d,gpid=%d,sid=%d,uid=%d,gid=%d\n",
        $pid, posix_getppid(), posix_getpgid($pid), posix_getsid($pid),
        posix_getuid(), posix_getgid());
}


showId();

$pid = pcntl_fork();
if ($pid == 0) {
    // 第一个参数可执行文件
    pcntl_exec("demo9_2", array("a", "b", "c"));
}

// 父进程回收，阻塞运行
$pid = pcntl_wait($status);
if ($pid > 0) {
    fprintf(STDOUT, "exit pid=%d\n", $pid);
}
```



子进程写一个可执行文件`demo9_2`

```php
#!/usr/bin/php

<?php

function showId($str)
{
    $pid = posix_getpid();
    fprintf(STDOUT, "%s,pid=%d,ppid=%d,gpid=%d,sid=%d,uid=%d,gid=%d\n", $str,
        $pid, posix_getppid(), posix_getpgid($pid), posix_getsid($pid),
        posix_getuid(), posix_getgid());
}


showId("child: ");

print_r($argv);

echo posix_getpid();
```

```bash
[root@jb51 process]# php demo9.php 
parent: , pid=13351,ppid=17006,gpid=13351,sid=17006,uid=0,gid=0

child: ,pid=13352,ppid=13351,gpid=13351,sid=17006,uid=0,gid=0
Array
(
    [0] => demo9_2
    [1] => a
    [2] => b
    [3] => c
)
13352exit pid=13352
```



使用`strace`命令去追踪解析



```bash
strace -f -s 65500 -o demo9.log php demo.9.php
```

```bash
# 第一句
14279 execve("/usr/bin/php", ["php", "demo9.php"], 0x7ffca8aa36a0 /* 25 vars */) = 0

# 使用clone来创建进程
14279 clone(child_stack=NULL, flags=CLONE_CHILD_CLEARTID|CLONE_CHILD_SETTID|SIGCHLD, child_tidptr=0x7fa224174c50) = 14280

# 可以看到我们执行这个可执行文件的时候是使用的是 execve 函数 来执行
14280 execve("demo9_2", ["demo9_2", "a", "b", "c"], 0x23c7010 /* 25 vars */) = 0
```

