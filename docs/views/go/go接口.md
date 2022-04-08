---
title: 'go接口'
date: 2022-03-22 19:21:15
# 永久链接
permalink: '/go/interface'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - null
---



## 接口概念

引入一个段子：《小孩才分对错，大人只看利弊》



案例：写了一个下载器：

```go
package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
)

func retrieve(url string) string {
	resp, err := http.Get(url)
	if err != nil {
		panic(err)
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			panic(err)
		}
	}(resp.Body)

	bytes, _ := ioutil.ReadAll(resp.Body)
	return string(bytes)
}

func main() {
	fmt.Println(retrieve("https://www.baidu.com"))
}

```

表面上这段代码其实确实没啥问题，但是，`main`函数和`retrieve`函数之间产生了耦合，`main`函数必须调用这个方法才会生效。

假设我们有一个团队，专门处理网络请求或磁盘读写的功能的，我们可以进行模拟：



现在建立了一个`infra`小组

```go
package infra

import (
	"io"
	"io/ioutil"
	"net/http"
)

type Retriever struct {
}

func (Retriever) Get(url string) string {
	resp, err := http.Get(url)
	if err != nil {
		panic(err)
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			panic(err)
		}
	}(resp.Body)

	bytes, _ := ioutil.ReadAll(resp.Body)
	return string(bytes)
}

```

专门用于处理网络请求。



再次对下载器进行改写：

```go
package main

import (
	"fmt"
	"learngo/infra"
)

func getRetriever() infra.Retriever {
	return infra.Retriever{}
}

func main() {
	var retriever infra.Retriever = getRetriever()
	fmt.Println(retriever.Get("https://www.baidu.com"))
}

```

但是呢，此时，我们还是需要使用`infra.Retriever`它来进行调用，我们不能换么？

假如现在又有一个测试的目录，也有一个对应的测试的网络请求方法，返回一个假的字符串：

```go
package testing

type Retriever struct {
}

func (Retriever) Get(url string) string {
	return ""
}

```

此时我们在下载器代码中想要更换调用，更改的力度就很大

```go
package main

import (
	"fmt"
	"learngo/testing"
)

func getRetriever() testing.Retriever {
	return testing.Retriever{}
}

func main() {
	var retriever = getRetriever()
	fmt.Println(retriever.Get("https://www.baidu.com"))
}

```

**近乎全改。**



>   为什么会造成这样的我们不满意的情况？
>
>   **我们直观的觉得这两个`retriever`都是做的同样的事情，应该换起来是很容易的，为什么会改这么多地方？**
>
>   对于静态语言来说，我们会有一些类型概念，在编译期就会知道传入的是什么类型。当我们改`retriever`，就是再换类型就会换的很麻烦。



:::tip 换个想法

```go
var retriever ? = getRetriever()
```

我们其实就是需要一个可以使用`Get`方法去请求地址。

:::



```go
package main

import (
	"fmt"
	"learngo/testing"
)

func getRetriever() retriever {
	return testing.Retriever{}
}

// ?: Something that can "Get"
type retriever interface {
	Get(string) string
}

func main() {
	var r retriever = getRetriever()
	fmt.Println(r.Get("https://www.baidu.com"))
}

```

此时我们换回原先的方法调用，就很简单，只有换调用方即可。

```go
func getRetriever() retriever {
	return infra.Retriever{}
}
```



:::tip 疑问点❓

从`Java`语言来的小伙伴，看到这个会很懵逼，照理说写了一个`interface`我们需要去实现一个它这样的接口方法，但是我们这里并没有去实现它，还能继续调用。这个就是`duck typing`，即《鸭子模型》。

:::



### 大黄鸭是鸭子吗？

-   传统类型系统：脊索动物们、脊椎动物亚门、鸟纲雁形目，不是鸭子
-   `duck typing`：是鸭子
-   ”像鸭子走路，像鸭子叫（长得像鸭子），那么就是鸭子“
-   描述事物的外部行为而非内部结构
-   严格说`go`属于结构化类型系统，类似`duck typing`



### python的`duck typing`

```python
def download(retriever):
    return retriever.get("www.baidu.com")
```

-   运行时才知道传入的`retriever`有没有`get`方法
-   需要注释来说明接口



### C++中的`duck typing`

```c++
template <class R> string download(const R& retriever) {
    return retriever.get("www.baidu.com")
}
```

-   编译时才知道传入的`retriever`有没有`get`方法，写的时候并不知道
-   需要注释来说明接口



### java中的类似代码

```java
<R extends Retriever> String download(R r) {
    return r.get("www.baidu.com")
}
```

-   `Java`逼着我们必须实现`Retriever`接口
-   **但是它不是`duck typing`**
-   不在需要注释来说明



### go语言的`duck typing`

-   同时具有`python、C++`的`duck typing`的灵活性
-   又具有`java`的类型检查



## 定义

-   使用者：`downloader`
-   实现者：`retriever`



>   -   接口由`使用者`定义
>   -   接口的实现是隐式的
>   -   只要实现接口里的方法就可以了

```go
package real

import (
	"net/http"
	"net/http/httputil"
	"time"
)

type Retriever struct {
	UserAgent string
	TimeOut   time.Duration
}

func (r Retriever) Get(url string) string {
	resp, err := http.Get(url)
	if err != nil {
		panic(err)
	}

	result, err := httputil.DumpResponse(resp, true)

	defer resp.Body.Close()

	if err != nil {
		panic(err)
	}

	return string(result)
}

```

接口一般”肚子“里有它的类型



![接口](https://gitee.com/wxvirus/img/raw/master/img/20220322210633.png)

-   接口变量自带指针
-   接口变量同样采用值传递，几乎不需要使用接口的指针
-   指针接收者只能使用指针方式使用；值接收者两者都可以



### 查看接口变量的三种方式

-   表示任何类型：`interface{}`
-   `Type Assertion`
-   `Type Switch`



## 接口的组合

常见的案例就是`io.WriteCloser`一类的接口，他们里面包含了写读和关闭文件等多个接口。



```go
type Retriever interface {
	Get(url string) string
}

type Poster interface {
	Post(url string, form map[string]string) string
}


// RetrieverPoster 接口的组合
type RetrieverPoster interface {
	Retriever
	Poster
}
```



## 常用的系统接口

1.   类似`java`的`toString`：`Stringer`接口，里面有一个`string()`函数
2.   `Reader/Writer`
