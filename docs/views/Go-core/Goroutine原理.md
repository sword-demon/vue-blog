---
title: 'Goroutine原理'
date: 2022-05-02 17:42:15
# 永久链接
permalink: '/Go-core/goroutine'
sidebar: 'auto'
isShowComment: true
categories:
 - Go-core
tags:
 - null
---

# 

## Goroutine

>   Goroutine是一个与其他goroutines并行运行在同一个地址空间的`Go`函数或方法。一个运行的程序由一个或者更多个goroutine组成。它与线程、协程、进程等不同，`channels`则用于goroutines间的通信和同步访问控制。



### goroutine 和 thread 的区别

-   内存占用，创建一个goroutine的栈内存消耗为2KB(Linux AMD64 Gov1.4后)，运行过程中，如果栈空间不够用，会自动进行扩容。

    创建一个`thread`为了尽量避免极端情况下操作系统线程栈的溢出，默认会为其分配一个较大的栈内存(1-8MB的栈内存，线程标准`POSIX Thread`)，而且还需要一个被称之为“guard page”的区域用于和其他`thread`的栈空间进行隔离。而栈内存空间一旦创建和初始化完成之后其大小就不能再有变化，决定了在某些特殊场景下系统线程栈还是有溢出的风险。

-   创建/销毁，线程创建和销毁都会有巨大的消耗，是内核级的交互(trap)。

    `POSIX`线程(定义了创建和操纵线程的一套API)通常是在已有的进程模型中增加的逻辑扩展，所以线程控制和进程控制很相似。而进入内核调度所消耗的性能代价比较高，开销较大。goroutine是用户态线程，是由go runtime 管理，创建和销毁的消耗非常小。





## GMP调度模型





## Work-stealing 调度算法





## Goroutine Lifecycle

