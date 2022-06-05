---
title: 'rpc'
date: 2022-06-05 21:20:15
# 永久链接
permalink: '/go/rpc'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - null
---



## 什么是RPC

1.   RPC(Remote Procedure Call)远程过程调用，简单的理解就是一个节点请求另一个节点提供的服务。
2.   对应rpc的是本地过程调用，函数调用是最常见的本地调用过程
3.   将本地过程调用变成远程过程调用会面临各种问题



<!--more-->

### 为什么要用RPC调用

1.   分布式的应用
2.   大的单体应用进行微服务拆分，一个业务流程就会涉及到很多的机器上的很多服务
3.   服务A调用服务B，通过`RESTFul Api`调用的效率比较低
4.   微服务的场景下，大家一般都用RPC调用

## 本地过程调用

```python
def add(a, b):
    return a + b

total = add(1, 2)
print(total)
```

函数调用过程：

1.   将1和2压入`add`函数的栈
2.   进入`add`函数，从栈中取出1和2分别赋值给`a`和`b`
3.   执行`a + b`将结果压栈
4.   最后将结果出栈，赋值给`total`，然后打印出数据



## 远程过程调用面临的问题

1.   原本本地的函数放到另外一台服务器上去运行，会引入很多新的问题，即怎么连接到其他的电脑(机器、容器)

2.   怎么跨内存空间找到要调用的函数

3.   跨语言的调用传输过程中怎么处理数据

4.   Call的ID映射(不一定叫这个，但是一定是唯一的)

     >   我们怎么告诉远程机器我们要调用`add`，而不是`sub`或者`foo`呢？在本地调用中，函数体是直接通过函数指针来指定的，我们调用`add`，编译器就自动帮我们调用它的函数指针。但是在远程调用中，函数指针是不行的，因为两个进程的地址空间是完全不一样的。
     >
     >   所以在RPC中，所有的函数必须有自己的一个`ID`，这个`ID`在所有进程中都是唯一确定的。客户端在做远程过程调用时，必须附上这个`ID`，然后我们还需要在客户端和服务端分别维护一个`{函数 <--> Call ID}`的对应表。两者的表不一定需要完全相同，但相同的函数对应的`Call ID`必须相同。当客户端需要进行远程调用时，它就查一下这个表，找出相应的`Call ID`，然后把它传给服务端，服务端也通过查表，来确定客户端需要调用的函数，然后执行响应的函数的代码。

5.   **序列化和反序列化**

     >   客户端怎么把参数值传给远程的函数呢？在本地调用中，我们只需要将参数压栈，然后让函数自己去栈里读就行。
     >
     >   但是在远程过程调用时，客户端跟服务端是不同的进程，不能通过内存来传递参数。甚至有时候客户端和服务端使用的都不是同一种语言。
     >
     >   这个时候就需要客户端把参数先转成一个字节流，传给服务端后，再把字节流转成自己可以读取的格式，这个过程叫序列化和反序列化。
     >
     >   同理，从服务端返回的值也需要序列化和反序列化的过程。

6.   **网络传输问题**

     >   远程调用往往用在网络上，客户端和服务端是通过网络连接的。所有的数据都是需要通过网络传输，因此就需要有一个网络传输层。
     >
     >   网络传输层需要把`Call ID`和序列化后的参数字节流传给服务端，然后再把序列化后的调用结果传回给客户端。
     >
     >   只要能完成这两者的，都可以作为传输层使用。因此，它锁使用的协议其实是不限的，能完成传输就行，尽管大部分RPC框架都使用TCP协议，但是其实UDP也可以，而`gRPC`干脆就用了`HTTP2`。`Java`的`Netty`也属于这层的东西。

     `HTTP`协议来说，有一个问题：一次性，一旦对方反悔了结果，连接断开。所以`gRPC`的`HTTP2.0`可以实现长连接，且兼容`HTTP`协议。



## 基于HTTP的RPC调用

1.   通过HTTP协议进行连接
2.   基于TCP/IP协议连接，HTTP协议传递`json`字符串，HTTP协议两端都能解析，`json`格式语言都能转换，传输数据多采用二进制协议来使用，RPC通常相比RESTFul API性能会更好
3.   通过一个具体的URL找到对应的函数



## net/rpc

>   基础RPC示例

Go语言的RPC包提供对通过网络或其他`i/o`连接导出的对象的访问，服务器注册一个对象，并把它作为服务对外可见(服务名称就是类型名称)。注册后，对象的导出方法将支持远程访问。服务器可以注册不同类型的多个对象(服务)，但是不支持注册同一类型的多个对象。



下面代码定义了一个`ServiceA`类型，并为其定义了一个可导出的`Add`方法

```go
package main

type Args struct {
	X, Y int
}

type ServiceA struct {

}

func (sa *ServiceA) Add(args *Args, reply *int) error {
	*reply = args.X + args.Y
	return nil
}

```

通过下面的代码将上面的`ServiceA`类型注册为一个服务，其`Add`方法就支持RPC调用了。

```go
package main

import (
	"log"
	"net"
	"net/http"
	"net/rpc"
)

func main() {
	// new 函数返回类型的指针类型
	service := new(ServiceA)
	// 注册RPC服务
	rpc.Register(service)
	// 基于HTTP协议的RPC服务
	rpc.HandleHTTP()
    // TCP连接
	l, err := net.Listen("tcp", ":9091")
	if err != nil {
		log.Fatal("listen error:", err)
	}
	http.Serve(l, nil)
}

```

在另外开一个程序，实现远程调用

```go
package main

import (
	"fmt"
	"log"
	"net/rpc"
)

type Args struct {
	X, Y int
}


// 实现RPC跨程序调用

func main() {
	// 建立HTTP连接
	client, err := rpc.DialHTTP("tcp", "127.0.0.1:9091")
	if err != nil {
		log.Fatal("dialing:", err)
	}
	// 同步调用
	// 定义参数：约定好的结构体
	args := &Args{7, 8}
	var reply int
	// 直接调用server端的方法
	err = client.Call("ServiceA.Add", args, &reply)
	if err != nil {
		log.Fatal("ServiceA.Add error:", err)
	}
	fmt.Printf("SrvA.Add: %d + %d = %d\n", args.X, args.Y, reply)
}

```

![result](https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/4021/20220605220528.png)
