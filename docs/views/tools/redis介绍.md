---
title: 'redis介绍'
date: 2021-11-05 23:04:15
# 永久链接
permalink: '/tools/redis'
sidebar: 'auto'
isShowComment: true
categories:
 - tools
tags:
 - redis
---



## 支持的数据类型

-   String：最基本的类型
-   List：可以当成栈或者队列，使用链表实现
-   Hash：常用于存储个人信息，可以想象成Java的HashMap
-   Set：存储不重复的元素
-   SortedSet：有序，按照字节排序，常用于排行榜数据



### 特性

-   Redis的所有操作都是原子的
-   Redis可以对key设置过期时间
    -   定时删除
    -   惰性删除：被动删除
    -   定期删除：定期删除
-   Redis支持两种持久化方式：RDB(快照、默认)【了解即可，基本不用】、AOF(保存命令)





## redis速度快的原因

-   完全基于内存
-   数据结构简单
-   单线程、没有切换
-   多路IO复用模型



## 缓存穿透和缓存雪崩的问题

>   缓存穿透是指查询一个不存在的数据，但是由于`Cache`不命中，有需要去`db`中查询，造成的性能下降

**解决方案：给没有命中的`key`设定"没有意义的空值"**



>   缓存雪崩是指`Cache`设置相同的过期时间，导致`Cache`在同一时间失效，请求全部转发到`DB`，`DB`的瞬时压力过大，造成雪崩。

**解决方案：给`key`设定不同的(随机的)过期时间**





## Redis的IO模型

### Blocking I/O

![blocking io模型](https://gitee.com/wxvirus/img/raw/master/img/20211107190631.png)

**阻塞模型**的特点：当`read/write`对某一个文件描述符`fd`进行读写时，如果当前的`fd`不可读或不可写，则服务阻塞。



### `I/O`多路复用

![IO多路复用](https://gitee.com/wxvirus/img/raw/master/img/20211107190823.png)

**多路复用模型的特点**：同时监控`(select/epoll/poll)`多个文件描述符的可读写情况，当其中的某些文件描述符可读或者可写时，就范湖返回可读以及可写的文件描述符的个数。



### Redis的`Reactor`设计模式

![Reactor](https://gitee.com/wxvirus/img/raw/master/img/20211107191625.png)

IO即网络IO，多路即多个`TCP`连接，复用即为共用一个线程或进程，这个模型最大的优势是系统开销小，不比创建也不必维护过多的线程或进程。

`Reactor`设计模式，有时也称之为异步阻塞IO(异步指`socket`为`non-blocking`，堵塞指`select`堵塞)。

`Reactor`模式中一共有5个角色构成：

-   Handle(句柄或描述符)：本质上表示一种资源，或者就是文件描述符，是由操作系统提供的；该资源用于表示一个个的事件，事件既可以来自于外部，也可以来自于内部；外部的事件比如客户端的连接请求，客户端发送过来的数据等；内部事件比如操作系统产生的定时事件等。
-   `Synchronous Event Demultiplexer`同步事件分离器：它本身是一个系统调用，用于等待时间的发生(事件可能是一个，也可能是多个)。调用方在调用它的时候会被阻塞，一直阻塞到同步事件分离器上有事件产生为止。同步事件分离器对应的组件就是`Selector`；对应的阻塞方法就是`select`方法
-   `Event Handler`事件处理器：本身由多个回调方法构成，这些回调方法构成与应用相关的对于某个事件的反馈机制。
-   `Concrete Event Handler`(具体事件处理器)：是事件处理器的实现。它本身实现了事件处理器所提供的各种回调方法，从而实现了特定于业务的逻辑。它本质上就是我们所编写的一个个的处理器实现。
-   `Initiation Dispatcher`(初始分发器)：实际上就是Reactor角色。它本身定义了一些规范，这些规范用于控制事件的调度方式，同时又提供了应用进行事件处理器的注册、删除等设施。它本身是整个事件处理器的核心所在，Initiation Dispatcher会通过Synchronous Event Demultiplexer来等待事件的发生。一旦事件发生，Initiation Dispatcher首先会分离出每一个事件，然后调用事件处理器，最后调用相关的回调方法来处理这些事件。Netty中ChannelHandler里的一个个回调方法都是由bossGroup或workGroup中的某个EventLoop来调用的。



**具体深入的话，还是得去研究redis**





## reference

https://www.jianshu.com/p/0ab40a6da2d9
