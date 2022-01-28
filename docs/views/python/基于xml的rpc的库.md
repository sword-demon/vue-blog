---
title: '基于xml的rpc的库'
date: 2022-01-28 22:15:15
# 永久链接
permalink: '/python/xmlrpc'
sidebar: 'auto'
isShowComment: true
categories:
 - python
tags:
 - null
---



## 基于xml的rpc库

```python
# -*- coding: utf8 -*-
# @Time    : 2022/1/28 22:16
# @Author  : wxvirus
# @File    : xml_rpc_server.py
# @Software: PyCharm

from xmlrpc.server import SimpleXMLRPCServer


class Calculate:
    def add(self, x, y):
        return x + y

    def multiply(self, x, y):
        return x * y

    def subtract(self, x, y):
        return abs(x - y)

    def divide(self, x, y):
        return x / y


obj = Calculate()
server = SimpleXMLRPCServer(("localhost", 8088))

# 将实例注册给 rpc server
server.register_instance(obj)
print("listening on port 8088")
server.serve_forever()

```

-   没有出现`url`的映射问题
-   没有解码和编码的问题

>   我们就不用去管一些解析过程，我们只需要去编写我们的业务代码即可。



而基于`xml`的rpc的客户端就更加的简单了

```python
# -*- coding: utf8 -*-
# @Time    : 2022/1/28 22:24
# @Author  : wxvirus
# @File    : xml_rpc_client.py
# @Software: PyCharm

from xmlrpc import client

server = client.ServerProxy("http://localhost:8088")
print(server.add(2, 3))

```

>   此时会感觉`xmlrpc`挺好用的。但是对于`django`或者别的`web`框架来说一定是可以做到`xmlrpc`的效果的，但是它本身的目的不是这种。
>
>   `xmlrpc`它只能使用它提供的`ServerProxy`才能使用。

:::warning 区别

rpc强调的是本地调用效果，但是和一般的`web`框架来说，不会写成这样，而且不太适合一些正常的`http`协议。。

一般rpc在内部服务调用很多，对外暴露不太适合。

这边我们使用的是`xmlrpc`,所以它的序列化和反序列化协议是`xml`

:::