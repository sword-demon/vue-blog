---
title: '使用Select来进行调度'
date: 2022-03-28 21:39:15
# 永久链接
permalink: '/go/select'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - null
---



## 从channel里非阻塞的获取数据

```go
package main

import "fmt"

func main() {
	var c1, c2 chan int // c1 and c2 = nil
	select {
	case n := <-c1:
		fmt.Println("received from c1: ", n)
	case n := <-c2:
		fmt.Println("received from c2: ", n)
	default:
		fmt.Println("no value received")
	}
}

```

>   使用定时器

```go
package main

import (
	"fmt"
	"math/rand"
	"time"
)

func generator() chan int {
	out := make(chan int)
	go func() {
		i := 0
		for {
			time.Sleep(time.Duration(rand.Intn(1500)) * time.Millisecond)
			out <- i
			i++
		}
	}()
	return out
}

func createWorker(id int) chan<- int {
	c := make(chan int)
	go worker(id, c)
	return c
}

func worker(id int, c chan int) {
	for n := range c {
		time.Sleep(time.Second)
		fmt.Printf("Worker %d received %d\n", id, n)
	}
}

func main() {
	var c1, c2 = generator(), generator()
	var worker = createWorker(0)

	var values []int
	// 运行10秒钟退出
	tm := time.After(10 * time.Second)
	tick := time.Tick(time.Second)
	for {
		var activeWorker chan<- int
		var activeValue int
		if len(values) > 0 {
			activeWorker = worker
			activeValue = values[0]
		}
		select {
		case n := <-c1:
			values = append(values, n)
		case n := <-c2:
			values = append(values, n)
		case activeWorker <- activeValue:
			values = values[1:]
		case <-time.After(800 * time.Millisecond):
			fmt.Println("timeout")
		case <-tick:
			fmt.Println("queue len = ", len(values))
		case <-tm:
			fmt.Println("bye")
			return
		}
	}
}

```

