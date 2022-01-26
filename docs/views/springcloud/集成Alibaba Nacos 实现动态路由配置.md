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



### 注册网关事件监听

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.event.RefreshRoutesEvent;
import org.springframework.cloud.gateway.route.RouteDefinition;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.cloud.gateway.route.RouteDefinitionWriter;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.ApplicationEventPublisherAware;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import reactor.core.publisher.Mono;

import java.util.List;

/**
 * 实现一个事件推送的 Aware: 动态更新路由网关 Service
 */
@Slf4j
@Service
@SuppressWarnings("all")
public class DynamicRouteServiceImpl implements ApplicationEventPublisherAware {

    /**
     * 写路由定义 的工具
     */
    private final RouteDefinitionWriter routeDefinitionWriter;

    /**
     * 获取一个路由定义
     */
    private final RouteDefinitionLocator routeDefinitionLocator;

    /**
     * 事件发布对象
     */
    private ApplicationEventPublisher publisher;

    public DynamicRouteServiceImpl(RouteDefinitionWriter routeDefinitionWriter,
                                   RouteDefinitionLocator routeDefinitionLocator) {
        this.routeDefinitionWriter = routeDefinitionWriter;
        this.routeDefinitionLocator = routeDefinitionLocator;
    }

    /**
     * @param applicationEventPublisher
     */
    @Override
    public void setApplicationEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        // 完成事件推送的句柄的初始化
        this.publisher = applicationEventPublisher;
    }

    /**
     * 增加路由定义
     *
     * @param definition
     * @return
     */
    public String addRouteDefinition(RouteDefinition definition) {
        log.info("gateway add route: [{}]", definition);

        // 保存路由配置并发布 会刷新网关里的路由配置
        routeDefinitionWriter.save(Mono.just(definition)).subscribe();
        // 发布事件通知给 gateway 同步新增的路由定义
        this.publisher.publishEvent(new RefreshRoutesEvent(this));

        return "success";
    }

    /**
     * 根据路由 id 去删除路由配置
     *
     * @param id
     * @return
     */
    private String deleteById(String id) {
        try {
            log.info("gateway delete route id: [{}]", id);
            this.routeDefinitionWriter.delete(Mono.just(id)).subscribe();
            // 发布事件通知给 gateway 去更新路由定义
            this.publisher.publishEvent(new RefreshRoutesEvent(this));

            return "delete success";
        } catch (Exception ex) {
            log.error("gateway delete route fail: [{}]", ex.getMessage(), ex);
            return "delete fail";
        }
    }

    /**
     * 更新路由
     * @param definitions
     * @return
     */
    public String updateList(List<RouteDefinition> definitions) {
        log.info("gateway update route: [{}]", definitions);

        // 先拿到当前的 Gateway 中存储的路由定义
        List<RouteDefinition> routeDefinitionsExists = routeDefinitionLocator.getRouteDefinitions()
                .buffer().blockFirst();

        if (!CollectionUtils.isEmpty(routeDefinitionsExists)) {
            // 如果当前的路由定义存在
            // 清除掉之前所有的 "旧的路由定义"
            routeDefinitionsExists.forEach(rd -> {
                log.info("delete route definition: [{}]", rd);

                // 调用删除
                deleteById(rd.getId());
            });
        }

        // 新增一个
        // 把更新的路由的定义同步到 gateway 中
        definitions.forEach(definition -> updateByRouteDefinition(definition));
        return "success";
    }

    /**
     * 更新路由
     * 更新的实现策略：删除 + 新增 = 更新
     *
     * @param definition
     * @return
     */
    public String updateByRouteDefinition(RouteDefinition definition) {
        try {
            log.info("gateway update route: [{}]", definition);
            // 删除
            this.routeDefinitionWriter.delete(Mono.just(definition.getId()));
        } catch (Exception ex) {
            return "update fail, not found rout routeId: " + definition.getId();
        }

        try {
            // 新增
            routeDefinitionWriter.save(Mono.just(definition)).subscribe();
            this.publisher.publishEvent(new RefreshRoutesEvent(this));
            return "success";
        } catch (Exception ex) {
            return "update route fail";
        }
    }
}

```

