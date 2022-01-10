---
title: 'Feign声明式远程调用'
date: 2022-01-10 21:29:15
# 永久链接
permalink: '/springcloud/feign'
sidebar: 'auto'
isShowComment: true
categories:
 - springcloud
tags:
 - null
---



## 简介

>   `Feign`是一个声明式的HTTP客户端，它的目的就是让远程调用更加简单。`Feign`提供了HTTP请求的模板，通过编写简单的接口和插入注释，就可以定义好HTTP请求的参数、格式、地址等信息。
>
>   `Feign`整合了`Ribbon(负载均衡)`和`Hystrix(服务熔断)`，可以让我们不再需要显式地使用这两个组件了。
>
>   `SpringCloudFeign`在`NetflixFeign`的基础上扩展了对`SpringMVC`注解的支持，在其实现下，我们只需创建一个接口并用注解的方式来配置它，即可完成对服务提供者的接口绑定。简化了`SpringCloudRibbon`自行封装服务调用客户端的开发量。



## 使用

先在`coupon`服务中写一个测试接口

```java
@RequestMapping("/member/list")
public R memberCoupons() {
    CouponEntity couponEntity = new CouponEntity();
    couponEntity.setCouponName("满100减10");
    return R.ok().put("coupons", Arrays.asList(couponEntity));
}
```



1.   引入依赖

     ```xml
     <dependency>
         <groupId>org.springframework.cloud</groupId>
         <artifactId>spring-cloud-starter-openfeign</artifactId>
     </dependency>
     ```

2.   编写一个接口，告诉`SpringCloud`这个接口需要调用远程服务；声明接口的每一个方法都是调用哪一个远程服务的哪一个请求

     ```java
     package com.wxvirus.project.member.feign;
     
     import com.wxvirus.common.utils.R;
     import org.springframework.cloud.openfeign.FeignClient;
     import org.springframework.web.bind.annotation.RequestMapping;
     
     // 告诉spring这是一个远程客户端
     // 这是一个声明式的远程调用
     @FeignClient("coupon") // 远程服务名称，nacos里的注册的服务名称
     public interface CouponFeignService {
     
         @RequestMapping("/coupon/coupon/member/list") // 这个得写远程服务的具体路径
         public R memberCoupons();
     }
     
     ```

3.   开启远程调用功能

     ```java
     package com.wxvirus.project.member;
     
     import org.springframework.boot.SpringApplication;
     import org.springframework.boot.autoconfigure.SpringBootApplication;
     import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
     import org.springframework.cloud.openfeign.EnableFeignClients;
     
     /**
      * 1. 想要远程调用别的服务
      *  1. 引入open-feign
      *  2. 编写一个接口，告诉springcloud这个接口需要调用远程服务
      *      1. 声明接口的每一个方法都是调用哪个远程服务的哪个请求
      *  3. 开启远程调用功能 @EnableFeignClients
      */
     @EnableFeignClients(basePackages = "com.wxvirus.project.member.feign")
     @EnableDiscoveryClient
     @SpringBootApplication
     public class MemberApplication {
     
         public static void main(String[] args) {
             SpringApplication.run(MemberApplication.class, args);
         }
     
     }
     ```

4.   最后在控制器中调用测试

     ```java
     @Autowired
     CouponFeignService couponFeignService;
     
     @RequestMapping("/coupons")
     public R test() {
         MemberEntity memberEntity = new MemberEntity();
         memberEntity.setNickname("张三");
     
         R memberCoupons = couponFeignService.memberCoupons();
         return R.ok().put("member", memberEntity).put("coupons", memberCoupons.get("coupons"));
     }
     ```

5.   所得结果

     ```json
     {
         "msg":"success",
         "code":0,
         "coupons":[
             {
                 "id":null,
                 "couponType":null,
                 "couponImg":null,
                 "couponName":"满100减10",
                 "num":null,
                 "amount":null,
                 "perLimit":null,
                 "minPoint":null,
                 "startTime":null,
                 "endTime":null,
                 "useType":null,
                 "note":null,
                 "publishCount":null,
                 "useCount":null,
                 "receiveCount":null,
                 "enableStartTime":null,
                 "enableEndTime":null,
                 "code":null,
                 "memberLevel":null,
                 "publish":null
             }
         ],
         "member":{
             "id":null,
             "levelId":null,
             "username":null,
             "password":null,
             "nickname":"张三",
             "mobile":null,
             "email":null,
             "header":null,
             "gender":null,
             "birth":null,
             "city":null,
             "job":null,
             "sign":null,
             "sourceType":null,
             "integration":null,
             "growth":null,
             "status":null,
             "createTime":null
         }
     }
     ```

     

:::danger 前提

前提必须是你两个服务都在`nacos`注册服务了，否则，接口就会调用失败。

:::