---
title: 'micro初探'
date: 2021-12-09 00:18:15
# 永久链接
permalink: '/go/microdemo'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - micro
 - rpc
---



## micro微服务框架初探(v2版本)



### 准备工作

需要`protobuf`和`protoc`以及`protoc-gen-go`工具

-   [protoc](https://github.com/google/protobuf)
-   [protoc-gen-go](https://google.golang.org/protobuf)



### 创建一个mod项目

定义好`module`

```go
module cap-demo

go 1.16
```



### 创建proto文件

创建`proto`目录以及子目录`cap`

在`cap`目录下创建`proto`文件

`demo.proto`

```protobuf
syntax = "proto3"; // 定义版本

package go.micro.service.demo; // 定义包名

// 定义服务

service Cap {
    rpc SayHello(SayRequest) returns (SayResponse) {}
}

message SayRequest {
	// 类型 名称 = 标识符 1~15 最好不要超过15
    string message = 1;
}

message SayResponse {
    string answer = 1;
}
```

生成文件

```bash
protoc ./ --go_out=./ --micro_out=./ ./proto/cap/demo*.proto
```

生成以下文件：

```
demo.pb.go
demo.pb.micro.go
```



### 创建服务端和客户端

我们来下载`go-micro/v2`的模块

```bash
go get github.com/micro/go-micro/v2
```

服务端：`server.go`

```go
package main

import (
	demo "cap-demo/proto/cap"
	"context"
	"fmt"
	"github.com/micro/go-micro/v2"
)

type CapServer struct{}

// SayHello 实现proto定义的方法
func (c *CapServer) SayHello(ctx context.Context, req *demo.SayRequest, res *demo.SayResponse) error {
	res.Answer = "消息内容是: \"" + req.Message + "\""
	return nil
}

func main() {
	// 创建新的服务
	service := micro.NewService(micro.Name("cap.demo.server"))

	// 初始化方法
	service.Init()

	// 注册服务
	imooc.RegisterCapHandler(service.Server(), new(CapServer))

	// 运行服务
	if err := service.Run(); err != nil {
		fmt.Println(err)
	}
}

```

客户端：`client.go`

```go
package main

import (
	demo "cap-demo/proto/cap"
	"context"
	"fmt"
	"github.com/micro/go-micro/v2"
)

func main() {
	// 创建新的服务
	// 实例化
	service := micro.NewService(micro.Name("cap.demo.client"))

	// 初始化
	service.Init()

	capDemo := demo.NewCapService("cap.demo.server", service.Client())

	res, err := capDemo.SayHello(context.TODO(), &demo.SayRequest{Message: "无解的游戏"})
	if err != nil {
		fmt.Println(err)
	}

	fmt.Println(res.Answer)
}

```

```bash
# 服务端启动
➜ go run server.go
2021-12-09 00:28:42  file=v2@v2.9.1/service.go:200 level=info Starting [service] cap.demo.server
2021-12-09 00:28:42  file=grpc/grpc.go:864 level=info Server [grpc] Listening on [::]:55677
2021-12-09 00:28:42  file=grpc/grpc.go:697 level=info Registry [mdns] Registering node: cap.demo.server-bfbca399-5edc-40a8-8064-161233aaabef

```

```bash
# 客户端
➜ go run client.go
消息内容是: "无解的游戏"

```



