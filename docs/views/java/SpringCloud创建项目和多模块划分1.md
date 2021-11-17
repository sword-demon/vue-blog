---
title: 'SpringCloud创建项目和多模块划分1'
date: 2021-11-15 23:28:15
# 永久链接
permalink: '/java/springcloudbuild'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## 使用`Idea和maven`创建项目

定义好你的项目名，直接完成(`finish`)即可。

:::tip

建议：这边创建完了，可以把父工程下的`src`代码部分进行删除

:::

打开父工程下的`pom.xml`文件进行设置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.wujie.ecommerce</groupId>
    <artifactId>ecommerce-springcloud</artifactId>
    <version>1.0-SNAPSHOT</version>

    <!-- 这个一开始会没有，但是如果在idea中新建module即模块，会自动添加
    <modules>
    </modules>
	-->

    <!-- 默认是jar 多模块是为了别的子模块提供依赖的，所以这里只能是pom 不能是jar -->
    <packaging>pom</packaging>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.1.RELEASE</version>
    </parent>

    <properties>
        <!-- Spring Cloud Hoxton.SR8 依赖 -->
        <spring-cloud.version>Hoxton.SR8</spring-cloud.version>
        <!-- spring cloud alibaba 依赖 下面依赖上面 -->
        <spring-cloud-alibaba.version>2.2.4.RELEASE</spring-cloud-alibaba.version>
    </properties>

    <dependencies>
        <!-- lombok 工具通过在代码编译时期动态的将注解替换为具体的代码,
        IDEA 需要添加 lombok 插件 -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.16.18</version>
        </dependency>

        <!-- 测试用例依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <!-- 这个是因为我的下载依赖这个有问题，所以我排除了 -->
            <exclusions>
                <exclusion>
                    <groupId>org.junit.jupiter</groupId>
                    <artifactId>junit-jupiter-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>

        <!-- 健康检查 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <!-- 工具类依赖 -->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>3.11</version>
        </dependency>
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-collections4</artifactId>
            <version>4.4</version>
        </dependency>

        <!-- 国产的一个工具类的集合 -->
        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>5.6.0</version>
        </dependency>
        <!-- 引入jwt-->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.10.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.10.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.10.5</version>
            <scope>runtime</scope>
        </dependency>

        <!-- json序列化的工具 -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.47</version>
        </dependency>
    </dependencies>

    <!-- 项目依赖管理 父项目只是声明依赖，子项目需要写明需要的依赖(可以省略版本信息) -->
    <dependencyManagement>
        <dependencies>
            <!-- spring cloud 依赖 -->
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <!-- spring cloud alibaba 依赖 -->
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>spring-cloud-alibaba-dependencies</artifactId>
                <version>${spring-cloud-alibaba.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <!-- 配置远程仓库 -->
    <repositories>
        <repository>
            <id>spring-milestones</id>
            <name>Spring Milestones</name>
            <url>https://repo.spring.io/milestone</url>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </repository>
    </repositories>

    <!-- 设置仓库插件路径 -->
    <pluginRepositories>
        <pluginRepository>
            <id>alimaven</id>
            <name>aliyum maven</name>
            <url>http://maven.aliyun.com/nexus/content/groups/public</url>
        </pluginRepository>
    </pluginRepositories>

</project>
```



## 添加通用模块

右键当前项目，新建module(模块)，命名为`e-ecommerce-common`，案例而已，自己命名即可。

模块`pom.xml`配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>ecommerce-springcloud</artifactId>
        <groupId>com.wujie.ecommerce</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>

    <modelVersion>4.0.0</modelVersion>

    <artifactId>e-commerce-common</artifactId>
    <version>1.0-SNAPSHOT</version>
    <!-- 注意这里又使用了jar进行打包 -->
    <packaging>jar</packaging>

    <!-- 模块名及描述信息 -->
    <name>e-commerce-common</name>
    <description>通用模块</description>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

</project>
```

我们需要设置通用的返回内容，新建包：即你的父工程下的`groupId`，我这里是`com.wujie.ecommerce`

因为这里没有应用程序，暂时可以新建一个`package-info.java`用于暂抵。

再新建`vo`包，用于数据展示的意思，新建`CommonResponse.java`类

```java
package com.wujie.ecommerce.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 通用响应对象定义
 * {
 *      "code": 0
 *      "message": "",
 *      "data": {} // 泛型
 * }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommonResponse<T> implements Serializable {

    /** 错误码 */
    private Integer code;

    /** 错误消息 */
    private String message;

    /** 泛型响应数据 */
    private T Data;

    public CommonResponse(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}

```





## 添加通用配置模块

名称为`e-commerce-mvc-config`

>   这里我们需要进行全局异常处理以及对响应给前台的内容进行处理

通用配置模块的`pom.xml`配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>ecommerce-springcloud</artifactId>
        <groupId>com.wujie.ecommerce</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>e-commerce-mvc-config</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <!-- 模块名及描述信息 -->
    <name>e-commerce-mvc-config</name>
    <description>通用配置模块</description>

    <dependencies>
        <!-- 引入 web 功能 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>com.imooc.ecommerce</groupId>
            <artifactId>e-commerce-common</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>
    </dependencies>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

</project>
```

也创建同样的包，再新建一个用于存放注解的包`annotation`和处理的包`advice`

---

新建标识接口不返回统一响应的注解

```java
package com.wujie.ecommerce.annotation;


import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 标识接口不返回统一的响应
 * 忽略统一响应注解定义
 */
// 可以标识在类和方法上
@Target({ElementType.TYPE, ElementType.METHOD})
// 标识保留到运行时
@Retention(RetentionPolicy.RUNTIME)
public @interface IgnoreResponseAdvice {
}

```

---

新建统一响应处理类

```java
package com.wujie.ecommerce.advice;

import com.imooc.ecommerce.annotation.IgnoreResponseAdvice;
import com.imooc.ecommerce.vo.CommonResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

/**
 * 实现统一响应
 */
// 对 response body 进行响应和拦截
@RestControllerAdvice(value = "com.wujie.ecommerce")
public class CommonResponseDataAdvice implements ResponseBodyAdvice<Object> {

    /**
     * 判断是否需要对响应进行处理
     * @param methodParameter MethodParameter
     * @param aClass Class<? extends HttpMessageConverter<?>>
     * @return
     */
    @Override
    @SuppressWarnings("all") // 屏蔽警告信息 因为下面可以简写，这里学习，不进行简写
    public boolean supports(MethodParameter methodParameter, Class<? extends HttpMessageConverter<?>> aClass) {

        // 如果controller的类被 IgnoreResponseAdvice 自定义注解标识，不需要对响应进行处理，直接返回false
        if (methodParameter.getDeclaringClass().isAnnotationPresent(IgnoreResponseAdvice.class)) {
            return false;
        }

        // 如果当前方法被 IgnoreResponseAdvice 自定义注解标识，不需要对响应进行处理，直接返回false
        if (methodParameter.getMethod().isAnnotationPresent(IgnoreResponseAdvice.class)) {
            return false;
        }
        return true;
    }


    /**
     * 在响应给客户端之前做的事
     * @param o
     * @param methodParameter
     * @param mediaType
     * @param aClass
     * @param serverHttpRequest
     * @param serverHttpResponse
     * @return
     */
    @Override
    @SuppressWarnings("all") // 因为这里初学，不简写会有警告，所以这里加了不显示警告的注解
    public Object beforeBodyWrite(Object o, MethodParameter methodParameter, MediaType mediaType, Class<? extends HttpMessageConverter<?>> aClass, ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse) {

        // 定义最终的返回对象
        CommonResponse<Object> response = new CommonResponse<>(0, "");

        // 如果响应为空，不进行包装
        if (null == o) {
            return response;
        } else if (o instanceof CommonResponse) {
            response = (CommonResponse<Object>) o;
        } else {
            // 将最终返回对象 o 将它变成 response 类型
            response.setData(o);
        }

        return response;
    }
}

```

---

全局异常处理类

```java
package com.wujie.ecommerce.advice;

import com.imooc.ecommerce.vo.CommonResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;

/**
 * 全局异常捕获处理
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionAdvice {

    // 对系统出现的所有异常进行拦截，会通过此方法进行对外返回 会提供下面2个参数
    @ExceptionHandler(value = Exception.class) // 捕捉哪些异常，对所有异常进行捕获
    public CommonResponse<String> handlerCommerceException(
            HttpServletRequest req, Exception ex
    ) {
        CommonResponse<String> response = new CommonResponse<>(-1, "business error");
        response.setData(ex.getMessage());

        log.error("commerce service has error: [{}]", ex.getMessage(), ex);

        return response;
    }
}

```

