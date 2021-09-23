```yaml
---
title: gin框架基础
date: '2021-09-23 22:16:00'
sidebar: 'auto'
categories:
 - go
tags:
 - Gin
 - Framework
publish: false
---
```



`Gin` 是一个用Go语言编写的HTTP Web框架，它是一个类似于`martini` 但拥有更好性能的API框架，由`httprouter` ，速度提高了近40倍。

## 安装

下载安装`Gin`

```go
go get -u github.com/gin-gonic/gin
```

### 第一个Gin示例：

```go
package main

import "github.com/gin-gonic/gin"

func sayHello(ctx *gin.Context) {
	// 返回一个json格式的数据，状态码为200
	ctx.JSON(200, gin.H{
		"message": "hello golang!",
	})
}

func main() {
	// 返回默认的路由引擎
	r := gin.Default()

	// 指定用户使用 get 请求访问 /hello 执行sayHello这个函数
	r.GET("/hello", sayHello)

	// 启动服务
	r.Run() // 默认打开 8080 端口
}
```

## **Gin简介**

`Gin` 是一个用Go语言编写的HTTP Web框架，它是一个类似于`martini` 但拥有更好性能的API框架，由`httprouter` ，速度提高了近40倍。

## **安装**

下载安装`Gin`

```
 go get -u github.com/gin-gonic/gin
```

### **第一个Gin示例：**

```
 package main
 
 import "github.com/gin-gonic/gin"
 
 func sayHello(ctx *gin.Context) {
   // 返回一个json格式的数据，状态码为200
   ctx.JSON(200, gin.H{
     "message": "hello golang!",
   })
 }
 
 func main() {
   // 返回默认的路由引擎
   r := gin.Default()
 
   // 指定用户使用 get 请求访问 /hello 执行sayHello这个函数
   r.GET("/hello", sayHello)
 
   // 启动服务
   r.Run() // 默认打开 8080 端口
 }
```

### **RestFul Api风格**

```
 http.StatusOK = 200 // 状态码
 package main
 
 import (
   "github.com/gin-gonic/gin"
   "net/http"
 )
 
 func sayHello(ctx *gin.Context) {
   // 返回一个json格式的数据，状态码为200
   ctx.JSON(200, gin.H{
     "message": "hello golang!",
   })
 }
 
 func main() {
   // 返回默认的路由引擎
   r := gin.Default()
 
   // 指定用户使用 get 请求访问 /hello 执行sayHello这个函数
   r.GET("/hello", sayHello)
 
   // restful api
   r.GET("/book", func(context *gin.Context) {
     context.JSON(http.StatusOK, gin.H{
       "message": "get",
     })
   })
 
   r.POST("/book", func(context *gin.Context) {
     context.JSON(http.StatusOK, gin.H{
       "message": "post",
     })
   })
 
   r.PUT("/book", func(context *gin.Context) {
     context.JSON(http.StatusOK, gin.H{
       "message": "put",
     })
   })
 
   r.DELETE("/book", func(context *gin.Context) {
     context.JSON(http.StatusOK, gin.H{
       "message": "delete",
     })
   })
 
   // 启动服务
   r.Run() // 默认打开 8080 端口
 }
 
```

## **Gin渲染**

### **Go模板引擎**

>   html/template包实现了数据驱动的模板，用于生成可防止代码注入的安全HTML内容。它提供了和text/template包相同的接口，Go语言中输出HTML的场景都应使用html/template这个包

Go语言的模板引擎`text/template`和用于`html/template`。它们的作用机制可以简单归纳如下：

-   模板文件通常定义为：`.tmpl`和`.tpl`为后缀(也可以使用其他的后缀)，必须使用UTF8编码。
-   模板文件使用`{{}}`包裹和标识需要传入的数据
-   传给模板这样的数据就可以通过点好`.`来访问。如果数据是复杂类型的数据，可以通过`{{.FieldName}}`来访问它的字段
-   除`{{}}`包裹的内容外，其他内容均不做修改照原样输出

### **模板引擎的使用**

-   定义模板文件

-   解析模板文件

    ```
     func(t *Template) Parse(src string) (*Template, error)
     func ParseFiles(filenames ...string) Parse(src string) (*Template, error)
     func ParseGlob(pattern string) (*Template, error)
    ```

    也可以使用`func New(name string) *Template`函数创建一个名为`name`的模板，然后对其调用上面的方法解析模板字符串或模板文件。

-   模板渲染

    ```
     func (t *Template) Execute(wr io.Writer, data interface{}) error
     
     func (t *Template) ExecuteTemplate(wr io.Writer, name string, data interface {}) error
    ```

### **基本示例**

定义一个`hello.tmpl`模板文件

```
 <!DOCTYPE html>
 <html lang="en">
 <head>
     <meta charset="UTF-8">
     <title>Hello</title>
 </head>
 <body>
 <p>{{ . }}</p>
 </body>
 </html>
 package main
 
 import (
   "fmt"
   "html/template"
   "net/http"
 )
 
 func sayHello(w http.ResponseWriter, r *http.Request) {
   // 2. 解析模板
   t, err := template.ParseFiles("./hello.tmpl")
   if err != nil {
     fmt.Println(t)
     fmt.Printf("Parse template failed, err:%v", err)
     return
   }
   // 3. 渲染模板
   name := "无解"
   err = t.Execute(w, name)
   if err != nil {
     fmt.Println("render template failed", err)
     return
   }
 }
 
 func main() {
   http.HandleFunc("/", sayHello)
   err := http.ListenAndServe(":9000", nil)
   if err != nil {
     fmt.Printf("HTTP server start failed, err:%v", err)
     return
   }
 }
 
 go build
 ./项目名 # 这样运行比较好
```

然后到浏览器访问`http://localhost:9000`端口即可。

>   本质上还是字符串替换