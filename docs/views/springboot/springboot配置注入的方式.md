---
title: 'springboot配置注入的方式'
date: 2022-01-06 22:25:15
# 永久链接
permalink: '/springboot/configuration'
sidebar: 'auto'
isShowComment: true
categories:
 - springboot
tags:
 - null
---



## @Value注解注入

我们在配置文件中写好对应的配置内容：

```yaml
# 配置文件注入
wujie:
  springboot:
    version: 2.1,2.1.4,2.4
    name: study
```

写一个测试的控制器来获取

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 测试 Controller
 */
@Slf4j
@RestController
@RequestMapping("/springboot")
public class TestController {

    @Value("${wujie.springboot.version}")
    private String version;

    @Value("${wujie.springboot.name}")
    private String name;
    
    /**
     * 第一种方式的数据注入
     * 127.0.0.1:8000/wujie/springboot/conf_inject_1
     */
    @GetMapping("/conf_inject_1")
    public void fistConfInject() {
        log.info("first conf inject: {}, {}", version, name);
    }
}

```

:::tip 访问地址

`127.0.0.1:8000/wujie/springboot/conf_inject_1`这个是我配置了如下内容

```yaml
server:
  servlet:
    context-path: /wujie
  port: 8000
```

:::

## 配置类进行注入

```java
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * SpringBoot 配置
 */
@Data
@Component // 标识它为一个Bean
// 配置前缀
@ConfigurationProperties(prefix = "wujie.springboot")
public class SpringBootConfig {

    // 必须和配置文件的名称相对应
    private String version;

    private String name;
}

```

```java
import com.wujie.springboot.study.config.SpringBootConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 测试 Controller
 */
@Slf4j
@RestController
@RequestMapping("/springboot")
public class TestController {
    /**
     * SpringBootConfig
     */
    private final SpringBootConfig springBootConfig;

    public TestController(SpringBootConfig springBootConfig) {
        this.springBootConfig = springBootConfig;
    }

    /**
     * 第二种方式的数据注入
     */
    @GetMapping("/conf_inject_2")
    public void secondConfInject() {
        log.info("second conf inject: {}, {}", springBootConfig.getVersion(), springBootConfig.getName());
    }
}

```

