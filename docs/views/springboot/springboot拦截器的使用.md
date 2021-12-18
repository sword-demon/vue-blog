---
title: 'springboot拦截器的使用'
date: 2021-12-18 16:01:15
# 永久链接
permalink: '/springboot/interecptor'
sidebar: 'auto'
isShowComment: true
categories:
 - springboot
tags:
 - null
---



## springboot拦截器的使用

`interecptor/LogInterecptor.java`

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 拦截器：spring框架特有的，常用于登录校验，权限校验，请求日志打印
 */
@Component
public class LogInterceptor implements HandlerInterceptor {
    private static final Logger LOG = LoggerFactory.getLogger(LogInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 打印请求信息
        LOG.info("---------------- LogInterceptor 开始 ------------------");
        LOG.info("请求地址: {} {}", request.getRequestURL(), request.getMethod());
        LOG.info("远程地址: {}", request.getRemoteAddr());

        long startTime = System.currentTimeMillis();
        request.setAttribute("requestStartTime", startTime);
        return true; // 返回true才会往后执行
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        long startTime = (Long) request.getAttribute("requestStartTime");
        LOG.info("---------------- LogInterceptor 结束 耗时: {} ms ------------------", System.currentTimeMillis() - startTime);
    }
}

```



`config/SpringMvcConfig.java`

```java
import com.wx.wiki.interceptor.LogInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.Resource;

@Configuration
public class SpringMvcConfig implements WebMvcConfigurer {

    @Resource
    LogInterceptor logInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // 注册一下拦截器
        registry.addInterceptor(logInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/login");// 不是所有接口都需要进行拦截
    }
}

```





## 过滤器和拦截器以及他们的范围

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20211218160415.png" alt="springboot的几个日志过滤的范围" /></p>

