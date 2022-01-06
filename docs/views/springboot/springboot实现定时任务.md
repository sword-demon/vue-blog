---
title: 'springboot实现定时任务'
date: 2021-12-28 21:01:15
permalink: '/springboot/cron'
sidebar: 'auto'
isShowComment: true
categories:
- springboot
tags:
- null
---



## 定时任务

如果要使用`springboot`的定时任务就得在启动类上加上这个注解

```java
import org.springframework.scheduling.annotation.EnableScheduling;

// 启用定时任务
@EnableScheduling
```



写一个测试的类

`job/TestJob.java`

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class TestJob {

    private static final Logger LOG = LoggerFactory.getLogger(TestJob.class);

    /**
     * 固定时间间隔 单位毫秒
     * @throws InterruptedException
     */
    @Scheduled(fixedRate = 1000)
    public void simple() throws InterruptedException {
        SimpleDateFormat format = new SimpleDateFormat("mm:ss");
        String dateString = format.format(new Date());
        Thread.sleep(2000);
        LOG.info("每隔5秒执种执行一次: {}", dateString);
    }

    /**
     * 自定义cron表达式
     * 只有等上一次执行完成，下一次才会在下一个时间点执行，错过就错过
     * @throws InterruptedException
     */
    @Scheduled(cron = "*/1 * * * * ?")
    public void cron() throws InterruptedException {
        SimpleDateFormat format = new SimpleDateFormat("mm:ss");
        String dateString = format.format(new Date());
        Thread.sleep(1500);
        LOG.info("每隔1.5秒执种执行一次: {}", dateString);
    }
}

```



## 使用案例

定时更新表内容，即定时执行SQL



一个很好的网站工具：[在线corn表达式生成器](https://cron.qqe2.com/)



我们首先得写好业务需要的SQL

```sql
-- 更新电子书表下的所有文档的文档数，总阅读数，总点赞数
update ebook t1, (select ebook_id, count(1) as doc_count, sum(view_count) as view_count, sum(vote_count) as vote_count from doc group by ebook_id) t2
set t1.doc_count = t2.doc_count, t1.view_count = t2.view_count, t1.vote_count = t2.vote_count
where t1.id = t2.ebook_id;
```

然后我们在对应的`mapper`里进行调用

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.wx.wiki.mapper.DocMapperCust">
    <update id="updateEbookInfo">
        update ebook t1, (select ebook_id, count(1) as doc_count, sum(view_count) as view_count, sum(vote_count) as vote_count from doc group by ebook_id) t2
        set t1.doc_count = t2.doc_count, t1.view_count = t2.view_count, t1.vote_count = t2.vote_count
        where t1.id = t2.ebook_id;
    </update>
</mapper>
```

对于代码分层来说，我们理应把调用的方法写在 `service`层，然后再在定时任务里进行调用

```java
import com.wx.wiki.mapper.DocMapperCust;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class DocService {

    @Resource
    private DocMapperCust docMapperCust;

    // 定时任务更新电子书信息
    public void updateEbookInfo() {
        docMapperCust.updateEbookInfo();
    }
}

```

```java
import com.wx.wiki.service.DocService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

@Component
public class DocJob {

    private static final Logger LOG = LoggerFactory.getLogger(DocJob.class);

    @Resource
    private DocService docService;

    /**
     * 每30秒更新电子书信息
     */
    @Scheduled(cron = "5/30 * * * * ? ")
    public void cron() {
        docService.updateEbookInfo();
    }
}

```

我们还需要添加日志，进行记录后台定时任务的耗时

```java
 LOG.info("更新电子书下的文档数据开始");
long startTime = System.currentTimeMillis();
docService.updateEbookInfo();
LOG.info("更新电子书下的文档数据结束，耗时: {} 毫秒", System.currentTimeMillis() - startTime);
```



## 使用案例2

```java
package com.wujie.springboot.study.schedule;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * SpringBoot 定时任务
 */
@Slf4j
@Component
public class BootSchedule {

    private final DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm:ss");

    /**
     * 上一次开始执行时间点之后3秒后再执行一次  固定3秒的速率去执行
     */
    @Scheduled(fixedRate = 3000)
    public void schedule01() {
        log.info("schedule01 -> {}", LocalDateTime.now().format(fmt));
    }

    /**
     * 上一次执行完毕时间点之后3秒再执行
     */
    @Scheduled(fixedDelay = 3000)
    public void schedule02() {
        log.info("schedule02 -> {}", LocalDateTime.now().format(fmt));
    }

    /**
     * 第一次延迟2秒之后执行，之后按照每3秒执行一次
     */
    @Scheduled(initialDelay = 2000, fixedDelay = 3000)
    public void schedule03() {
        log.info("schedule03 -> {}", LocalDateTime.now().format(fmt));
    }

    /**
     * cron表达式
     * 每3秒执行一次
     */
    @Scheduled(cron = "*/3 * * * * ?")
    public void schedule04() {
        log.info("schedule04 -> {}", LocalDateTime.now().format(fmt));
    }
}

```

