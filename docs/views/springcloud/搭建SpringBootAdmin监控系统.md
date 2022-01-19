---
title: '搭建SpringBoot Admin监控服务器'
date: 2022-01-18 22:42:15
# 永久链接
permalink: '/springcloud/jiankong'
sidebar: 'auto'
isShowComment: true
categories:
 - springcloud
tags:
 - null
---



## 认识SpringBoot Actuator



### Actuator Endpoints(端点：HTTP 接口 返回的都是json数据)

-   Endpoints是Actuator的核心部分，它用来监视应用程序及交互；SpringBoot Actuator内置了很多Endpoints，并支持扩展。
-   SpringBoot Actuator 提供的原生端点有三类：
    -   应用配置类：自动配置信息、Spring Bean信息、yml文件信息、环境信息等
    -   度量指标类：主要是运行期间的动态信息，例如堆栈、健康指标、`metrics`信息等
    -   操作控制类：主要是指`shutdown`，用户可以发送一个请求将应用的监控功能关闭



## 搭建SpringBoot Admin监控服务器

步骤：

-   添加`SpringBoot Admin Starter`自动配置依赖

    ```xml
    <dependency>
    	<groupId>de.codecentric</groupId>
        <artifactId>spring-boot-admin-starter-server</artifactId>
        <version>2.2.0-</version>
    </dependency>
    ```

    1.   `spring-boot-admin-server`：Server端
    2.   `spring-boot-admin-server-ui`：UI界面
    3.   `spring-boot-admin-server-cloud`：对Spring Cloud的接入

-   添加启动注解：`@EnableAdminServer`



```xml
<version>1.0-SNAPSHOT</version>
<packaging>jar</packaging>

<!-- 模块名及描述信息 -->
<name>e-commerce-admin</name>
<description>监控服务器</description>

<dependencies>
    <!-- spring cloud alibaba nacos discovery 依赖 -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        <version>2.2.3.RELEASE</version>
    </dependency>
    <!-- SpringBoot Admin -->
    <dependency>
        <groupId>de.codecentric</groupId>
        <artifactId>spring-boot-admin-starter-server</artifactId>
        <version>2.2.0</version>
    </dependency>
    <!-- 开启登录认证功能 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <!-- 实现对 Java Mail 的自动化配置 -->
    <!--        <dependency>-->
    <!--            <groupId>org.springframework.boot</groupId>-->
    <!--            <artifactId>spring-boot-starter-mail</artifactId>-->
    <!--        </dependency>-->
    <dependency>
        <groupId>com.wxvirus.ecommerce</groupId>
        <artifactId>e-commerce-mvc-config</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>
</dependencies>

<!--
        SpringBoot的Maven插件, 能够以Maven的方式为应用提供SpringBoot的支持，可以将
        SpringBoot应用打包为可执行的jar或war文件, 然后以通常的方式运行SpringBoot应用
     -->
<build>
    <finalName>${artifactId}</finalName>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <executions>
                <execution>
                    <goals>
                        <goal>repackage</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```



添加启动类注解

```java
import de.codecentric.boot.admin.server.config.EnableAdminServer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@EnableAdminServer
@SpringBootApplication
public class AdminApplication {
    public static void main(String[] args) {
        SpringApplication.run(AdminApplication.class, args);
    }
}
```

添加配置文件

`bootstrap.yml`

```yaml
server:
  port: 7001
  servlet:
    context-path: /e-commerce-admin

spring:
  application:
    name: e-commerce-admin
  security:
    # 配置登录的用户名和密码
    user:
      name: wxvirus
      password: 88888888
  cloud:
    nacos:
      discovery:
      	# 启动服务发现会自动将服务进行注册到nacos
        enabled: true
        server-addr: 127.0.0.1:8848
        # nacos 的命名空间的id
        namespace: c003b6aa-b5cd-49cf-82de-7caff310140c
        # 元数据的标识
        metadata:
          management:
            # 拼接路径
            context-path: ${server.servlet.context-path}/actuator
          user.name: wxvirus
          user.password: 88888888
  thymeleaf:
    check-template: false
    check-template-location: false

# 暴露端点
management:
  endpoints:
    web:
      exposure:
        include: '*'  # 需要开放的端点。默认值只打开 health 和 info 两个端点。通过设置 *, 可以开放所有端点
  endpoint:
    health:
      show-details: always
```



<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20220119213322.png" alt="监控图" /></p>



### 被监控和管理的应用(微服务)，注册到Admin Server的两种方式

-   方式一：被监控和管理的应用程序，使用`SpringBoot Admin Client`库，通过`HTTP`调用注册到`SpringBoot Admin Server`上(基本不会使用，因为麻烦且没必要)
-   方式2：首先，被监控和管理的应用程序，注册到`SpringCloud`集成的注册中心；然后`SpringBoot Admin Server`通过注册中心获取到被监控和管理的应用程序。



## 添加安全访问控制

使用到了`spring security`

```xml
<!-- 开启登录认证功能 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

即上述配置文件中的配置用户名和密码的部分以及元数据配置部分

```yaml
spring:
  application:
    name: e-commerce-admin
  security:
    # 配置登录的用户名和密码
    user:
      name: wxvirus
      password: 88888888
  cloud:
    nacos:
      discovery:
      	# 启动服务发现会自动将服务进行注册到nacos
        enabled: true
        server-addr: 127.0.0.1:8848
        # nacos 的命名空间的id
        namespace: c003b6aa-b5cd-49cf-82de-7caff310140c
        # 元数据的标识
        metadata:
          management:
            # 拼接路径
            context-path: ${server.servlet.context-path}/actuator
          user.name: wxvirus
          user.password: 88888888
```

这样一加，后台就会有登录页面。



我们还需要进行一个配置类的编写，来进行安全认证处理

```java
import de.codecentric.boot.admin.server.config.AdminServerProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

/**
 * 配置安全认证，以便其他的微服务可以注册
 * 安全的过滤配置
 * 参考 Spring Security 的官方文档
 */
@Configuration
public class SecuritySecureConfig extends WebSecurityConfigurerAdapter {

    /**
     * 应用上下文路径
     */
    private final String adminContextPath;

    public SecuritySecureConfig(AdminServerProperties adminServerProperties) {
        this.adminContextPath = adminServerProperties.getContextPath();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        SavedRequestAwareAuthenticationSuccessHandler successHandler =
                new SavedRequestAwareAuthenticationSuccessHandler();
        successHandler.setTargetUrlParameter("redirectTo");
        // 默认的 Target Url
        successHandler.setDefaultTargetUrl(adminContextPath + "/");

        http.authorizeRequests()
                // 配置所有的静态资源和登录页允许公开访问
                .antMatchers(adminContextPath + "/assets/**")
                .permitAll()
                .antMatchers(adminContextPath + "/login")
                .permitAll()
                // 其他请求必须要经过认证
                .anyRequest().authenticated()
                .and()
                // 配置登录和登出路径
                .formLogin()
                .loginPage(adminContextPath + "/login")
                .successHandler(successHandler)
                .and()
                .logout().logoutUrl(adminContextPath + "/logout")
                .and()
                // 开启 http basic 支持，其他的服务模块注册时需要使用
                .httpBasic()
                .and()
                // 开启基于 cookie 的 csrf 保护
                .csrf()
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                // 忽略这些路径的 csrf 保护 以便其他模块实现注册
                .ignoringAntMatchers(
                        adminContextPath + "/instances",
                        adminContextPath + "/actuator/**"
                );


    }
}

```

重新启动应用，出现登录页面且配置的用户名和密码是配置中的值，只需要我们的用户名和密码不忘记，哪怕后面暴露在公网下，也不怕一些基本的安全问题。

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20220119220420.png" alt="" /></p>



## 对系统监控的告警方式



### 使用发送邮件方式进行告警

需要使用以下依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

修改之后重新导入Maven



在`bootstrap.yml`配置邮箱信息

```yaml
spring:
  #   被监控的应用状态变更为 DOWN、OFFLINE、UNKNOWN 时, 会自动发出告警: 实例的状态、原因、实例地址等信息
#   需要在 pom.xml 文件中添加 spring-boot-starter-mail 依赖
#   配置发送告警的邮箱服务器
#   但是, 这个要能连接上, 否则会报错
    mail:
      host: xxx.qq.com
      username: qq@qq.com
      password: qq
      default-encoding: UTF-8
   # 监控告警通知
  boot:
    admin:
      notify:
        mail:
          from: ${spring.mail.username}
          to: qq@qq.com
          cc: qq@qq.com
```

这里注意下缩进，我这拷贝的可能有点问题。



### 别的定制化告警方式

需要使用`AbstractEventNotifier`来实现一个方法`doNotify`

我们这里使用打印日志的方式来进行实现

```java
import de.codecentric.boot.admin.server.domain.entities.Instance;
import de.codecentric.boot.admin.server.domain.entities.InstanceRepository;
import de.codecentric.boot.admin.server.domain.events.InstanceEvent;
import de.codecentric.boot.admin.server.domain.events.InstanceStatusChangedEvent;
import de.codecentric.boot.admin.server.notify.AbstractEventNotifier;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

/**
 * 自定义告警
 */
@Slf4j
@Component
@SuppressWarnings("all")
public class WxNotifier extends AbstractEventNotifier {

    protected WxNotifier(InstanceRepository repository) {
        super(repository);
    }

    /**
     * 实现对事件的通知
     *
     * @param event
     * @param instance
     * @return
     */
    @Override
    protected Mono<Void> doNotify(InstanceEvent event, Instance instance) {
        return Mono.fromRunnable(() -> {
            // 判断是否是实例的状态发生了改变
            if (event instanceof InstanceStatusChangedEvent) {
                log.info("Instance Status Changed: [{}], [{}], [{}]",
                        instance.getRegistration().getName(), event.getInstance(),
                        ((InstanceStatusChangedEvent) event).getStatusInfo().getStatus());
            } else {
                log.info("Instance Info: [{}], [{}], [{}]",
                        instance.getRegistration().getName(), event.getInstance(),
                        event.getType());
            }
        });
   
```

```bash
2022-01-19 22:20:49.386  INFO 29847 --- [ask-Scheduler-1] com.wxvirus.commerce.notifier.WxNotifier   : Instance Info: [e-commerce-admin], [836f2d17b4e1], [REGISTERED]
2022-01-19 22:20:49.561  INFO 29847 --- [ctor-http-nio-2] com.wxvirus.commerce.notifier.WxNotifier   : Instance Status Changed: [e-commerce-admin], [836f2d17b4e1], [UP]
2022-01-19 22:20:49.641  INFO 29847 --- [ctor-http-nio-2] com.wxvirus.commerce.notifier.WxNotifier   : Instance Info: [e-commerce-admin], [836f2d17b4e1], [ENDPOINTS_DETECTED]
```



此时将另外一个服务下线，来观察状态

```bash
io.netty.channel.AbstractChannel$AnnotatedConnectException: Connection refused: /192.168.0.103:8000
	Suppressed: reactor.core.publisher.FluxOnAssembly$OnAssemblyException: 
Error has been observed at the following site(s):
	|_ checkpoint ⇢ Request to GET health [DefaultWebClient]
```

表示连接拒绝了，因为我们的服务已经下线了。

```bash
2022-01-19 22:21:38.970  INFO 29847 --- [ctor-http-nio-3] com.wxvirus.commerce.notifier.WxNotifier   : Instance Status Changed: [e-commerce-nacos-client], [cbb29bc6d572], [OFFLINE]
2022-01-19 22:21:49.406  INFO 29847 --- [ask-Scheduler-1] d.c.b.a.s.c.d.InstanceDiscoveryListener  : Instance 'cbb29bc6d572' missing in DiscoveryClient services and will be removed.
2022-01-19 22:21:49.407  INFO 29847 --- [ask-Scheduler-1] com.wxvirus.commerce.notifier.WxNotifier   : Instance Info: [e-commerce-nacos-client], [cbb29bc6d572], [DEREGISTERED]
```

下面这个正好有一个提示说实例的状态已经改变。由先前的`UPLINE`变为`OFFLINE`，也变为`DEREGISTERED`取消注册。