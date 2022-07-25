---
title: 'context'
date: 2022-07-22 22:06:15
# 永久链接
permalink: '/go/context'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - null
---



## 引入

在Go的http包的`server`中，每一个请求都有一个对应的`goroutine`去处理，通常需要访问一些请求特定的数据，比如终端用户的身份认证信息、验证相关的token、请求的截止时间，当一个请求被取消或超时时，所有用来处理请求的goroutine都应该迅速的退出，然后系统才能释放这些goroutine占用的资源。



## 为什么需要Context

>   基本示例：如何优雅的退出goroutine



### 使用全局变量方式

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

var wg sync.WaitGroup
var exit bool

func worker() {
	for {
		fmt.Println("worker")
		time.Sleep(time.Second)
		if exit {
			break
		}
	}
	wg.Done()
}

func main() {
	wg.Add(1)
	go worker()
	time.Sleep(time.Second * 3)
	exit = true
	wg.Wait()
	fmt.Println("over")
}

```

:::warning 问题

1.   全局变量在跨包调用时不容易统一
2.   如果`worker`中再启动goroutine，就不好控制了

:::



### 通道方式

```go
package main

import (
	"fmt"
	"sync"
	"time"
)

var wg sync.WaitGroup

func worker(exitChan chan struct{}) {
    // label 标签 搭配 goto break 比较适用多层嵌套退出
LOOP:
	for {
		fmt.Println("worker")
		time.Sleep(time.Second)
		select {
		case <-exitChan: // 等待接收上级通知
			break LOOP
		}
	}
	wg.Done()
}

func main() {
	var exitChan = make(chan struct{})
	wg.Add(1)
	go worker(exitChan)
	time.Sleep(time.Second * 3)
	// 给goroutine发送信号
	exitChan <- struct{}{}
	close(exitChan)
	wg.Wait()
	fmt.Println("over")
}

```

:::warning 问题

1.   使用全局变量在跨包调用时不容易实现规范和统一，需要维护一个共用的`channel`

:::



### 实现目标

:::tip 目标

如何在goroutine外部通知goroutine退出

-   全局变量
-   通道变量



上面2个都不是那么完美。**Go1.7之前都是程序员自己实现的**

:::



使用`context`

```go
package main

import (
	"context"
	"fmt"
	"sync"
	"time"
)

var wg sync.WaitGroup

func worker(ctx context.Context) {
	go worker2(ctx)
LOOP:
	for {
		fmt.Println("worker")
		time.Sleep(time.Second)
		select {
		case <-ctx.Done(): // 等待接收上级通知
			break LOOP
		default:
		}
	}
	wg.Done()
}

func worker2(ctx context.Context) {
LOOP:
	for {
		fmt.Println("worker2")
		time.Sleep(time.Second)
		select {
		case <-ctx.Done():
			break LOOP
		default:

		}
	}
}

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	wg.Add(1)
	go worker(ctx)
	time.Sleep(time.Second * 3)
	cancel() // 通知子 goroutine 结束
	wg.Wait()
	fmt.Println("over")
}

```



## Context熟悉

>   它是用来专门简化对于处理单个请求的多个goroutine之间与请求域的数据、取消信号、截止时间等相关操作，这些操作可能涉及多个API。
>
>   