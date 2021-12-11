---
title: 'logback日志配置'
date: 2021-12-11 00:40:15
# 永久链接
permalink: '/java/logback'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



# springboot初始项目配置案例

## logback日志配置

>   经历了最近log4j2的漏洞问题，这里采用的是logback进行日志配置

`resources/logback-spring.xml`



:::warning 版本名称问题

如果你用的是`2.2.x`版本，可以识别`logback.xml`，到`2.3`后只能用`logback-spring.xml`

:::



```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- 修改一下路径 项目根目录下log目录 mac 下换成 .\ windows为./ -->
    <property name="PATH" value=".\log"></property>

    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <!-- 实际开发可以用这一个注释掉的 -->
            <!--            <Pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} %highlight(%-5level) %blue(%-50logger{50}:%-4line) %thread %green(%-18X{LOG_ID}) %msg%n</Pattern>-->
            <Pattern>%d{ss.SSS} %highlight(%-5level) %blue(%-30logger{30}:%-4line) %thread %green(%-18X{LOG_ID})
                %msg%n
            </Pattern>
        </encoder>
    </appender>

    <appender name="TRACE_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${PATH}/trace.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <FileNamePattern>${PATH}/trace.%d{yyyy-MM-dd}.%i.log</FileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>10MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
        </rollingPolicy>
        <layout>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} %-5level %-50logger{50}:%-4line %green(%-18X{LOG_ID}) %msg%n</pattern>
        </layout>
    </appender>

    <appender name="ERROR_FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${PATH}/error.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <FileNamePattern>${PATH}/error.%d{yyyy-MM-dd}.%i.log</FileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>10MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
        </rollingPolicy>
        <layout>
            <pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} %-5level %-50logger{50}:%-4line %green(%-18X{LOG_ID}) %msg%n</pattern>
        </layout>
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <level>ERROR</level>
            <onMatch>ACCEPT</onMatch>
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>

    <root level="ERROR">
        <appender-ref ref="ERROR_FILE"/>
    </root>

    <root level="TRACE">
        <appender-ref ref="TRACE_FILE"/>
    </root>

    <root level="INFO">
        <appender-ref ref="STDOUT"/>
    </root>
</configuration>
```



**最后启动springboot项目查看日志输出效果以及`log`目录是否生成,且log目录不能作为git提交的内容**





## 修改启动文案

`XXXApplication.java`也就是你的项目的运行代码

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class XxxxApplication {

    private static final Logger LOG = LoggerFactory.getLogger(XxxxApplication.class);

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(XxxxApplication.class);
        Environment env = app.run(args).getEnvironment();
        LOG.info("启动成功!");
        LOG.info("地址: \thttp://127.0.0.1:{}", env.getProperty("server.port"));
    }
}
```

还需要在配置文件里配置端口

```properties
server.port=8880 # 端口自己定义
```



## 修改启动图案

新建`resources/banner.txt`

图案生成地址：

-   [http://www.network-science.de/ascii/](http://www.network-science.de/ascii/)
-   [https://www.bootschool.net/ascii-art](https://www.bootschool.net/ascii-art)

去生成一个内容，复制后粘贴到`banner.txt`

下次启动则会生效

```txt
////////////////////////////////////////////////////////////////////
//                          _ooOoo_                               //
//                         o8888888o                              //
//                         88" . "88                              //
//                         (| ^_^ |)                              //
//                         O\  =  /O                              //
//                      ____/`---'\____                           //
//                    .'  \\|     |//  `.                         //
//                   /  \\|||  :  |||//  \                        //
//                  /  _||||| -:- |||||-  \                       //
//                  |   | \\\  -  /// |   |                       //
//                  | \_|  ''\---/''  |   |                       //
//                  \  .-\__  `-`  ___/-. /                       //
//                ___`. .'  /--.--\  `. . ___                     //
//              ."" '<  `.___\_<|>_/___.'  >'"".                  //
//            | | :  `- \`.;`\ _ /`;.`/ - ` : | |                 //
//            \  \ `-.   \_ __\ /__ _/   .-` /  /                 //
//      ========`-.____`-.___\_____/___.-`____.-'========         //
//                           `=---='                              //
//      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^        //
//            佛祖保佑       永不宕机     永无BUG                    //
////////////////////////////////////////////////////////////////////
```



## Springboot hello world

>   我们写一个案例：在页面输出`hello world`

我们需要创建一个`controller`的包

`com.xxx.xxx.TestController.java`

**不能写超出启动类外**

```java
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @RequestMapping("/hello")
    public String hello() {
        return "hello world";
    }
}

```

进行访问：[http://127.0.0.1:8880/hello](http://127.0.0.1:8880/hello)

如果出现：“hello world” 即代表成功。

---

为什么启动类能够识别到这个控制器呢？

因为启动类被它的注解进行修饰

```java
@ComponentScan(
    excludeFilters = {@Filter(
    type = FilterType.CUSTOM,
    classes = {TypeExcludeFilter.class}
), @Filter(
    type = FilterType.CUSTOM,
    classes = {AutoConfigurationExcludeFilter.class}
)}
)
public @interface SpringBootApplication {}
```

:::tip 扫描

`@ComponentScan` 只会扫描这个类所在的包下面的子包，如果和`controller`包没有包含关系，就会扫描不倒，出现页面访问`404`

**但是如果你就想让启动类换一个位置，比如：`com.xxx.config`下，我们需要在启动类上加上扫描注解，重新扫描包的位置**

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;
import org.springframework.context.annotation.ComponentScan;

// 一般写到第二个就行了，写第三个也无所谓
@ComponentScan("com.xxx")
@SpringBootApplication
public class XxxxApplication {

    private static final Logger LOG = LoggerFactory.getLogger(XxxxApplication.class);

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(XxxxApplication.class);
        Environment env = app.run(args).getEnvironment();
        LOG.info("启动成功!");
        LOG.info("地址: \thttp://127.0.0.1:{}", env.getProperty("server.port"));
    }
}
```

**注意：不要只写`com`会扫描到第三方的`jar`包，出错非常难排查。**



后面如果会有真的第三方的包你需要进行扫描的，可以进行输如列表形式来扫描多个包的效果：

```java
@ComponentScan({"com.xxx", "com.text"})
```

:::



### 使用IDEA自带的HTTP CLIENT测试接口

在根目录新建`http`目录，且新建测试脚本`test.http`，必须以`http`为后缀结尾

输入快捷键`gtr`便可快速生成测试代码

```http
GET http://localhost:8880/hello
Accept: application/json

###
```

:::warning 警告

这里的`###`必须保留，如果写多个，就往下继续写即可。

:::



测试结果

```bash
GET http://localhost:8880/hello

HTTP/1.1 200 
Content-Type: application/json
Content-Length: 11
Date: Sat, 11 Dec 2021 06:57:41 GMT
Keep-Alive: timeout=60
Connection: keep-alive

hello world

Response code: 200; Time: 99ms; Content length: 11 bytes

```



类似单元测试代码

```http
GET http://localhost:8880/hello
#Accept: application/json

> {%
client.test("test-hello", function () {
    client.log("测试/hello接口")
    client.log(response.body);
    client.log(JSON.stringify(response.body));
    client.assert(response.status === 200, "返回码不是200");
    client.assert(response.body === "hello world", "结果验证失败");
});
%}

###


```

```bash
Testing started at 3:07 下午 ...
测试/hello接口
hello world
"hello world"

```



而这些测试的记录会存在`.idea`的文件目录下，我们可以去进行查看。



