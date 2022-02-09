---
title: 'docker封装自己的micro工具'
date: 2022-02-08 23:02:15
# 永久链接
permalink: '/go/docker_micro'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - null
---



>   这里假设我们已经根据自己的需求修改好了micro源码，并打包成linux环境下的二进制文件`micro`

## 创建Dockerfile文件

目录结构如下：

```bash
dockertest
	micro
	Dockerfile
```

```dockerfile
FROM alpine
COPY micro /micro
ENTRYPOINT [ "/micro" ]
```



## 构建Docker镜像

```bash
docker build -t 用户名/名称:版本 .
```

-   `-t`指定构建的容器的名字以及版本，如果要上传到`hub.docker`中，`/`之前要使用`hub.docker`的用户名，`/`后面是自定义的镜像名称，`:`后面是版本信息
-   `.`指定`Dockerfile`文件所在的mul



## 上传本地镜像到dockerhub

最简单的就是使用`docker`客户端上传

直接使用镜像右边有一个三个点的，点击`Push To Hub`即可

![docker客户端上传镜像](https://gitee.com/wxvirus/img/raw/master/img/20220208231437.png)

---

命令行上传

```bash
# 登录dockerhub
docker login
# 上传镜像
docker push 用户名/镜像名称
```



## 使用自己打包好的镜像创建项目

```bash
docker run --rm -v $(pwd):$(pwd) -w $(pwd) 用户名/镜像名称:版本号 new hello
```

