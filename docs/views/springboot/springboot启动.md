---
title: 'springboot启动'
date: 2022-01-06 23:56:15
permalink: '/springboot/run'
sidebar: 'auto'
isShowComment: true
categories:
- springboot
tags:
- null
---



## ApplicationRunner

```java
package com.wujie.springboot.study.runner;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Order(2)
@Slf4j
@Component
public class BootApplicationRunner implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) throws Exception {
        // 开机启动
        log.info("this is BootApplicationRunner...");
    }
}

```





## CommandLineRunner

```java
package com.wujie.springboot.study.runner;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Order(1)
@Slf4j
@Component
public class BootCommandLineRunner implements CommandLineRunner {
    @Override
    public void run(String... args) throws Exception {
        log.info("this is BootCommandLineRunner...");
    }
}

```



:::tip 应用启动顺序

如果没有加上`@Order`注解来进行排序，默认是`ApplicationRunner`会先执行

:::