---
title: 'Go项目包管理方法'
date: 2022-05-14 17:27:15
# 永久链接
permalink: '/Go-core/packagemanage'
sidebar: 'auto'
isShowComment: true
categories:
 - Go-core
tags:
 - null
---



## Go包管理的困境

-   没有统一的包管理
-   包之间的依赖关系很难维护
-   如果同时需要有一个包的不通过版本，非常麻烦



## 尝试解决

-   尝试使用godep、govendor、glide等解决
-   未彻底解决`GOPATH`存在的问题
-   使用起来麻烦



## Go Modules

-   本质上，一个Go的包就是一个项目的源码
-   gomod的作用：将Go包和Git项目关联起来
-   Go包的版本就是git项目的Tag
-   gomod就是解决“需要哪个git项目的什么版本”



## 使用Modules

使用以下命令：

```bash
go get github.com/xxx/xxx

# 也可以加上特定的版本号
go get github.com/xxx/xxx@0.1.3
```

引入了一个包之后，`go.mod`里面会有一个`require github.com/xxx/xxx 版本`记录依赖和版本信息。



### 如果github无法访问怎么办

使用`goproxy.cn`作为代理

```bash
go env -w GOPROXY=https://goproxy.cn,direct
```



### 想用本地文件替代怎么办

-   在`go.mod`文件追加

```
replace github.com/xxx/xxx => xxx/xxx
```



-   `go vendor`缓存到本地

​	`go mod vendor`会把你用的一次性全都缓存到本地，然后编译工程的时候加上`go build -mod vendor`就不会去拉远程的最新版本，使用本地的依赖文件。



### 创建Go Modules

```go
module rpc-test

go 1.17

require github.com/360EntSecGroup-Skylar/excelize v1.4.1

require github.com/mohae/deepcopy v0.0.0-20170929034955-c48cc78d4826 // indirect
```

第一行为你的module名称，下面是go的版本，下面是依赖的文件。



使用`go mod init 上传的仓库地址`即可初始化一个`go.mod`文件，仓库地址不需要带上`http/https`，结尾不需要加上`git`，最后`push`到仓库即可，如果原先本地存在`go mod`文件，需要先删除后在进行初始化；增加新版本时，需要在仓库打上一个新的Tag。