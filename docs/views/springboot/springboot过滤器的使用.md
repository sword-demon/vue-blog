---
title: 'springboot过滤器的使用'
date: 2021-12-15 22:31:15
# 永久链接
permalink: '/springboot/filter'
sidebar: 'auto'
isShowComment: true
categories:
 - springboot
tags:
 - null
---



## SpringBoot过滤器的使用

`filter/LogFilter.java`

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@Component
public class LogFilter implements Filter {

    private static final Logger LOG = LoggerFactory.getLogger(LogFilter.class);

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        // 打印请求信息
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        LOG.info("----------- LogFilter 开始 ----------");
        LOG.info("请求地址: {} {}", request.getRequestURL().toString(), request.getMethod());
        LOG.info("远程地址: {}", request.getRemoteAddr());

        long startTime = System.currentTimeMillis();
        filterChain.doFilter(servletRequest, servletResponse);
        LOG.info("----------- LogFilter 结束 耗时: {} ms ----------", System.currentTimeMillis() - startTime);
    }

    @Override
    public void destroy() {

    }
}

```

测试结果

```bash
                ----------- LogFilter 开始 ----------
24.342 INFO  com.xxx.wiki.filter.LogFilter  :26   http-nio-8880-exec-2                   
                请求地址: http://localhost:8880/test/list GET
24.343 INFO  com.xxx.wiki.filter.LogFilter  :27   http-nio-8880-exec-2                   
                远程地址: 127.0.0.1
24.346 INFO  com.xxx.wiki.filter.LogFilter  :32   http-nio-8880-exec-2                   
                ----------- LogFilter 结束 耗时: 3 ms ----------
```

