---
title: 'go并发模式'
date: 2022-04-03 13:55:15
# 永久链接
permalink: '/go/concurrent'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - null
---



## 并发编程模式

### 生成器

```go
package main

import (
	"fmt"
	"math/rand"
	"strconv"
	"time"
)

func msgGen() chan string {
	c := make(chan string)
	go func() {
		for i := 0; ; i++ {
			time.Sleep(time.Duration(rand.Intn(2000)) * time.Millisecond)
			c <- "msg:" + strconv.Itoa(i)
		}
	}()
	return c
}

func main() {
	m1 := msgGen()
	for i := 0; i < 10; i++ {
		fmt.Println(<-m1)
	}
}

```



### 服务/任务

```go
package main

import (
	"fmt"
	"math/rand"
	"strconv"
	"time"
)

func msgGen() chan string {
	c := make(chan string)
	go func() {
		for i := 0; ; i++ {
			time.Sleep(time.Duration(rand.Intn(2000)) * time.Millisecond)
			c <- "msg:" + strconv.Itoa(i)
		}
	}()
	return c
}

func main() {
    // 第一个服务 类似句柄的概念 handler
	m1 := msgGen()
    // 第二个服务
	m2 := msgGen()
	for i := 0; i < 10; i++ {
		fmt.Println(<-m1)
		fmt.Println(<-m2)
	}
}

```



### 同时等待多个服务

>   使用第三个`channel`来接收2个`channel`的内容在合并

```go
package main

import (
	"fmt"
	"math/rand"
	"strconv"
	"time"
)

func msgGen(name string) chan string {
	c := make(chan string)
	go func() {
		for i := 0; ; i++ {
			time.Sleep(time.Duration(rand.Intn(2000)) * time.Millisecond)
			c <- "service: " + name + " msg:" + strconv.Itoa(i)
		}
	}()
	return c
}

func fanIn(c1, c2 chan string) chan string {
	c := make(chan string)
	go func() {
		for {
			select {
			case s := <-c1:
				c <- s
			case s := <-c2:
				c <- s
			}
		}
	}()
	return c
}

func main() {
	m1 := msgGen("service1")
	m2 := msgGen("service2")

	// 谁快收谁的消息
	m := fanIn(m1, m2)

	for i := 0; i < 10; i++ {
		fmt.Println(<-m)
	}
}

```



两种写法：

```go
func fanIn(c1, c2 chan string) chan string {
	c := make(chan string)
	go func() {
		for {
			c <- <-c1
		}
	}()
	go func() {
		for {
			c <- <-c2
		}
	}()
	return c
}

func fanInBySelect(c1, c2 chan string) chan string {
	c := make(chan string)
    // 使用select来同时等待，可以少开一个 goroutine
	go func() {
		for {
			select {
			case s := <-c1:
				c <- s
			case s := <-c2:
				c <- s
			}
		}
	}()
	return c
}
```

如果使用非`select`的情况，我们不知道有多少个`channel`，才会使用。



```go
func fanIn(chs ...chan string) chan string {
	c := make(chan string)
    // ch 全局只有一份 会有问题
	for _, ch := range chs {
        // 我们需要拷贝一份
        chCopy := ch
		go func() {
			for {
				c <- <-chCopy
			}
		}()
	}
	return c
}
```

第一个`for`给每一个`channel`开一个`goroutine`，源源不断的把`channel`里获取的数据送给`c`



或者我们进行改造，使用函数值传参来进行拷贝值

```go
func fanIn(chs ...chan string) chan string {
	c := make(chan string)
	for _, ch := range chs {
		go func(ch chan string) {
			for {
				c <- <-ch
			}
		}(ch)
	}
	return c
}
```



### 并发任务的控制

-   非阻塞等待

    ```go
    func nonBlockingWait(c chan string) (string, bool) {
    	select {
    	// 等到了就返回
    	case s := <-c:
    		return s, true
    	default:
    		return "", false
    	}
    }
    ```

    

-   超时机制

    ```go
    func timeoutWait(c chan string, timeout time.Duration) (string, bool) {
    	select {
    	case s := <-c:
    		return s, true
        // 还没等到消息
    	case <-time.After(timeout):
    		return "", false
    	}
    }
    ```

    

-   任务中断、退出

    ```go
    func msgGen(name string, done chan struct{}) chan string {
    	c := make(chan string)
    	go func() {
    		for i := 0; ; i++ {
    			select {
    			case <-time.After(time.Duration(rand.Intn(5000)) * time.Millisecond):
    				c <- fmt.Sprintf("service: %s: message: %d", name, i)
    			case <-done:
    				fmt.Println("cleaning up")
    				return
    			}
    		}
    	}()
    	return c
    }
    
    func main() {
    	done := make(chan struct{})
    	m1 := msgGen("service1", done)
    	for i := 0; i < 10; i++ {
    		fmt.Println(<-m1)
    		if m, ok := timeoutWait(m1, time.Second); ok {
    			fmt.Println(m)
    		} else {
    			fmt.Println("timeout")
    		}
    	}
    	// 定义加初始化的channel
    	done <- struct{}{}
    	time.Sleep(time.Second)
    }
    
    ```

    

-   优雅退出

    ```go
    func msgGen(name string, done chan struct{}) chan string {
    	c := make(chan string)
    	go func() {
    		for i := 0; ; i++ {
    			select {
    			case <-time.After(time.Duration(rand.Intn(5000)) * time.Millisecond):
    				c <- fmt.Sprintf("service: %s: message: %d", name, i)
    			case <-done:
    				fmt.Println("cleaning up")
    				time.Sleep(time.Second * 2)
    				fmt.Println("cleanup done")
    				// 做完了，关闭通道
    				done <- struct{}{}
    				return
    			}
    		}
    	}()
    	return c
    }
    
    func main() {
    	done := make(chan struct{})
    	m1 := msgGen("service1", done)
    	for i := 0; i < 10; i++ {
    		fmt.Println(<-m1)
    		if m, ok := timeoutWait(m1, time.Second); ok {
    			fmt.Println(m)
    		} else {
    			fmt.Println("timeout")
    		}
    	}
    	// 定义加初始化的channel
    	done <- struct{}{}
    	// 收到通知后，关闭通道
    	<-done
    }
    ```

    



