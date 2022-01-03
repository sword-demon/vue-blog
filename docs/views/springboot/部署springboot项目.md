---
title: '部署springboot项目'
date: 2022-01-02 17:01:15
# 永久链接
permalink: '/springboot/bushu'
sidebar: 'auto'
isShowComment: true
categories:
 - springboot
tags:
 - null
---



## 生产环境配置

```yaml
# mybatis配置
# 增加数据库连接
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/数据库名称?characterEncoding=UTF-8&autoReconnect=true&serverTimezone=Asia/Shanghai&allowMultiQueries=true
    username: 用户名
    password: 密码
    driver-class-name: com.mysql.cj.jdbc.Driver
```

>   生产环境的配置只需要添加本地和测试环境的需要修改的，此次只是需要修改的只是数据库的配置相关的信息。



## Maven生产jar包

配置生成的`jar`包地址和名称

```xml
<build>
    <!-- 打包生成项目名称的jar包 -->
    <finalName>/dist/${project.artifactId}</finalName>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <version>2.3.4.RELEASE</version>
        </plugin>
    </plugins>
</build>
```

这样就会在`target/dist`目录下生成项目配置的`名称.jar`和`名称.jar.original`



## 服务器配置JDK

[配置文档](https://www.wjstar.top/pages/eff384/)



## 服务器后台运行jar

我们直接运行springboot的项目的时候，会默认使用`application.properties`或`application.yaml`文件，如果要使用生产环境，则需要加上参数。

```bash
java -jar -Dspring.profiles.active=prod xxx.jar
```

但是我们每次打包上线都得这么麻烦的话，会比较费劲，所以写一个脚本：

```sh
#!/bin/bash
echo "publish-------------------"

process_id=`ps -ef | grep xxx.jar | grep -v grep | awk '{print $2}'`
if [ $process_id ]; then
    sudo kill -9 $process_id
fi

# 此文件是配置的JAVA_HOME
source /etc/profile

# 让java项目在后台运行
# 此处是放到用户命令下的 项目目录/项目.jar
nohup java -jar -Dspring.profiles.active=prod ~/wiki/wiki.jar > /dev/null 2>&1 &

echo "end publish"
```



## 配置前后端分离的Vue项目

>   先前配置的生产环境的配置需要修改为上线的服务端域名

```txt
NODE_ENV=production
VUE_APP_SERVER=http://server.project.com
VUE_APP_WS_SERVER=ws://server.project.com
```

执行Vue的`build`命令生成打包文件，上传到服务器即可。



## 配置nginx



### 配置前端项目访问

```nginx
server {
    listen: 80;
#     server name ip;
    # 前端部署
    server name web.xxx.com; # 子域名

    location / {
        alias /root/web;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```



### 配置后端的服务端地址

```nginx
server {
    listen: 80;
#     server name ip;
    # 服务端
    server name server.xxx.com; # 子域名 必须与Vue项目配置的prod的相应

    location / {
        # 反向代理
        # 这里是springboot配置的本地地址和端口
        proxy_pass http://localhost:8880;

        # 配置websocket可以连接
        # 如果后端项目没有用到websocket就不必配置
        proxy_redirect off;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host:$server_port;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```



>   以上完毕，后续修改即可在服务端执行`sh xxx.sh`的脚本即可。

