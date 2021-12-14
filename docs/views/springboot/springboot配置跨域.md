---
title: 'springboot配置跨域'
date: 2021-12-14 22:41:15
# 永久链接
permalink: '/springboot/cors'
sidebar: 'auto'
isShowComment: true
categories:
 - springboot
tags:
 - cors
---



## 配置跨域

新建`config`包，且创建一个配置类：`CorsConfig.java`

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 针对所有接口
                .allowedOriginPatterns("*")
                .allowedHeaders(CorsConfiguration.ALL)
                .allowedMethods(CorsConfiguration.ALL)
                .allowCredentials(true) // 允许前端带上凭证 比如 token
                .maxAge(3600);  // 1个小时内不需要再预检(发options请求)
    }
}

```

