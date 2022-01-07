---
title: '自定义Starter'
date: 2022-01-07 22:19:15
permalink: '/springboot/starter'
sidebar: 'auto'
isShowComment: true
categories:
- springboot
tags:
- null
---



## 自定义Starter

我们使用`IDEA`创建一个`Maven`项目

依赖设置为

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starters</artifactId>
    <version>2.2.2.RELEASE</version>
</parent>
```

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-configuration-processor</artifactId>
        <optional>true</optional>
    </dependency>
    <!-- 自动配置的依赖 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-autoconfigure</artifactId>
    </dependency>
</dependencies>
```



让我们新建2个包：`service`和`configure`包

新建用于测试的：分割字符串的接口和实现类

```java
package com.wujie.springboot.service;

import java.util.List;

/**
 * 字符串分割服务接口定义
 */
public interface ISplitService {

    List<String> split(String value);
}

```

```java
package com.wujie.springboot.service.impl;

import com.wujie.springboot.service.ISplitService;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class SplitServiceImpl implements ISplitService {

    // 暂时未判断值是否为空的情况
    @SuppressWarnings("all")
    @Override
    public List<String> split(String value) {
        // 以逗号分割字符串返回字符串列表
        return Stream.of(StringUtils.split(value, ",")).collect(Collectors.toList());
    }
}

```

接下来配置一个配置类

```java
package com.wujie.springboot.configure;

import com.wujie.springboot.service.ISplitService;
import com.wujie.springboot.service.impl.SplitServiceImpl;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
// 发现以下类就自动配置
@ConditionalOnClass(value = {ISplitService.class, SplitServiceImpl.class})
public class SplitAutoConfigure {

    @Bean
    // 当spring上下文中不存在该bean就会实现一个自动配置
    @ConditionalOnMissingBean
    ISplitService starterService() {
        return new SplitServiceImpl();
    }
}

```



下面最重要的一点：

新建文件：`resources/META-INF/spring.factories`名称不能瞎几把乱写

用于配置需要自动配置的类

```properties
org.springframework.boot.autoconfigure.EnableAutoConfiguration=com.imooc.springboot.config.SplitAutoConfigure
```



我们如何来让它可以给我们别的项目来使用呢，我们需要使用`Maven`进行打包

命令记不住就，直接点`IDEA`的右侧的`Maven`的`Lifecycle`的`install`以及跳过测试模式即可



这样，这个包就会在我们本地的仓库里可以找到。



最后在别的项目里进行使用

复制好本`starter`的`groupId`和`artifactId`以及版本信息



我们到另外的一个`springboot`项目中，引入依赖

```xml
<dependency>
    <groupId>com.wujie.springboot</groupId>
    <artifactId>split-spring-boot-starter</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```



**测试**

```java
package com.wujie.springboot.study.service;

import com.alibaba.fastjson.JSON;
import com.wujie.springboot.service.ISplitService;
import com.wujie.springboot.study.config.SpringBootConfig;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@Slf4j
@SpringBootTest
@RunWith(SpringRunner.class)
public class SplitServiceTest {

    @Autowired
    private ISplitService splitService;

    @Autowired
    private SpringBootConfig springBootConfig;

    @Test
    public void testSplitVersion() {
        log.info("split version: {}", JSON.toJSONString(splitService.split(springBootConfig.getVersion())));
    }
}

```

获取的字符串是在配置文件里配置的内容

```yaml
# 配置文件注入
wujie:
  springboot:
    version: 2.1,2.1.4,2.4
    name: study
```

将`version`字符串以逗号隔开返回一个列表

测试结果：

```bash
: split version: ["2.1","2.1.4,2.4"]
```

