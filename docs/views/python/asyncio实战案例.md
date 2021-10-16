---
title: 'asyncio实战案例'
date: '2021-10-16 08:13:00'
sidebar: 'auto'
permalink: '/python/asyncio/case'
categories:
 - python
tags:
 - asyncio
 - case
publish: true
---



## 异步redis

在使用python代码操作redis时，链接/操作/断开都是网络IO

需要安装一个模块

```bash
pip3 install aioredis
```

示例1：

```python
import aioredis
import asyncio


async def execute(address, password):
    print("开始执行", address)
    # 网络IO操作，创建redis链接
    redis = await aioredis.create_redis(address, password=password)

    # 网络IO操作，在redis里设置哈希值car，内部设置3个键值对
    await redis.hmset_dict("car", key1=1, key2=2, key3=3)

    # 网络IO操作，去redis中获取值
    result = await redis.hgetall("car", encoding="utf-8")
    print(result)

    redis.close()
    # 网络IO操作，关闭redis
    await redis.wait_closed()

    print("结束", address)


asyncio.run(execute("redis://127.0.0.1:6379", ""))

```

<!-- more -->

示例2

```python
import aioredis
import asyncio


async def execute(address, password):
    print("开始执行", address)
    # 网络IO操作，创建redis链接
    redis = await aioredis.create_redis(address, password=password)

    # 网络IO操作，在redis里设置哈希值car，内部设置3个键值对
    await redis.hmset_dict("car", key1=1, key2=2, key3=3)

    # 网络IO操作，去redis中获取值
    result = await redis.hgetall("car", encoding="utf-8")
    print(result)

    redis.close()
    # 网络IO操作，关闭redis
    await redis.wait_closed()

    print("结束", address)

    
task_list = [
  execute("redis://127.0.0.1:6379", ""),
  execute("redis://127.0.0.1:6379", "")
]

asyncio.run(asyncio.await(task_list))

```



## 异步MySQL

安装一个模块

```bash
pip3 install aiomysql
```



示例1：

```python
import asyncio
import aiomysql


async def execute():
    # 网络IO操作，连接mysql
    conn = await aiomysql.connect(host='127.0.0.1', port=3306, user='root', password='', db='mysql', )

    # 网络IO操作，创建游标
    cur = await conn.cursor()

    # 执行sql
    await cur.execute("select user,host from user")

    # 网络IO操作，获取SQL执行结果
    result = await cur.fetchall()
    print(result)

    # 网络IO操作，关闭连接
    await cur.close()
    conn.close()


asyncio.run(execute())

```

