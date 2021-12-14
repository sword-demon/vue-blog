---
title: 'springboot配置文件'
date: 2021-12-11 15:19:15
# 永久链接
permalink: '/springboot/properties'
sidebar: 'auto'
isShowComment: true
categories:
 - springboot
tags:
 - null
---



# springboot配置文件(自定义配置)

## 配置文件

`spring`能自动识别`resources`目录下的`.properties`、`.yml`，以及`resources/config`目录下的相关配置文件。



[yaml文件转换工具](https://toyaml.com/index.html)



:::tip 注意

`bootstrap.yml/properties`单个`SpringBoot`不会读取`bootstrap`配置，要`SpringCloud`架构下的`SpringBoot`应用才会读。

`bootstrap`一般是用于动态配置，线上可以实时修改实时生效的配置，一般可配合上`nacos`使用。

:::



>   这里会有一个疑问？哪个配置文件的优先级会比较高呢？
>
>   可以自己尝试测试：都把注释打开，设置不同的端口，看看最终运行的是哪一个。

我自己测试下来，好像是：`resources/config/application.properties`文件配置优先级比较高。

>   **但是呢，如果`config`目录下也有`yml`文件，则是以`yml`配置为优先**



## 自定义配置项

```yaml
# 自定义配置项
test:
  hello: hello
```

```properties
test.hello=hello
```

我们在类里如何获取配置项的内容呢：

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @Value("${test.hello:TEST}")
    private String testHello;

    @RequestMapping("/hello")
    public String hello() {
        return "hello world" + testHello;
    }
}

```

>   使用`@Value()`注解，里面填入变量，变量使用`${}`方式，填入配置项的字符串即可。

:::danger 生产环境容易忘记配置

到了生产环境的时候，我们可能在配置中心忘记配置有关的配置项，我们则需要在`@Value`注解中加上`:默认值`即可，如：`@Value("${test.hello:TEST}")`，当没有配置值的时候就会读取默认值。

:::

