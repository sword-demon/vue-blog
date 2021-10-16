---
title: 'asyncio异步编程'
date: '2021-10-16 08:11:00'
sidebar: 'auto'
permalink: '/python/asyncio/'
categories:
 - python
tags:
 - asyncio
 - 协程
publish: true
---





## 协程

协程不是计算机提供，程序员人为创造的

协程(Coroutine)，也可以被称之为微线程，是一种用户态内的上下文切换技术。简而言之，其实就是通过程序实现代码块切换执行。例如：

```python
def func1():
  	print(1)
    
def func2():
  	print(2)
    
def func3():
  	print(3)
    
    
func1()
func2()
func3()
```



<!-- more -->



实现协程有这么几种方法：

- greenlet，早期的模块
- yield关键字，生成器，具有保存代码，保存状态，切换到其他函数去执行的特性
- python3.4之后引入的`asyncio`模块
    - 通过它的装饰器和yield
- **`async，await`关键字(python3.5之后)【推荐】**



### greenlet实现协程

安装

```bash
pip install greenlet

pip3 install greenlet

python -m pip install greenlet
```

实现

```python
from greenlet import greenlet


def func1():
    print(1)  # 第二步：输出1
    gr2.switch()  # 第三步：切换到func2函数，从上一次执行的位置继续向后执行func2函数
    print(2)  # 第六步：输出2
    gr2.switch()  # 第七步：切换到func2函数，从上一次执行的位置继续向后执行func2函数


def func2():
    print(3)  # 第四步：输出3
    gr1.switch()  # 第五步：切换回func1函数，从上一次执行的位置继续向后执行func1函数
    print(4)  # 第八步：输出4


gr1 = greenlet(func1)
gr2 = greenlet(func2)

gr1.switch()  # 第一步：去执行func1函数

# 输出结果 1 3 2 4

```



### yield关键字

```python
def func1():
  	yield 1
    yield from func2()
    yield 2
    
def func2():
  	yield 3
    yield 4
    

```



### asyncio模块

在python3.4及以后的版本。

```python
import asyncio


@asyncio.coroutine
def func1():
    print(1)
    yield from asyncio.sleep(2)	# 遇到IO耗时操作，自动化切换到tasks中的其他任务
    print(2)


@asyncio.coroutine
def func2():
    print(3)
    yield from asyncio.sleep(2) # # 遇到IO耗时操作，自动化切换到tasks中的其他任务
    print(4)


tasks = [
    asyncio.ensure_future(func1()),
    asyncio.ensure_future(func2())
]

loop = asyncio.get_event_loop()
loop.run_until_complete(asyncio.wait(tasks))

```

**注意：遇到IO阻塞自动切换**，这就是牛逼之处



### async & await关键字

在python3.5及之后的版本，本质上和上面的没啥区别

```python
import asyncio


async def func1():
    print(1)
    await asyncio.sleep(2)
    print(2)


async def func2():
    print(3)
    await asyncio.sleep(2)
    print(4)


tasks = [
    asyncio.ensure_future(func1()),
    asyncio.ensure_future(func2())
]

loop = asyncio.get_event_loop()
loop.run_until_complete(asyncio.wait(tasks))

```



## 协程的意义

> 在一个线程中如果遇到IO等待的时间，线程不会在这傻傻等着，利用IO等待的时间再去做点别的事情；

案例：去下载3张图片(网络IO)

- 普通方式(同步的方式)

    ```python
    import requests
    
    
    def download_images(url):
        print("开始下载:", url)
        # 发送网络请求，下载图片
        response = requests.get(url)
        print("下载完成")
        # 图片保存到本地
        file_name = url.rsplit("_")[-1]
        with open(file_name, mode="wb") as f:
            f.write(response.content)
    
    
    if __name__ == '__main__':
        url_list = [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG0Hl2WQnmhO_Sp_BAyjjA4y4LJLwu5M9POA&usqp=CAU",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvESXKroHI5muX_tRMN8UFOLVP1KRXmLzE-Q&usqp=CAU",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGI_d5Jb-PsXf5lPHB0P9BGxsWd8q3tCUOow&usqp=CAU"
        ]
    
        for item in url_list:
            download_images(item)
    
    ```

- 协程方式(异步的方式)

    ```python
    import asyncio
    import aiohttp
    
    
    async def fetch(session, url):
        print("发送请求", url)
        async with session.get(url, verify_ssl=False) as response:
            content = await response.content.read()
            file_name = url.rsplit("_")[-1]
            with open(file_name, mode="wb") as f:
                f.write(content)
            print("下载完成", url)
    
    
    async def main():
        async with aiohttp.ClientSession() as session:
            url_list = [
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG0Hl2WQnmhO_Sp_BAyjjA4y4LJLwu5M9POA&usqp=CAU",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvESXKroHI5muX_tRMN8UFOLVP1KRXmLzE-Q&usqp=CAU",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGI_d5Jb-PsXf5lPHB0P9BGxsWd8q3tCUOow&usqp=CAU"
            ]
            tasks = [asyncio.create_task(fetch(session, url)) for url in url_list]
    
            await asyncio.wait(tasks)
    
    
    if __name__ == '__main__':
        asyncio.run(main())
    
    ```

    



## 异步编程

### 事件循环

理解成为一个死循环，去检测并执行某些代码。

伪代码：

```python
# 伪代码任务列表 = [任务1， 任务2， 任务3...]while True:  	可执行任务列表，已完成的任务列表 = 去任务列表中检查所有的任务，将可执行和已完成的任务返回        for 就绪任务 in 已准备就绪的任务列表:      执行已就绪的任务        for 已完成的任务 in 已完成的任务列表:      在任务列表中移除已完成的任务          如果任务列表中的任务都已完成，则终止循环
```

```python
import asyncio# 去生成或获取一个事件循环loop = asyncio.get_event_loop() # 可以理解为死循环在执行了# 将任务放到任务列表loop.run_until_complete(任务)
```



### 快速上手

协程函数，定义函数的时候，加上`async def 函数名`

协程对象，执行协程函数() 得到的协程对象。

asyncio 也支持旧式的 [基于生成器的](https://docs.python.org/zh-cn/3/library/asyncio-task.html#asyncio-generator-based-coro) 协程。

```python
# 协程函数async def fuc():  	pass    result = func() # 协程对象
```

**注意：执行协程函数创建的协程对象，函数内部代码是不会执行的。**



如果想要运行，就得借助事件循环，让事件循环去执行协程对象

```python
import asyncioasync def func():    print("hello world")result = func()# loop = asyncio.get_event_loop()# loop.run_until_complete(result)asyncio.run(result)  # python3.7有的 更简单了
```



### await关键字

await + 可等待的对象，只能跟下面3种

1.  协程对象
2.  Future对象
3.  Task对象

简单粗暴理解：都是IO等待

示例1

```python
import asyncioasync def func():  print("来玩啊")  response = await asyncio.sleep(2) # 模拟等待IO  print("结束", response)  asyncio.run(func())
```

示例2

```python
import asyncioasync def others():    print("start")    await asyncio.sleep(2)    print("end")    return '返回值'async def func():    print("执行协程函数内部代码")    # 遇到IO操作挂起当前协程（任务），等待IO操作完成之后再继续往下执行，当前协程挂起时，事件循环可以去执行其他协程（任务）。    response = await others()    print("IO请求结束，结果为", response)asyncio.run(func())
```

示例3

```python
import asyncioasync def others():    print("start")    await asyncio.sleep(2)    print("end")    return '返回值'async def func():    print("执行协程函数内部代码")    # 遇到IO操作挂起当前协程（任务），等待IO操作完成之后再继续往下执行，当前协程挂起时，事件循环可以去执行其他协程（任务）。    response1 = await others()        print("IO请求结束，结果为", response1)        response2 = await others()    print("IO请求结束，结果为", response2)asyncio.run(func())
```

>   遇到await，就是等待对象的值得到结果之后再继续向下走



### Task对象

>   任务是被用来"并行的"调度协程
>
>   当一个协程通过`asyncio.create_task(协程对象)`等函数被封装为一个**任务**，该协程会被自动调度执行。
>
>   白话：帮助我们在事件循环中并发的添加多个任务。

文档示例：

```python
import asyncioasync def nested():    return 42async def main():    # Schedule nested() to run soon concurrently    # with "main()".    task = asyncio.create_task(nested())    # "task" can now be used to cancel "nested()", or    # can simply be awaited to wait until it is complete:    await taskasyncio.run(main())
```

示例1：

```python
import asyncioasync def func():    print(1)    await asyncio.sleep(2)    print(2)    return '返回值'async def main():    print("main开始")    # 创建task对象，并将当前执行func函数任务添加到事件循环    task1 = asyncio.create_task(func())    task2 = asyncio.create_task(func())    print("main结束")    # 当执行某协程时遇到IO操作，会自动切换其他任务    # 此处的await是等待相对应的协程全部执行完毕并获取返回结果    ret1 = await task1    ret2 = await task2    print(ret1, ret2)asyncio.run(main())
```

示例2

```python
import asyncioasync def func():    print(1)    await asyncio.sleep(2)    print(2)    return '返回值'async def main():    print("main开始")    task_list = [        asyncio.create_task(func(), name="n1"),  # 起名        asyncio.create_task(func(), name="n2")    ]    print("main结束")    # 当执行某协程时遇到IO操作，会自动切换其他任务    # 此处的await是等待相对应的协程全部执行完毕并获取返回结果    # ret1 = await task1    # ret2 = await task2    done, pending = await asyncio.wait(task_list, timeout=2)  # 最多等2秒    print(done, pending)asyncio.run(main())
```



示例3

```python
import asyncioasync def func():    print(1)    await asyncio.sleep(2)    print(2)    return '返回值'  # 写在外边注意，只能将协程函数放进列表里  task_list = [    func()    func()]done, pending = asyncio.run(asyncio.wait(task_list))print(done)
```



### asyncio.Future对象

更偏向底层，是Task类的基类

[`Future`](https://docs.python.org/zh-cn/3/library/asyncio-future.html#asyncio.Future) 是一种特殊的 **低层级** 可等待对象，表示一个异步操作的 **最终结果**。

当一个 Future 对象 *被等待*，这意味着协程将保持等待直到该 Future 对象在其他地方操作完毕。

在 asyncio 中需要 Future 对象以便允许通过 async/await 使用基于回调的代码。

通常情况下 **没有必要** 在应用层级的代码中创建 Future 对象。

Future 对象有时会由库和某些 asyncio API 暴露给用户，用作可等待对象:

```python
async def main():    await function_that_returns_a_future_object()    # this is also valid:    await asyncio.gather(        function_that_returns_a_future_object(),        some_python_coroutine()    )
```

一个很好的返回对象的低层级函数的示例是 [`loop.run_in_executor()`](https://docs.python.org/zh-cn/3/library/asyncio-eventloop.html#asyncio.loop.run_in_executor)。



示例1

```python
async def main():  # 获取当前事件循环  loop = asyncio.get_running_loop()    # 创建一个任务 Future对象 , 这个任务什么都不干  fut = loop.create_future()    # 等待任务最终结果, 没有结果会一直等待下去  await fut    asyncio.run(main())
```



### concurrent.futures.Future对象

实现线程池、进程池实现异步操作时用到的对象

```python
import timefrom concurrent.futures import Futurefrom concurrent.futures.thread import ThreadPoolExecutorfrom concurrent.futures.process import ProcessPoolExecutordef func(val):    time.sleep(1)    print(val)# 创建线程池pool = ThreadPoolExecutor(max_workers=5)# 或者# 创建进程池# pool = ProcessPoolExecutor(max_workers=5)for i in range(10):    fut = pool.submit(func, i)    print(fut)
```

以后写代码可能会存在交叉使用，一部分用协程，一部分用线程池。

例如：crm项目，内部的80%都是基于协程异步编程。比如操作MySQL(如果不支持)就会使用线程池或者进程池做异步编程。



交叉使用示例：

```python
import timeimport asyncioimport concurrent.futuresdef func1():    # 某个耗时操作    time.sleep(2)    return "SB"async def main():    loop = asyncio.get_running_loop()    # 将不支持协程的进行转换    fut = loop.run_in_executor(None, func1)    result = await fut    print("default thread pool", result)asyncio.run(main())
```



案例：asyncio + 不支持异步的一个模块

```python
import asyncioimport requestsasync def download_image(url):    # 发生网络请求，下载图片，(遇到网络下载的IO请求，自动切换到其他任务)    print("开始下载：", url)    loop = asyncio.get_event_loop()    # requests模块不支持异步操作，所以就使用线程池来配合实现    future = loop.run_in_executor(None, requests.get, url)    response = await future    print("下载完成")    # 图片保存到本地    file_name = url.rsplit('_')[-1]    with open(file_name, mode="wb") as file_object:        file_object.write(response.content)if __name__ == '__main__':    url_list = [        '图片.jpg'    ]    tasks = [download_image(url) for url in url_list]    loop = asyncio.get_event_loop()    loop.run_until_complete(asyncio.wait(tasks))
```



### 异步迭代器

实现了`__aiter__()`和`__anext__()`方法的对象。`__anext__`必须返回一个`awaitable`对象。`async for`会处理异步迭代器的`__anext__()`方法所返回的可等待对象，直到其引发一个`StopAsyncIteration`异常。

**什么是异步可迭代对象？**

可在`async for`语句中被使用的对象。必须通过它的`__aiter__()`方法返回一个`asynchronous_iterator`。

```python
import asyncioclass Reader(object):    """    自定义异步迭代器，同时也是异步可迭代对象    """    def __init__(self):        self.count = 0    async def readline(self):        # await asyncio.sleep(2)        self.count += 1        if self.count == 100:            return None        return self.count    def __aiter__(self):        return self    async def __anext__(self):        val = await self.readline()        if val == None:            raise StopAsyncIteration        return valasync def func():    obj = Reader()    # 必须写在协程函数内    async for item in obj:        print(item)asyncio.run(func())
```



### 异步上下文管理器

此种对象通过定义`__aenter__()`和`__aexit__()`方法来对`async with`语句中的环境进行控制。

```python
import asyncioclass AsyncContextManager:    def __init__(self):        # self.conn = conn        pass    async def do_something(self):        # 异步操作数据库        return 666    async def __aenter__(self):        # 异步连接数据库        # self.conn = await asyncio.sleep(1)        return self    async def __aexit__(self, exc_type, exc_val, exc_tb):        # 异步关闭数据库        await asyncio.sleep(1)async def func():    obj = AsyncContextManager()    async with obj:        result = await obj.do_something()        print(result)asyncio.run(func())
```

## uvloop

是asyncio的事件循环的替代方案。事件循环 > 默认asyncio的事件循环。

安装

```bash
pip3 install uvloop
```



```python
import asyncioimport uvloop# 主要是这一句asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())# 编写asyncio的代码# 内部的事件循环自动化会变成uvloopasyncio.run(...)
```



**注意：**Django3和FastAPI一个`asgi` -> `uvicorn`本质上快都是用了uvloop。