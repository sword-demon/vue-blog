---
title: '进程标识与fork'
date: 2022-04-02 14:02:15
# 永久链接
permalink: '/php/concurrent1'
sidebar: 'auto'
isShowComment: true
categories:
 - php
tags:
 - null
---

## 进程标识

>   一个程序被加载到内存中运行，系统会为这个进程分配相应的标识信息，比如 pid，ppid，uid，euid，pgid，sid，egid...etc



### 进程标识id号：pid

使用`php`的`posix_getpid`函数来获取进程id，此函数不能在`windows`下运行，必须在`linux`或者`macos`或者`unix`系统下运行才有效，否则会报错。



```php
fprintf(STDOUT, "pid=%s\n", posix_getpid());
```

`STDOUT`：标准输出，对应屏幕终端



我们如果直接这样运行，会直接运行完就结束，我们加一个死循环，保持运行，来查看进程

```php
fprintf(STDOUT, "pid=%s\n", posix_getpid());

while (1) {

}
```

使用`pstree`可以看出进程间的关系，父子，兄弟

```bash
├─sshd,1590 -D
  │   ├─sshd,26693
  │   │   ├─bash,27797
  │   │   │   └─php,29130 demo5.php
  │   │   ├─bash,29178
  │   │   │   └─pstree,29319 -ap
  │   │   └─sftp-server,26695
  │   └─sshd,29285

```

或者使用`ps -exj`来观察进程的运行状态，或者使用`ps -aux`



可以查看到对应的：`PID`、`PPID`、`PGID`、`UID`、`TTY`、`STAT`、`TIME`、`COMMAND`

```bash
27797 29130 29130 27797 pts/0    29130 R+       0   2:14 php demo5.php XDG_SESSION_ID=40751 HOSTNAME=VM-16-4-centos TERM=xterm-256color SHELL=/bin/b
```

-   `R`:运行状态
-   `Z`：僵尸状态
-   `S`：睡眠状态，可被唤醒
-   `T`：停止状态
-   `D`：也是睡眠，但是无法被唤醒



```php
fprintf(STDOUT, "pid=%s\n", posix_getpid()); // 进程自己的标识
fprintf(STDOUT, "ppid=%s\n", posix_getppid()); // 父进程的标识
fprintf(STDOUT, "pgid=%s\n", posix_getpgrp()); // 进程组长的 id
fprintf(STDOUT, "sid=%s\n", posix_getsid(posix_getpid())); // 会话id
fprintf(STDOUT, "uid=%s\n", posix_getuid()); // 用户标识 是指当前登录用户 实际用户uid
fprintf(STDOUT, "gid=%s\n", posix_getgid()); // 当前组 组id
fprintf(STDOUT, "euid=%s\n", posix_geteuid()); // 有效用户euid
fprintf(STDOUT, "egid=%s\n", posix_getegid()); // 有效组egid

while (1) {

}
```

```bash
pid=31919
ppid=27797
pgid=31919
sid=27797	# 当前会话id，就是bash的id
uid=0 # 如果切换当前root用户这边数据就会发生变化
gid=0
euid=0
egid=0

```

```bash
├─sshd,1590 -D
  │   ├─sshd,26693
  │   │   ├─bash,27797
  │   │   │   └─php,31919 demo5.php
  │   │   ├─bash,29178
  │   │   │   └─pstree,31939 -ap

```

查看当前用户的组

```bash
[root@VM-16-4-centos process]# cat /etc/passwd
root:x:0:0:root:/root:/bin/bash

# 下面还有很多，就不多列

# 主要是这2个
0:0
```

## fork

[php官网文档地址](https://www.php.net/manual/zh/function.pcntl-fork.php)



>   pcntl_fork — 在当前进程当前位置产生分支（子进程）。译注：fork是创建了一个子进程，父进程和子进程 都从fork的位置开始向下继续执行，不同的是父进程执行过程中，得到的fork返回值为子进程 号，而子进程得到的是0。



>`pcntl_fork`会执行两次，会返回两次
>
>第一次执行可能是父进程
>
>第二次执行可能是子进程



```php
// fork pcntl_fork 函数
// 会返回2次，会执行2次
// 第一次执行可能是父进程
// 第二次执行可能是子进程
// 父进程运行
fprintf(STDOUT, "现在我的标识是: pid=%d\n", posix_getpid());
$pid = pcntl_fork();
// fork执行之后，本行会有两个进程运行，分别是子进程和父进程 a, b 【父进程从fork开始运行，子进行从下面的打印函数开始运行】
// 子进程前面的代码 它不会运行
fprintf(STDOUT, "pid = %d ppid=%d.\n", posix_getpid(), posix_getppid());

```



:::tip 进程运行

1.   shell 终端输入 php demo5.php 之后
2.   这个父进程会从 $pid = pcntl_fork(); 开始运行，执行pcntl_fork函数
3.   这个函数执行成功之后，会创建一个子进程，子进程会复制父进程的代码段和数据段
4.   然后父进程继续执行 fprintf(STDOUT, "pid = %d run here.\n", posix_getpid());
5.   然后进程结束，子进程开始从 fprintf(STDOUT, "pid = %d run here.\n", posix_getpid()); 开始运行，执行打印语句
6.   语句之后，进程结束
7.   当父进程调用 pcntl_fork 之后，创建出来的子进程，这个时候就有两个进程,那么父进程和创建出来的子进程哪个进程先运行时无法确定的，也是无法知道的，是由操作系统来决定的，它的进程调度由系统决定
8.   一般情况下，都是父进程先运行，子进程后运行；如果说父进程先运行，先结束，这个时候这个子进程就没有父亲了,这个时候它就成为了孤儿进程，这个时候它会被1号进程接管,就是系统进程，是所有进程的父亲
9.   变成孤儿进程的后果：就是它跑到后台去运行了，它不在前台运行了。
10.   所以我们一般让父进程后结束，先让子进程先运行

:::



```bash
[root@VM-16-4-centos process]# php demo5.php 
现在我的标识是: pid=12778
pid = 12778 ppid=27797.
pid = 12779 ppid=12778.

```



### fork的一个工作流程

```php
<?php

// fork pcntl_fork 函数
// 会返回2次，会执行2次
// 第一次执行可能是父进程
// 第二次执行可能是子进程
// 父进程运行
fprintf(STDOUT, "现在我的标识是: pid=%d\n", posix_getpid());
$pid = pcntl_fork(); // fork 之后，它是一个普通的变量，它是数据，子进程就能复制

// 最好把0写在前面
if (0 == $pid) {
    // 子进程运行的开始的地方
    fprintf(STDOUT, "pid=%d 我是子进程开始运行了\n", posix_getpid());
} else {
    // 父进程
    sleep(2); // 睡眠的目的是让子进程线运行，父进程先睡眠
    fprintf(STDOUT, "pid=%d 我是父进程睡了2秒才开始运行了\n", posix_getpid());
}

// fork执行之后，本行会有两个进程运行，分别是子进程和父进程 a, b 【父进程从24行开始运行，子进行从27行开始运行】
// 子进程前面的代码 它不会运行
// 子进程得到的数据 $pid 得到的结果是0
fprintf(STDOUT, "pid = %d ppid=%d.\n", posix_getpid(), posix_getppid());

// 这一行结束
```

```bash
现在我的标识是: pid=25091
pid=25092 我是子进程开始运行了
pid = 25092 ppid=25091.
pid=25091 我是父进程睡了2秒才开始运行了
pid = 25091 ppid=25003.

```

>   这个才是一个正常的结束。

:::danger 注意

父进程必须先让子进程先结束！如果说父进程先结束，子进程被1号线程接管，变成孤儿进程。

如果说子进行先结束，父进程后结束，这种情况一般来说是正常的，但是父进程应该回收子进程。

也就是子进程结束时，还会生成一些数据，比如状态码等其他信息，并没有完全释放，需要父进程回收。

:::



![fork流程](https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/4021/20220404112841.png)



**COW技术**

![COW](https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/4021/20220404113657.png)



```php
if (0 == $pid) {
    // 子进程运行的开始的地方
    fprintf(STDOUT, "pid=%d 我是子进程开始运行了\n", posix_getpid());
    fprintf(STDOUT, "子进程变量pid = %d\n", $pid);
} else {
    // 父进程
    sleep(2); // 睡眠的目的是让子进程线运行，父进程先睡眠
    fprintf(STDOUT, "pid=%d 我是父进程睡了2秒才开始运行了\n", posix_getpid());
    fprintf(STDOUT, "父进程变量pid = %d\n", $pid);
}
```

子进程的`$pid`为0

```bash
[root@VM-16-4-centos process]# php demo5.php 
现在我的标识是: pid=29330
pid=29331 我是子进程开始运行了
子进程变量pid = 0
pid = 29331 ppid=29330.
pid=29330 我是父进程睡了2秒才开始运行了
父进程变量pid = 29331
pid = 29330 ppid=25003.

```

