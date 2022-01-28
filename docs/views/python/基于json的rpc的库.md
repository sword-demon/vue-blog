---
title: '基于json的rpc的库'
date: 2022-01-28 22:32:15
# 永久链接
permalink: '/python/jsonrpc'
sidebar: 'auto'
isShowComment: true
categories:
 - python
tags:
 - null
---



## 基于json的rpc库

很多`web`框架其自身都实现了`json-rpc`，但是我们要独立于这些框架之外，要寻求一种较为干净的解决方案，我们使用`jsonrpclib`。



<a href="https://github.com/joshmarshall/jsonrpclib">tcalmant/jsonrpclib</a>

>   这个库现在还在维护，同时支持`python2`和`python3`

## 安装

```bash
pip install jsonrpclib-pelix -i https://pypi.douban.com/simple
```



服务端案例代码

```python
# -*- coding: utf8 -*-
# @Time    : 2022/1/28 23:01
# @Author  : wxvirus
# @File    : server.py
# @Software: PyCharm

from jsonrpclib.SimpleJSONRPCServer import SimpleJSONRPCServer


def add(a, b):
    return a + b


# 1. 实例化一个 server
server = SimpleJSONRPCServer(('localhost', 8080))
# 2. 将函数注册到 server 中
server.register_function(add)
# 3. 启动 server
server.serve_forever()

```



客户端案例代码

```python
# -*- coding: utf8 -*-
# @Time    : 2022/1/28 23:04
# @Author  : wxvirus
# @File    : client.py
# @Software: PyCharm

import jsonrpclib

server = jsonrpclib.Server('http://localhost:8080')
server.add(5, 6)

```

和`xmlrpc`底层不一样的就是序列化和反序列化为`json`格式，如果仅仅是专业，那几乎和`xmlrpc`没有优势可言，无非就是底层换掉了。

但是实际上，功能会比`xmlrpc`的功能要多一点，它还支持`SSL`和`Thread Pool`线程池，任何一个`web`服务如果不具备并发接收和处理的能力的话，那么这个`server`就没有用。



## rpc的一些功能需求

1.   超长机制 - 重试

2.   限流 - 处于长期可用的状态 - 高可用

3.   解耦

4.   负载均衡，一般是用在微服务，那就是分布式应用的具体体现，即需要多活策略

5.   `json`是否满足上述的要求

     1.   序列化数据压缩是否高效，`json`这种数据格式已经非常的简单了

     2.   能不能有一个算法或者协议，将这个数据压缩变得更小

     3.   这个序列化和反序列化的速度够不够快

          >   在`python`中`json.dumps()`和`json.loads()`是非常耗时的。



**后面我们如果做架构，上述技术选型都是我们需要考虑到的点。**