---
title: 'docker安装yapi'
date: 2022-02-20 23:45:15
# 永久链接
permalink: '/tools/dockeryapi'
sidebar: 'auto'
isShowComment: true
categories:
 - tools
tags:
 - null
---



## docker安装yapi

步骤

```bash
git clone https://github.com/Ryan-Miao/docker-yapi.git

# 这个过程会比较慢
docker-compose up
```

不过在运行前先修改`docker-compose.yml`

-   去掉#号 command: "yapi server"
-   给命令 command: "node /my-yapi/vendors/server/app.js" 这个前面加#号
-   再去执行`docker-compose up`
-   访问IP：`127.0.0.1:9090`

![yapi安装](https://gitee.com/wxvirus/img/raw/master/img/20220221001247.png)



默认部署位置：`/my-yapi`

修改管理员邮箱(随意)

修改数据库地址为`mongo`或者修改为自己的`mongo`实例(docker-compose配置的mongo服务名称叫mongo)

这里点击数据库认证，默认的数据库用户名为：`yapi(mongo配置的用户名，见mongo-conf/init-mongo.js)`，密码：`yapi123456(见mongo-conf/init-mongo.js)`



这里部署版本最好选择低2个级别的，还有`node`版本最好选择v12的，最新的估计不太行。会有各种问题。





## linux宝塔面板安装

可以借鉴下面的博客：

[https://blog.csdn.net/BoYou233/article/details/109164464](https://blog.csdn.net/BoYou233/article/details/109164464)

