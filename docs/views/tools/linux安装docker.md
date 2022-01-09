---
title: 'linux安装docker'
date: 2022-01-10 00:11:15
# 永久链接
permalink: '/tools/linux_docker'
sidebar: 'auto'
isShowComment: true
categories:
 - tools
tags:
 - null
---

## 安装docker
Docker安装文档：[https://docs.docker.com/install/linux/docker-ce/centos](https://docs.docker.com/install/linux/docker-ce/centos)

1. 卸载系统之前的`docker`

   ```bash
   sudo yum remove docker \
    docker-client \
    docker-client-latest \
    docker-common \
    docker-latest \
    docker-latest-logrotate \
    docker-logrotate \
    docker-engine
   ```

2. 下载必须依赖的一些包

  ```bash
  sudo yum install -y yum-utils \
   device-mapper-persistent-data \
   lvm2
  ```

3. 设置下载地址

  ```bash
  sudo yum-config-manager \
  --add-repo \
  https://download.docker.com/linux/centos/docker-ce.repo
  ```

4. 安装docker

  ```bash
  sudo yum install docker-ce docker-ce-cli containerd.io
  ```

5. 启动docker服务：`sudo systemctl start docker`

6. 查看docker版本：`docker -v`

7. 查看docker镜像：`docker images`会出现权限不足的问题，因为你现在`vagrant ssh`登录的是`vagrant`默认用户，需要加上`sudo`

8. 设置docker开启自启：`sudo systemctl enable docker`

## 配置阿里云镜像加速
- 首先进入阿里云网站
- 进入控制台，找到产品与服务，里面有容器与镜像服务，找到镜像加速器，找到centos
- 按照操作文档说的配置镜像加速器即可



```bash
sudo mkdir -p /etc/docker
 
sudo tee /etc/docker/daemon.json <<-'EOF'
{
     "registry-mirrors": ["https://82m9ar63.mirror.aliyuncs.com"]
}
EOF
 
sudo systemctl daemon-reload
sudo systemctl restart docker
```

