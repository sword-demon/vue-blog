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

