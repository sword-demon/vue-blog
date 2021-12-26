---
title: '单点登录token与JWT介绍'
date: 2021-12-26 14:45:15
permalink: '/note/sso_login'
sidebar: 'auto'
isShowComment: true
categories:
- note
tags:
- null
---



# 单点登录token与JWT介绍



## 登录

登录：

1.   前端输入用户名密码
2.   校验用户名密码
3.   生成登录标识(`token`)
4.   后端保存`token`
5.   前端保存`token`



校验：

1.   前端请求时，带上`token`，**并不是所有的接口都需要带上`token`一般是放在`header`里**
2.   登录拦截器，校验`token`（到`redis`获取`token`）
3.   校验成功则继续后面的业务
4.   校验失败则回到登录页面



登录标识：就是令牌，就是`token`，就是一串唯一的字符串

## 单点登录系统

>   如果你的公司有很多系统，每个系统都单独做一个登录，就会很费事费力，还不能达到统一。一般会再做一个另外的单点登录系统。

比如：现在有`A B C`三个系统，另外一个单点登录系统为：`SSO`



第一种方式：

`A`网站要登录的时候，去访问一下`SSO`，它提供登录界面和功能，登录直接跳到`SSO`登录完成后，再回到`A`



第二种方式：

登录界面，`A B C`各自都有，但是登录接口是由`SSO`来提供的，它不提供页面，只提供接口。



:::warning 注意

**单点 != 单个节点**



为了支持全部系统的登录功能，所以这个`SSO`还是要很高效稳定的，所以有可能会布个10个节点或100个节点

:::



---



`SSO`主要功能点：

-   用户管理
-   登录
-   登录校验
-   退出登录
-   或是注册，有可能只提供接口，也可能包含页面





## token与JWT

`token + redis`组合：`token`是无意义的，我们可以用MD5字符串，可以用时间戳等等。



JWT：`token`是有意义的，是加密的，是包含业务信息的，就是把业务信息加密起来，业务信息基本也就是用户信息，可以被解密出来。它不需要存储到`redis`。

网址： [jwt.io](https://jwt.io/)



`Maven`依赖

```xml
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
    <version>3.5.0</version>
</dependency>
```

它有比较重要的2个方法：`JwtUtil.sign`和`JwtUtil.verity`

