---
title: 'Nacos配置中心命名空间与配置分组'
date: 2022-01-15 22:17:15
# 永久链接
permalink: '/springcloud/nacos-namespace'
sidebar: 'auto'
isShowComment: true
categories:
 - springcloud
tags:
 - null
---

## 命名空间

>   用于进行租户粒度的配置隔离。不同的命名空间下，可以存在相同的`Group`和`DataID`的配置。`Namespace`的常用场景之一就是不同的配置区分隔离，例如开发测试环境和生产环境的资源(配置、服务)隔离等。

默认的命名空间是：`public`，保留空间，默认新增的配置都在`public`空间。

我们可以新建对应的：开发，测试，以及生产环境。

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20220115222246.png" alt="namespace" /></p>



### 场景一：配置隔离

我们可以在对应的一个生产环境创建一个和前面一样的配置信息，但是我们应用启动的时候还是找的是默认的`public`空间的配置信息，如果我们想要在项目上线的时候切换调用配置信息，我们需要在`bootstrap.properties`中配置对应的命名空间。

:::warning 名称空间配置

我们不能使用它的名称来进行配置，不能它叫什么就怎么配置，我们需要获取它对应旁边的<kbd>命名空间ID</kbd>

```properties
# 应用名称
spring.application.name=project-coupon
# 配置中心的地址
spring.cloud.nacos.config.server-addr=127.0.0.1:8848

# 命名空间
spring.cloud.nacos.config.namespace=de352aa4-fe35-4b22-af38-7409a4a8b2a1
```

那么我们可以重启来查看是否生效即可。

:::



### 场景2：每一个微服务之间互相隔离配置

>   每一个微服务都创建自己的命名空间，只加载自己命名空间下的所有配置。

我们可以点击前面配置进行克隆，选中对应的创建每一个微服务的命名空间，每次运行相关服务只选择对应服务的配置。

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20220115223622.png" alt="克隆配置" /></p>



### 配置集

>   所有的配置的集合。



### 配置集ID：类似文件名

:::tip

就是我们所说的`DataID`

:::



## 配置分组

>   默认所有的配置集都属于：`DEFAULT_GROUP`

不过都是可以基于业务来定制的(双十一，618等业务活动)。

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20220115224032.png" alt="新增分组" /></p>

我们新建一个双十一的分组，我们应用也要进行修改配置，才能获取到对应的配置内容。

```properties
# 对应分组
spring.cloud.nacos.config.group=11
```

然后进行应用重启即可。





## 使用

>   一般使用，是每个微服务创建自己的名称的命名空间，使用配置分组来区分环境，`dev`，`test`，`prod`



## 拆分配置

我们将`application.yml`中的一些配置进行拆分到各个细化的配置文件中，然后让应用可以加载多个配置。



我们可以将有关数据源的配置写到一个配置文件中(本地不一定需要创建，也可以将这些配置交给`nacos`来管理)：

`datasource.yml`

```yaml
spring:
  datasource:
    username: root
    password: root
    url: jdbc:mysql://127.0.0.1:3306/数据库
    driver-class-name: com.mysql.cj.jdbc.Driver
```



和`mybatis`有关的配置：

`mybatis.yml`

```yaml
mybatis-plus:
  mapper-locations: classpath:/mapper/**/*.xml
  global-config:
    db-config:
      id-type: auto # 配置主键自增
```

和框架有关的其他的一些配置信息：

`other.yml`

```yaml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
  application:
    # 必须给当前服务起名字
    name: 应用名称

server:
  port: 8082
```



最后到`nacos`里也进行配置一番，并且配置对应的所在的微服务的命名空间和对应开发环境分组。

然后配置`bootstrap.properties`文件来加载多个配置(<strong>老版本</strong>)

```properties
# 第一个配置源
spring.cloud.nacos.config.ext-config[0].data-id=datasource.yml
# 对应分组
spring.cloud.nacos.config.ext-config[0].group=dev
# 是否动态刷新
spring.cloud.nacos.config.ext-config[0].refresh=true

# 第2个配置源
spring.cloud.nacos.config.ext-config[1].data-id=mybatis.yml
# 对应分组
spring.cloud.nacos.config.ext-config[1].group=dev
# 是否动态刷新
spring.cloud.nacos.config.ext-config[1].refresh=true


# 第3个配置源
spring.cloud.nacos.config.ext-config[2].data-id=other.yml
# 对应分组
spring.cloud.nacos.config.ext-config[2].group=dev
# 是否动态刷新
spring.cloud.nacos.config.ext-config[2].refresh=true
```

然后注释原先使用的配置文件(`application.yml`)里的内容，来进行重启应用测试配置是否加载成功。

---

<kbd>新配置方法</kbd>

```properties
spring.cloud.nacos.config.extension-configs[0].data-id=datasource.yml
spring.cloud.nacos.config.extension-configs[0].group=dev
spring.cloud.nacos.config.extension-configs[0].refresh=true

spring.cloud.nacos.config.extension-configs[1].data-id=mybatis.yml
spring.cloud.nacos.config.extension-configs[1].group=dev
spring.cloud.nacos.config.extension-configs[1].refresh=true

spring.cloud.nacos.config.extension-configs[2].data-id=other.yml
spring.cloud.nacos.config.extension-configs[2].group=dev
spring.cloud.nacos.config.extension-configs[2].refresh=true
```

原先的`ext-config`已经加上了`@Deprecated`，表示此方法不再建议使用，调用时会出现删除线，但是并不代表不能用，只是说不推荐使用，因为还有更好的方法可以调用。



:::tip 重启查看控制台启动了什么内容

```bash
Located property source: [BootstrapPropertySource {name='bootstrapProperties-gulimall-coupon.properties,DEFAULT_GROUP'}, BootstrapPropertySource {name='bootstrapProperties-gulimall-coupon,DEFAULT_GROUP'}, BootstrapPropertySource {name='bootstrapProperties-other.yml,dev'}, BootstrapPropertySource {name='bootstrapProperties-mybatis.yml,dev'}, BootstrapPropertySource {name='bootstrapProperties-datasource.yml,dev'}]
```

都可以清晰的看到，分别都读取了这几个配置文件。

:::



但是呢，查看我们接口返回的内容：

```json
{"msg":"success","code":0,"name":"wujie","age":18}
```

这个文件不是上述的配置文件中的配置的值。是我本地的`application.properties`配置的值

```properties
coupon.user.name=wujie
coupon.user.age=18
```

:::tip 分组问题

从上述的控制台内容来看，我们读取的还是默认分组下的内容，但是`nacos`里没有`DEFAULT_GROUP`这一项了，被我删了，所以从我本地进行查找，输出上述内容。

还是得加上配置分组的配置：

```properties
# 对应分组
spring.cloud.nacos.config.group=dev
```

:::



我们进行修改调整，重启后再次查看内容。

```bash
Located property source: [BootstrapPropertySource {name='bootstrapProperties-gulimall-coupon.properties,dev'}, BootstrapPropertySource {name='bootstrapProperties-gulimall-coupon,dev'}, BootstrapPropertySource {name='bootstrapProperties-other.yml,dev'}, BootstrapPropertySource {name='bootstrapProperties-mybatis.yml,dev'}, BootstrapPropertySource {name='bootstrapProperties-datasource.yml,dev'}]
```

由上述控制台启动内容来看，我们这次加载的是`dev`下的分组。

也可以看到我接口的内容也随之发生了变化

```json
{"msg":"success","code":0,"name":"dev","age":20}
```



## 总结

1.   微服务任何配置信息，任何配置文件都可以放在配置中心
2.   只需要在`bootstrap.properties`说明加载配置中心中哪些配置文件即可
3.   通过`@Value`、`@ConfigurationProperties`。。。等方式从配置文件中获取值都能从配置中心中获取
4.   读取规则：**配置中心有的，优先读取配置中心的，否则从本地查找，没有就真的没有了**
5.   开发时，还是优先先使用`application.yml`集成使用所有的配置，后续上线再进行拆分配置即可。