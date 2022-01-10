---
title: 'nacos配置中心'
date: 2022-01-10 21:59:15
# 永久链接
permalink: '/springcloud/nacos-config'
sidebar: 'auto'
isShowComment: true
categories:
 - springcloud
tags:
 - null
---



官方文档：[https://github.com/alibaba/spring-cloud-alibaba/blob/master/spring-cloud-alibaba-examples/nacos-example/nacos-config-example/readme-zh.md](https://github.com/alibaba/spring-cloud-alibaba/blob/master/spring-cloud-alibaba-examples/nacos-example/nacos-config-example/readme-zh.md)

## 接入Nacos配置中心

1.   首先，修改公共模块`common`引入`Nacos Config Starter`

     ```xml
     <dependency>
         <groupId>com.alibaba.cloud</groupId>
         <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
     </dependency>
     ```

2.   在应用的`/src/main/resources/bootstrap.properties`配置文件中配置`Nacos Config`元数据

     ```properties
     # 应用名称
     spring.application.name=coupon
     # 配置中心的地址
     spring.cloud.nacos.config.server-addr=127.0.0.1:8848
     ```

     或者使用`bootstrap.yml`

3.   完成上述两个步骤之后，到配置文件里写2个变量，从控制器中去尝试获取值

     ```properties
     coupon.user.name=wujie
     coupon.user.age=18
     ```

4.   控制器

     ```java
     @Value("${coupon.user.name}")
     private String name;
     
     @Value("${coupon.user.age}")
     private Integer age;
     
     @RequestMapping("/test")
     public R test() {
         return R.ok().put("name", name).put("age", age);
     }
     ```

     :::tip

     这里配置文件中还不能写`user.name`，会获取系统变量的用户名

     :::

5.   我们需要实现一个功能，配置修改我们能够立即看到数据的变动，我们可以到`nacos`中去配置，添加的配置详情如下：

     首先我们在控制台里看到这一行数据

     ```properties
     Located property source: [BootstrapPropertySource {name='bootstrapProperties-gulimall-coupon.properties,DEFAULT_GROUP'}, BootstrapPropertySource {name='bootstrapProperties-gulimall-coupon,DEFAULT_GROUP'}]
     ```

     我们可以去配置一个默认规则为当前应用的名称的一个`properties`，称之为：数据集(Data Id)

     给`应用名.properties`添加任何配置

     <p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20220111001346.png" alt="nacos配置中心" /></p>

     点击发布，然后重启服务，重新加载`properties`，再去进行访问测试接口；

     如果想要动态获取并刷新配置，我们需要加上一个注解

     ```java
     import org.springframework.beans.factory.annotation.Value;
     import org.springframework.cloud.context.config.annotation.RefreshScope;
     
     @RefreshScope
     @RestController
     @RequestMapping("coupon/coupon")
     public class CouponController {
         @Autowired
         private CouponService couponService;
     
         @Value("${coupon.user.name}")
         private String name;
     
         @Value("${coupon.user.age}")
         private Integer age;
     
         @RequestMapping("/test")
         public R test() {
             return R.ok().put("name", name).put("age", age);
         }
     }
     ```

     然后我们直接在配置中心编辑修改配置内容，然后发布，后面我们就不需要重新打包微服务再进行发布。

6.   如果配置中心和当前应用的配置文件中都配置了相同的项，那么**优先使用配置中心的配置**



:::tip 

这里我有一个小犯病，我配置了一个`6000`的端口，重启`nacos`，重启了服务，服务控制台愣是没啥毛病，网页请求愣是说找不到网页链接，但是它有一个提示，`这是一个不安全的还是啥来着的端口`，我当时也没咋在意，拼命的在找还有没有别的其他的错误，谁知后来修改个`8082`就他么行了。吐血!。

:::







