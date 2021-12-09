---
title: 'micro微服务模块开发'
date: 2021-12-09 21:19:15
# 永久链接
permalink: '/go/micromodule'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - micro
 - rpc
 - service
---



## 创建项目

使用官方给出的`micro`的镜像创建项目

首先使用`docker`拉取镜像

```bash
docker pull micro/micro
```

使用镜像创建模块

```bash
docker run --rm -v $(PWD):$(PWD) -w $(PWD) micro/micro new user
```

项目目录搭建

新建`domain`目录，并创建3个子目录：`model`、`repository`、`service`



## Go module使用

### 基本设置

-   Go >= 1.13 会自动默认使用`Go Modules`
-   Go Modules使用`GOPROXY`环境变量来解决无法使用`go get`问题



### 私有仓库设置

-   使用`go env`查看本机参数
-   `GOPRIVATE="*.github.com"`



### Go module加速设置

-   GOPROXY="https://goproxy.io"
-   固化可以把命令写到`.bashrc或者.bash_profile`文件当中
-   windows cmd命令设置`set GOPROXY="https://goproxy.io"`



### Go module设置 github私有仓库

生成token

[https://github.com/settings/tokens/new](https://github.com/settings/tokens/new)

将token设置到请求头中

```bash
git config --global http.extraheader "PRIVATE-TOKEN:YOUR_PRIVATE_TOKEN"
```

配置git将请求从ssh转换为http

```bash
#全局替换拉取域下的所有包

git config --global url."git@github.com:xxxx".insteadOf "https://github.com/xxxx"
```

```bash
#全局替换拉取域下的单个包，使用“全局替换拉取域下的所有包” 可以不设置
git config --global url."git@github.com:xx/xxx.git".insteadOf "https://github.com/xx/xxx.git"
```



检查配置

`cat ~/.gitconfig`

```bash
[http]
    extraheader = PRIVATE-TOKEN:xxxxx

[url "git@github.com:xxxxx"]
    insteadOf = https://github.com/xxxx
```



使用`go env`查看结果



测试配置结果

```bash
# 执行
go mod tidy  

# 显示
go: finding module for package github.com/xxx
go: found github.com/xx/xxx/inits in github.com/xxx/xxx v1.0.1

# 那么就设置成功了
```

