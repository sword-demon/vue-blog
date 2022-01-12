---
title: 'SpringCloud Zuul'
date: 2022-01-10 21:59:15
# 永久链接
permalink: '/springcloud/Zuul'
sidebar: 'auto'
isShowComment: true
categories:
 - springcloud
tags:
 - null
---



## 介绍

>   `Zuul`是一个`API Gateway`服务器，本质上是一个`Web Servlet`应用。
>
>   它提供了动态路由、监控等服务，这些功能实现的核心是一系列的`filters`。



<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20220111233350.png" alt="zuul" /></p>



## 开启网关

我们先定义几个多端口的同`ip`虚拟域名

```txt
127.0.0.1 server1
127.0.0.1 server2
127.0.0.1 server3
```

到本机的`hosts`文件中去添加即可。



在项目中添加新模块`gateway`

配置`pom.xml`

```xml
<dependencies>
    <!--
            Eureka 客户端, 客户端向 Eureka Server 注册的时候会提供一系列的元数据信息, 例如: 主机, 端口, 健康检查url等
            Eureka Server 接受每个客户端发送的心跳信息, 如果在某个配置的超时时间内未接收到心跳信息, 实例会被从注册列表中移除
        -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    <!-- 服务网关 -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
    </dependency>
    <!-- apache 工具类 -->
    <dependency>
        <groupId>commons-io</groupId>
        <artifactId>commons-io</artifactId>
        <version>1.3.2</version>
    </dependency>
    <dependency>
        <groupId>com.google.guava</groupId>
        <artifactId>guava</artifactId>
        <version>16.0</version>
    </dependency>
</dependencies>

<!--
        SpringBoot的Maven插件, 能够以Maven的方式为应用提供SpringBoot的支持，可以将
        SpringBoot应用打包为可执行的jar或war文件, 然后以通常的方式运行SpringBoot应用
     -->
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

建立应用启动类

```java
import org.springframework.boot.SpringApplication;
import org.springframework.cloud.client.SpringCloudApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

/**
 * 网关应用启动入口
 * 1. @EnableZuulProxy 标识当前的应用是 Zuul Server
 * 2. @SpringCloudApplication 组合了 SpringBoot应用 + 服务发现 + 熔断
 */
@SpringCloudApplication
public class ZuulGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ZuulGatewayApplication.class, args);
    }
}

```

在进行配置文件配置，这里也仅仅是单节点

```yaml
server:
  port: 9000
spring:
  application:
    name: project-gateway

eureka:
  client:
    service-url:
      # server1 是修改本机 hosts 指向 127.0.0.1
      defaultZone: http://server1:8000/eureka/
```



然后进行启动即可。不过必须先启动`Eureka Server`的启动类。



## 

## 自定义Zuul过滤器

>   需要继承`ZuulFilter`，并实现四个抽象方法

-   `filterType`：对应`Zuul`声明周期的四个阶段：`pre`、`post`、`route`和`error`
-   `filterOrder`：过滤器的优先级，数字越小，优先级越高
-   `shouldFilter`：方法返回`boolean`类型，`true`时表示是否执行该过滤器的`run`方法，`false`则表示不执行
-   `run`：过滤器的过滤逻辑



`Zuul`的过滤器的生命周期

-   **pre：在请求被路由之前调用**
-   **route：在路由请求时被调用**
-   **post：在 route 和 error 过滤器之后被调用**
-   **error：处理请求时发生错误时被调用**



### 自定义通用的抽象过滤器

```java
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;

/**
 * 一个通用的抽象过滤器类
 */
public abstract class AbstractZuulFilter extends ZuulFilter {

    // 用于在过滤器之间传递消息，每个请求的数据保存在每个请求的 ThreadLocal 中
    // 扩展了 Map
    RequestContext context;

    private final static String NEXT = "next";

    @Override
    public boolean shouldFilter() {
        RequestContext ctx = RequestContext.getCurrentContext();
        return (boolean) ctx.getOrDefault(NEXT, true);
    }

    @Override
    public Object run() throws ZuulException {
        context = RequestContext.getCurrentContext();

        return cRun();
    }

    protected abstract Object cRun();

    Object fail(int code, String msg) {
        context.set(NEXT, false);
        context.setSendZuulResponse(false);
        context.getResponse().setContentType("text/html;charset=UTF-8");
        context.setResponseStatusCode(code);
        context.setResponseBody(String.format(
                "{\"result\": \"%s!\"}", msg
        ));

        return null;
    }

    Object success() {
        context.set(NEXT, true);
        return null;
    }
}

```



### 自定义一个`pre`的抽象过滤器

```java
import org.springframework.cloud.netflix.zuul.filters.support.FilterConstants;

public abstract class AbstractPreZuulFilter extends AbstractZuulFilter {

    @Override
    public String filterType() {
        return FilterConstants.PRE_TYPE;
    }
}
```

### 自定义一个`post`的抽象过滤器

```java
import org.springframework.cloud.netflix.zuul.filters.support.FilterConstants;

public abstract class AbstractPostZuulFilter extends AbstractZuulFilter {

    // 指定过滤类型
    @Override
    public String filterType() {
        return FilterConstants.POST_TYPE;
    }
}

```



### 基于上述抽象过滤器简单自定义`Token`过滤器

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

/**
 * 校验请求中传递的token
 */
@Component
@Slf4j
public class TokenFilter extends AbstractPreZuulFilter {

    @Override
    protected Object cRun() {
        HttpServletRequest request = context.getRequest();
        log.info(String.format("%s request to %s", request.getMethod(), request.getRequestURL().toString()));
        Object token = request.getParameter("token");
        if (null == token) {
            log.error("error: token is empty");
            return fail(401, "error: token is empty");
        }
        // 继续向下走
        return success();
    }

    @Override
    public int filterOrder() {
        // 越小越先执行
        return 1;
    }
}

```



### 通过自定义过滤器实现一个简单的限流器

```java
import com.google.common.util.concurrent.RateLimiter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;

/**
 * 限流过滤器
 */
@Slf4j
@Component
@SuppressWarnings("all")
public class RateLimiterFilter extends AbstractPreZuulFilter {

    /** 每秒可以获取到2个令牌 */
    RateLimiter rateLimiter = RateLimiter.create(2.0);

    @Override
    protected Object cRun() {
        HttpServletRequest request = context.getRequest();
        if (rateLimiter.tryAcquire()) {
            log.info("get rate token success");
            return success();
        } else {
            log.error("rate limit: {}", request.getRequestURI());
            return fail(402, "error: rate limit");
        }
    }

    @Override
    public int filterOrder() {
        return 2;
    }

```

