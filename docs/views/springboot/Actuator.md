---
title: 'Actuator'
date: 2022-01-07 18:13:15
permalink: '/springboot/actuator'
sidebar: 'auto'
isShowComment: true
categories:
- springboot
tags:
- null
---



## Actuator介绍

-   是什么：是SpringBoot提供的对应于系统的自省和监控的集成功能。
-   能做什么：查看应用(配置)信息、环境信息以及对应应用进行操控



需要依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```



## 监控分类

### 原生端点

-   应用配置类
-   度量指标类
-   操作控制类
-   自定义端点



### 应用配置类常用监控

-   自己配置的`info`信息：`/actuator/info`
-   应用中`bean`的信息：`/actuator/beans`
-   应用用`URI`路径信息：`/actuator/mappings`



### 应用指标类常用监控

-   检查应用的运行状态：`/actuator/health`
-   当前线程活动快照：`/actuator/threaddump`



### 操作控制类常用监控

-   关闭应用(`POST`)：`/actuator/shutdown`

    ```bash
    curl -X POST "http://localhost:8000/actuator/shutdown"
    ```



### 打开所有端点

`application.yml`

```yaml
management:
  endpoint:
    shutdown:
      enabled: true # 最特殊的监控端点
  endpoints:
    web:
      exposure:
        include: "*" # * 打开所有的监控点
        
 # 自定义info信息
 info:
  app:
    name: springboot-study
    groupId: com.wujie.springboot.study
    version: 2.2.4
```





### 实现自定义端点

```java
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.boot.actuate.endpoint.annotation.WriteOperation;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 自定义事件端点
 */
@Endpoint(id = "datetime") // 标识为自定义的端点
public class DateTimeEndPoint {

    private String format = "yyyy-MM-dd HH:mm:ss";

    // json 返回格式

    /**
     * 用来显示监控指标
     * /应用程序访问前缀/actuator/datetime
     *
     * @return
     */
    @ReadOperation
    public Map<String, Object> info() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "wujie");
        info.put("age", 19);
        info.put("datetime", new SimpleDateFormat(format).format(new Date()));

        return info;
    }

    /**
     * 动态更改监控指标
     * POST 方法
     * /应用程序访问前缀/actuator/datetime
     *
     * @param format
     */
    @WriteOperation
    public void setFormat(String format) {
        this.format = format;
    }
}

```

我们还得写一个配置类

```java
import org.springframework.boot.actuate.autoconfigure.endpoint.condition.ConditionalOnEnabledEndpoint;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 自定义端点配置类
 */
@Configuration
public class DateTimeEndPointConfig {

    @Bean
    @ConditionalOnMissingBean // 当这个bean缺少时再注入
    @ConditionalOnEnabledEndpoint // 当监控端点开启的时候注入到应用程序中
    public DateTimeEndPoint dateTimeEndPoint() {
        return new DateTimeEndPoint();
    }
}

```

测试

访问地址：[http://127.0.0.1:8000/应用配置前缀/actuator/datetime](http://127.0.0.1:8000/应用配置前缀/actuator/datetime)

```json
{
    "datetime": "2022-01-07 22:13:20",
    "name": "wujie",
    "age": 19
}
```

我们再进行调用`POST`请求来改变日期输出的格式

```bash
curl --location --request POST 'http://127.0.0.1:8000/应用配置前缀/actuator/datetime' \
--header 'Content-Type: application/json' \
--data-raw '{
    "format": "yyyy-MM-dd"
}'
```

再次调用`GET`方法请求获取内容

```json
{
    "datetime": "2022-01-07",
    "name": "wujie",
    "age": 19
}
```

说明我们成功了。