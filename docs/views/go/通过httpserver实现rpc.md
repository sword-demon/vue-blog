---
title: '通过httpserver实现rpc'
date: 2022-01-24 22:32:15
# 永久链接
permalink: '/go/httpserver2rpc'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - null
---



## 通过python的httpserver库实现rpc

>   首先明确：一定会发起一个网络请求，一定会有个网络连接(TCP/UDP)



**把远程的函数变成一个`http`请求**

```python
def add(a, b):
    return a + b
```

服务端

```python
# -*- coding: utf8 -*-
# @Time    : 2022/1/24 22:37
# @Author  : wxvirus
# @File    : remote_add.py
# @Software: PyCharm

from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qsl

import json

# 暴露的端口
host = ('', 8003)


class AddHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        # 解析路径
        parsed_url = urlparse(self.path)
        # 请求参数
        qs = dict(parse_qsl(parsed_url.query))
        # 获取url的请求参数 a和b
        a = int(qs.get("a", 0))
        b = int(qs.get("b", 0))
        # 设置响应码
        self.send_response(200)
        # 设置响应头为 json格式
        self.send_header("content-type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"result": a + b}).encode("utf-8"))


if __name__ == '__main__':
    server = HTTPServer(host, AddHandler)
    print("启动服务器")
    # 永远启动着
    server.serve_forever()

```

客户端

```python
# -*- coding: utf8 -*-
# @Time    : 2022/1/24 22:48
# @Author  : wxvirus
# @File    : rpc_client.py
# @Software: PyCharm

import requests, json


# 自己实现的一个demo级别的rpc封装
class Client:

    def __init__(self, url):
        self.url = url

    def add(self, a, b):
        res = requests.get(f"{self.url}?a={a}&b={b}")
        return json.loads(res.text).get("result", 0)


# rpc强调的就是一个本地调用过程的一个体验
client = Client("http://127.0.0.1:8003")
print(client.add(1, 2))
print(client.add(22, 3))

# res = requests.get("http://127.0.0.1:8003?a=1&b=2")
# http的调用
# 1. 每个函数调用都得记住url地址是什么，参数是如何传递的，返回数据是如何解析的
# 目标： add 函数调用就像本地函数调用一样
# print(res.text)

```



## rpc开发的要素分析

**rpc开发的四大要素**：

-   客户端：服务调用发起方，也称为服务消费者

-   客户端存根：

    >   该程序运行在客户端所在的就计算机器上，主要用来存储要调用的服务器的地址，另外，该程序还负责将客户端请求远端服务器的程序的数据信息打包成数据包，通过网络发送给服务端`Stub`程序；其次，还要接收服务端`Stub`程序发送的调用结果数据包，并解析返回给客户端。

-   服务端：远端的计算机器上运行的程序，其中有客户端要调用的方法

-   服务端存根：

    >   接收客户端`Stub`程序通过网络发送的请求信息数据包，并调用服务端中真正的程序功能方法，完成功能调用；其次，将服务端执行的调用结果进行数据处理打包发送给客户端`Stub`程序。



其实上述代码中的`Client`类就是一个客户端存根，可以重命名为`ClientStub`。

为我们客户端调用屏蔽了：

1.   call id
2.   序列化和反序列化
3.   传输协议(HTTP)

所以这边也可以称之为一个代理，逻辑都放在了一个代理类上进行处理。其次，同理，服务端也会有一个存根，

用于将`url`映射到对应的函数，可以将客户端发过来的请求映射到想要调用的方法，服务端也会对传递的数据进行序列化和反序列化。