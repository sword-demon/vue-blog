---
title: '使用Docker制作镜像'
date: 2022-02-01 23:13:15
# 永久链接
permalink: '/tools/dockerfile'
sidebar: 'auto'
isShowComment: true
categories:
 - tools
tags:
 - null
---



## 运行Docker的开始文档

```bash
docker run -d -p 8000:80 docker/getting-started
```

这样就可以在本地进行访问地址：`127.0.0.1:8000`,[127.0.0.1:8000](127.0.0.1:8000)



打开运行后的界面如下

![getting-started](https://gitee.com/wxvirus/img/raw/master/img/20220201231607.png)





## 制作镜像

这边有一个`Our Application`提供了一个`todo-app`的`js项目`，用于我们自己练手制作镜像使用。我们只需要进行下载即可。



```dockerfile
FROM node:12-alpine	# 基础镜像
# Adding build tools to make yarn install work on Apple silicon / arm64 machines
RUN apk add --no-cache python2 g++ make
WORKDIR /app # 工作目录
COPY . . # 将当前目录下的所有内容，复制到镜像中的工作目录下
RUN yarn install --production # 安装项目依赖
CMD ["node", "src/index.js"] # 指定启动时要执行的命令

```



```bash
docker build -t todo-app:版本 .
```

使用上述命令构建镜像，`todo-app`是镜像名称，后面加上冒号后面指定版本，如果不写，则默认为`latest`，后面的一个空格点，是表名指定当前目录。



执行完就等待构建完成吧。

构建完成之后，运行镜像构成容器

```bash
docker run -dp 3000:3000 todo-app
```

端口自己找到合适的端口来进行测试运行，可能会出现端口占用的情况。

![todo-app](https://gitee.com/wxvirus/img/raw/master/img/20220201235905.png)

出现上述内容，即表示构建成功。