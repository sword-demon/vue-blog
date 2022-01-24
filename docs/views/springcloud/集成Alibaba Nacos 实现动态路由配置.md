---
title: '集成Alibaba Nacos 实现动态路由配置'
date: 2022-01-24 21:53:15
# 永久链接
permalink: '/springcloud/routeFactory'
sidebar: 'auto'
isShowComment: true
categories:
 - springcloud
tags:
 - null
---



## 静态路由配置与动态路由配置

### 静态路由配置

>   静态路由配置写在配置文件中(`yml`或者`properties`)，端点是：`spring.cloud.gateway`

```yaml
# 静态路由
gateway:
	routes:
		- id: path_route # 路由的 ID
		  uri: 127.0.0,1:8080/user/{id} #匹配后路由地址
		  predicates: # 断言，路径相匹配的进行路由
		  	- Path=/user/{id}
```

>   缺点非常明显，每次改动都需要网关模块重新部署。



### 动态路由配置

>   路由信息在`Alibaba Nacos`中维护 ，可以实现动态变更。

![nacos动态路由配置](https://gitee.com/wxvirus/img/raw/master/img/20220124220005.png)



`nacos`配置信息

-   Data ID: `e-commerce-gateway-router`
-   Group: `e-commerce`
-   配置内容为`JSON`格式如下：

```json
[
  {
    "id": "e-commerce-nacos-client",
    "predicates": [
      {
        "args": {
          "pattern": "/wxvirus/ecommerce-nacos-client/**"
        },
        "name": "Path"
      }
    ],
    "uri": "lb://e-commerce-nacos-client",
    "filters": [
      {
        "name": "HeaderToken"
      },
      {
        "name": "StripPrefix",
        "args": {
          "parts": "1"
        }
      }
    ]
  }
]

```

在`nacos`中添加完成之后，我们进行编写配置类来获取配置信息

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * 配置类 用于读取Nacos相关的配置项，用于去配置监听器
 */
@Configuration
public class GatewayConfig {

    /**
     * 读取配置的超时时间
     */
    public static final long DEFAULT_TIMEOUT = 30000;

    /**
     * Nacos 服务器地址
     */
    public static String NACOS_SERVER_ADDR;

    /**
     * Nacos 命名空间
     */
    public static String NACOS_NAMESPACE;

    /**
     * Nacos Data ID
     */
    public static String NACOS_ROUTE_DATA_ID;

    /**
     * Nacos 分组 id
     */
    public static String NACOS_ROUTE_GROUP;

    @Value("${spring.cloud.nacos.discovery.server-addr}")
    public void setNacosServerAddr(String nacosServerAddr) {
        NACOS_SERVER_ADDR = nacosServerAddr;
    }

    @Value("${spring.cloud.nacos.discovery.namespace}")
    public void setNacosNamespace(String nacosNamespace) {
        NACOS_NAMESPACE = nacosNamespace;
    }

    @Value("${nacos.gateway.route.config.data-id}")
    public void setNacosRouteDataId(String nacosRouteDataId) {
        NACOS_ROUTE_DATA_ID = nacosRouteDataId;
    }

    @Value("${nacos.gateway.route.config.group}")
    public void setNacosRouteGroup(String nacosRouteGroup) {
        NACOS_ROUTE_GROUP = nacosRouteGroup;
    }
}

```

