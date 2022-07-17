---
title: 'httpServer介绍'
date: 2022-07-17 21:00:15
# 永久链接
permalink: '/go/httpServer'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - null
---



## 默认的Server

`ListenAndServe`使用指定的监听地址和处理器启动一个HTTP服务端，处理器参数通常是`nil`，这表示采用包变量`DefaultServeMux`作为处理器。



`Handle`和`HandleFunc`函数可以向`DefaultServeMux`添加处理器

```go
http.Handle("/foo", fooHandler) // 访问地址，处理函数

http.HandleFunc("/bar", function(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, %q", html.EscapeString(r.URL.Path))
})

log.Fatal(http.ListenAndServe(":8000", nil))
```

`server.go`部分源码

```go
// The HandlerFunc type is an adapter to allow the use of
// ordinary functions as HTTP handlers. If f is a function
// with the appropriate signature, HandlerFunc(f) is a
// Handler that calls f.
type HandlerFunc func(ResponseWriter, *Request)

// ServeHTTP calls f(w, r).
func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) {
	f(w, r)
}
```



demo

```go
func serveDemo()  {
	http.HandleFunc("/order", f1)
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		return
	}
}

// f1 接收用户的请求，执行业务逻辑后给用户返回响应数据
func f1(w http.ResponseWriter, r *http.Request)  {
	// r 代表请求
	// w 代表响应

	// 1. 解析请求拿到参数
	id := r.URL.Query().Get("id")
    // 2. 业务逻辑处理
	fmt.Println(id)
    // 3. 返回响应
	w.Write([]byte(id))
}

func main() {
	serveDemo()
}
```

这样我们可以使用基础库来实现一些简单的HTTP Server端



## 自定义Server

我们还可以自己设置一些地址，处理函数，超时时间等内容

```go
s := &http.Server{
    Addr: ":8000",
    Handler: myHandler,
    ReadTimeout: 10 * time.Second,
    WriteTimeout: 10 * time.Second,
    MaxHeaderBytes: 1 << 20,
}
log.Fatal(s.ListenAndServe())
```

