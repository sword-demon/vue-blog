---
title: '集成Validation做参数校验'
date: 2021-12-20 22:09:15
# 永久链接
permalink: '/springboot/validation'
sidebar: 'auto'
isShowComment: true
categories:
 - springboot
tags:
 - null
---



## 集成`spring-boot-starter-validation`

`pom`依赖

**它是springboot内置的，所以不需要加上版本号**

```xml
 <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-validation</09artifactId>
</dependency>
```

在`PageReq.java`上进行校验注解测试

```java
@NotNull(message = "【每页条数】不能为空")
@Max(value = 1000, message = "【每页条数】不能超过1000")
private int size;
```

​	

加完注解，还必须得开启，在控制器中对请求参数进行参数校验

```java
@GetMapping("/list")
public CommonResp<PageResp<EbookQueryResp>> list(@Valid EbookQueryReq req) {
    CommonResp<PageResp<EbookQueryResp>> resp = new CommonResp<>();
    PageResp<EbookQueryResp> list = ebookService.list(req);
    resp.setContent(list);
    return resp;
}
```



对部分因为页面校验错误，而导致前端一直处于`loading`状态进行处理

添加全局异常处理

```java
import com.wx.wiki.resp.CommonResp;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
/**
 * 统一异常处理、数据预处理
 */
@ControllerAdvice
public class ControllerExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ControllerExceptionHandler.class);

    @ExceptionHandler(value = BindException.class)
    @ResponseBody
    public CommonResp validExceptionHandler(BindException e) {
        CommonResp commonResp = new CommonResp();
        log.warn("参数校验失败: {}", e.getBindingResult().getAllErrors().get(0).getDefaultMessage());
        commonResp.setSuccess(false);
        commonResp.setMessage(e.getBindingResult().getAllErrors().get(0).getDefaultMessage());
        return commonResp;
    }
}

```

这个我们不需要去进行调用，`spring`会帮我们自动进行调用。