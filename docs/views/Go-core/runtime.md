---
title: 'runtime'
date: 2022-05-12 22:35:15
# 永久链接
permalink: '/Go-core/runtime'
sidebar: 'auto'
isShowComment: true
categories:
 - Go-core
tags:
 - runtime
---

[toc]



## Runtime

我们可以打开Goland打开任意go项目，里面有一个`External Libraries`，这里有`Go`提供的各种源码包，里面有一个`runtime`包。

![runtime](https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/4021/20220512223729.png)



到底什么是`runtime`呢，从字面上来看，就是“运行时”，指的就是语言在运行时支撑的部分。



其实很多语言都有`Runtime`，换一种说法就是程序的运行环境。

-   Java：Java虚拟机
-   JavaScript：浏览器内核或者Node内核



### `Go`的`Runtime`特点：

-   Go没有虚拟机的概念
-   `Runtime`作为程序的一部分打包进二进制产物
-   `Runtime`随用户程序一起运行
-   `Runtime`与用户程序没有明显界限，直接通过函数调用

![特点](https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/4021/20220512224131.png)



### `Runtime`的能力

-   内存管理能力

-   垃圾回收能力（GC）

-   超强的并发能力(协程调度)，也是`Runtime`给我们处理的

-   有一定的屏蔽系统调用能力，为了让go语言可以做到跨平台，在各个操作系统上的方式会帮我们进行处理

-   一些go的关键字其实是`Runtime`下的函数

    | 关键字 |               函数               |
    | :----: | :------------------------------: |
    |   go   |             newproc              |
    |  new   |            newobject             |
    |  make  | makeslice，makechain，makemap... |
    |   <-   |       chansend1, chanrecv1       |

    <span style="color: orange;">编译的时候会把左侧的转成右侧的函数调用，才会有意义。</span>



### 总结

-   Go的Runtime负责内存管理、垃圾回收、协程调度
-   Go的Runtime被编译为用户程序的一部分、一起运行