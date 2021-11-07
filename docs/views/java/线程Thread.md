---
title: '线程Thread'
date: 2021-11-06 21:59:15
# 永久链接
permalink: '/java/thread/use'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - Thread
---



## 三种创建线程的方式

1.   继承`Thread`类
2.   实现`Runnable`接口
3.   实现`Callable`接口



## Thread类

-   自定义线程类继承`Thread`
-   重写`run()`方法，编写线程执行体
-   创建线程对象，调用`start()`方法启动线程
-   **线程不一定立即执行，看CPU调度**



```java
package com.thread;

// 继承Thread类
public class TestThread1 extends Thread {

    @Override
    public void run() {
        // 重写run() 方法
        // 线程体
        for (int i = 0; i < 20; i++) {
            System.out.println("我在看代码: " + i);
        }
    }

    public static void main(String[] args) {

        // 创建一个线程对象，调用start()方法
        TestThread1 testThread1 = new TestThread1();
        // 调用start() 开启线程
        testThread1.start();


        // main 主线程
        for (int i = 0; i < 200; i++) {
            System.out.println("我在学习多线程: " + i);
        }
    }
}

```

**交替执行，结果还是看CPU，每次结果可能都不一样**

```bash
我在看代码: 0
我在看代码: 1
我在看代码: 2
我在看代码: 3
我在看代码: 4
我在看代码: 5
我在看代码: 6
我在看代码: 7
我在看代码: 8
我在看代码: 9
我在看代码: 10
我在学习多线程: 0
我在看代码: 11
我在看代码: 12
我在学习多线程: 1
我在学习多线程: 2
我在看代码: 13
我在看代码: 14
我在看代码: 15
我在看代码: 16
我在看代码: 17
我在看代码: 18
我在看代码: 19
我在学习多线程: 3
我在学习多线程: 4
我在学习多线程: 5

# ... 后面都是我在学习多线程 数字一次往后到199 主要为了看交替执行
```

**调整2个线程的循环次数进行调整测试**





## 案例：多线程下载图片

需要一个apache的包

[下载地址](https://dlcdn.apache.org//commons/io/binaries/commons-io-2.11.0-bin.zip)

将`commons-io-2.11.0.jar`包放到`com`包下的`lib`包里，右键`lib`包添加到项目库即可使用。

```java
package com.thread;

import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.lang.ref.WeakReference;
import java.net.URL;

// 实现多线程同步下载图片
public class TestThread2 extends Thread {
    private String url; // 网络图片地址
    private String name; // 保存的文件名

    public TestThread2(String url, String name) {
        this.url = url;
        this.name = name;
    }

    // 下载图片的线程的执行体
    @Override
    public void run() {
        WebDownloader webDownloader = new WebDownloader();
        webDownloader.downloader(url, name);
        System.out.println("下载了文件名: " + name);
    }

    public static void main(String[] args) {
        // 图片可以自己找了试验
        TestThread2 t1 = new TestThread2("第1张网图.png", "1.png");
        TestThread2 t2 = new TestThread2("第2张网图.png", "2.png");
        TestThread2 t3 = new TestThread2("第3张网图.png", "3.png");

        // 并不是按照线程顺序来执行的，每次结果都不一定相同
        // 同时下载3张图片
        t1.start();
        t2.start();
        t3.start();

    }
}

// 下载器
class WebDownloader {
    // 下载方法
    public void downloader(String url, String name) {
        try {
            FileUtils.copyURLToFile(new URL(url), new File(name));
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("IO异常, downloader方法出现问题");
        }
    }
}

```



## 实现Runnable接口

1.   定义`MyRunnable`类实现`Runnable`接口
2.   实现`run()`方法，编写线程执行体
3.   创建线程对象，调用`start()`方法启动线程



:::tip

推荐使用`Runnable`对象，因为Java单继承的局限性

:::



```java
package com.thread;

// 实现Runnable接口，重写run方法，调用start
public class TestThread3 implements Runnable{
    @Override
    public void run() {
        // 重写run() 方法
        // 线程体
        for (int i = 0; i < 20; i++) {
            System.out.println("我在看代码: " + i);
        }
    }

    public static void main(String[] args) {

        // 创建runnable接口的实现类对象
        TestThread3 testThread3 = new TestThread3();
        // 创建一个线程对象，通过线程对象来开启我们的线程，代理
//        Thread thread = new Thread(testThread3);
//        thread.start();

        // 简写
        new Thread(testThread3).start();

        // main 主线程
        for (int i = 0; i < 200; i++) {
            System.out.println("我在学习多线程: " + i);
        }
    }
}

```





## 实现Callable接口(了解即可)

1.   实现`Callable`接口，需要返回值类型
2.   重写`call`方法，需要抛出异常
3.   创建目标对象
4.   创建执行服务：`ExecutorService ser = Executors.newFixedThreadPool(1);`
5.   提交执行：`Future<Boolean> result1 = ser.submit(t1);`
6.   获取结果：`boolean r1 = result1.get();`
7.   关闭服务：`ser.shutdownNow()`



```java
package com.thread;

import java.util.concurrent.*;

public class TestCallable implements Callable<Boolean> {

    private String url;
    private String name;

    public TestCallable(String url, String name) {
        this.url = url;
        this.name = name;
    }

    @Override
    public Boolean call() {
        WebDownloader webDownloader = new WebDownloader();
        webDownloader.downloader(url, name);
        System.out.println("下载了文件名: " + name);
        return true;
    }

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        TestCallable c1 = new TestCallable("网图1.png", "1.png");
        TestCallable c2 = new TestCallable("网图2.png", "2.png");
        TestCallable c3 = new TestCallable("网图3.png", "3.png");

        // 创建执行服务
        ExecutorService ser = Executors.newFixedThreadPool(3);

        // 提交执行
        Future<Boolean> r1 = ser.submit(c1);
        Future<Boolean> r2 = ser.submit(c2);
        Future<Boolean> r3 = ser.submit(c3);

        // 获取结果
        boolean rs1 = r1.get();
        boolean rs2 = r2.get();
        boolean rs3 = r3.get();
        
        // 关闭服务
        ser.shutdownNow();
    }
}

```







## 小结

1.   继承Thread类
     -   子类继承Thread类具备多线程能力
     -   启动线程：`子类对象.start()`
     -   **不建议使用：避免OOP单继承局限性**
2.   实现`Runnable`接口
     -   实现接口`Runnable`具有多线程能力
     -   启动线程：传入目标对象 + `Thread`对象.start()
     -   **推荐使用：避免单继承局限性，灵活方便，方便同一个对象被多个线程使用**

