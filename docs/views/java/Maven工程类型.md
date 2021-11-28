---
title: 'Maven工程'
date: 2021-11-28 20:59:15
# 永久链接
permalink: '/java/maven/projecttype'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - Maven
---



## 工程类型



1.   POM工程

     >   POM工程是逻辑工程，用在父工程或聚合工程中。用来做jar包的版本控制。

2.   JAR工程

     >   将会打包成jar，用作jar包使用。即常见的本地工程：`Java Project`

3.   WAR工程

     >   将会打包成war，发布在服务器上的工程



## 过程

创建Maven标准工程

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20211128210426.png" alt="IDEA创建Maven的标准工程" /></p>

填写项目名称和项目坐标：

-   `GroupId`：类似包名，防止重名；规则一般就是域名反转，就是域名倒着写，eg：com.baidu
-   `ArtifactId`：一般使用项目名字
-   `Version`：一般默认为：`1.0-SNAPSHOT`(快照版、非正式版的项目)



<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20211128211054.png" alt="写入坐标和项目名称" /></p>

目录结构如下：

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20211128211305.png" alt="标准的maven目录结构" /></p>

-   src/main/java

    >   这个目录下存储java源代码

-   src/main/resources

    >   存储主要的资源文件。比如`xml`配置文件和`properties`或`yml`文件

-   src/test/java

    >   存储测试用的类，比如`JUNIT`的测试一般就放在这个目录下面。

-   src/test/resources

    >   可以自己创建，储存测试环境用的资源文件

-   src

    >   包含了项目所有的源代码和资源文件，以及其他项目相关的文件

-   target(使用Maven的`install`即可生成)

    >   编译后内容放置的文件夹。生成的jar包会在本地的仓库中对应的坐标下。



:::danger

目录名字不可随意修改！

:::



## 工程关系

>   Maven工具是基于POM(Project Object Model，项目对象模型)模式实现的。在Maven中每个项目都相当于是一个对象，对象(项目)和对象(项目)之间是有关系的。关系包含了：**依赖、继承、聚合**，实现了Maven项目可以更加方便的导jar包、拆分项目等效果。



### 依赖

>   即A工程开发或运行过程中需要B工程提供支持，则代表A工程依赖B工程。
>
>   在这种情况下，需要在A项目中的`pom.xml`文件中增加下属配置定义依赖关系

<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20211128213113.png" alt="依赖注入关系" /></p>

**通俗理解就是：导jar包**

B工程可以是自己的项目打包后的jar包，也可以是中央仓库的jar包。

---

**注入依赖：**

>   在`pom.xml`文件根元素`project`下的`dependencies`标签中，配置依赖信息，内可以包含多个`dependency`元素,以声明多个依赖。每个依赖`dependency`标签都应该包含一下元素：**groupI,artifactId,version**，依赖的基本坐标，Maven根据坐标才能找到需要的依赖。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.wxvirus</groupId>
    <artifactId>MavenDemo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <!-- 通过这个添加依赖，可以添加多个依赖 -->
    <dependencies>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.4</version>
        </dependency>
    </dependencies>
</project>
```

:::tip

1.   省去了程序员手动添加jar包的操作
2.   解决jar包冲突的问题

:::



#### 依赖的传递性

>   传递性是Maven2.0的新特性。假设你的项目依赖于一个库，而这个库又依赖于其他库，你不必自己去找出所有的这些依赖，你只需要加上你直接依赖的库，Maven会隐式的把这些库间依赖的库也加入到项目中。

**即：如果A依赖了B，那么C依赖A时会自动把A和B都导入进来**



创建A项目后，选择IDEA右边的Maven面板`lifecycle`，双击`install`后就会把项目安装到本地仓库中，其他项目就可以通过坐标引用此项目。

:::warning

注意：如果项目有修改，需要重新导包，执行Maven的`clean`和`install`即可。

:::

---

将A项目的依赖注入B项目

```xml
<dependencies>
	<dependency>
    	<groupId>com.wxvirus</groupId>
        <artifactId>MavenDemo</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>
</dependencies>
```

此前我这个项目是依赖了Mybatis，B项目导入依赖后，下载包会自动加上A项目依赖的Mybatis。

即：B依赖A，A依赖Mybatis -> <kbd>直接说明B可以使用Mybatis</kbd>



#### 依赖的原则

1.   第一原则：最短路径优先原则

     >   ”最短路径优先“意味着项目依赖关系树中路径最短的版本会被使用。

     例如：假设A、B、C之间依赖关系是`A->B->C->D(2.0)`和`A->E->D(1.0)`，**那么D(1.0)会被使用，因为A通过E到D(1.0)的路径会更短**。

2.   第二原则：最先声明原则

     >   基于第一原则不好使的时候。

     A->B->D(2.0)

     A->E->D(1.0)

     如果在`pom.xml`文件中B在前面就用B，E在前面就用E。



#### 依赖排除

>   用来排除传递性依赖，其中可以配置多个`exclusion`标签。每个标签里对应的应有`groupId,artifactId,version`基本元素，注意：**不用写版本号**。

```xml
<dependencies>
	<dependency>
    	<groupId>com.wxvirus</groupId>
        <artifactId>MavenDemo</artifactId>
        <version>1.0-SNAPSHOT</version>
    	<exclusions>
            <exclusion>
            	<groupId>org.mybatis</groupId>
            	<artifactId>mybatis</artifactId>
            </exclusion>
    	</exclusions>
    </dependency>
</dependencies>
```



#### 依赖范围

>   依赖范围决定了你依赖的坐标在什么情况下有效，什么情况下无效。

```xml
<dependencies>
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.4</version>
        <scope>compile</scope>
    </dependency>
</dependencies>
```

-   compile

    >   这是默认范围，如果没有指定，就会使用该依赖范围，表示**该依赖在编译和运行时都生效**。

-   provided

    >   已提供依赖范围，使用此依赖范围的Maven依赖。即编译和测试项目的时候需要该依赖，但是在运行项目的时候，由于容器已经提供，就不需要Maven重复的引入一遍(如：`servlet-api`)

-   runtime

    >   runtime范围表示编译时不需要生效，而 **只在运行时生效**。典型案例为JDBC驱动实现，项目主代码的编译只需要JDK提供的JDBC接口，只有在执行测试或者运行项目的时候才需要实现上述接口的具体JDBC驱动。

-   system

    >   系统范围与provided类似，不过你必须显式的指定一个**本地系统路径的JAR**，此类依赖应该一直有效，Maven也不会去仓库中寻找它。但是使用system范围依赖时，必须通过`systemPath`元素显式地指定依赖文件的路径。

    ```xml
    <dependencies>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.4</version>
            <scope>system</scope>
            <systemPath>本地的jar路径</systemPath>
        </dependency>
    </dependencies>
    ```

-   test

    >   test范围表示使用此依赖的范围只在**编译测试代码和运行测试代码的时候需要**，应用的正常运行不需要此类依赖。典型的例子就是`JUnit`，它只有在编译测试代码以及运行测试代码的时候才需要。导出项目的时候没有必要把`junit`的东西导出去，所以在`junit`坐标下加入`scope-test`

-   import

    >   import范围只适用于`pom.xml`文件中的`<dependencyManagement>`部分。表明指定的POM必须**使用<dependencyManagement>部分的依赖**。

    :::warning

    import只能用在`dependencyManagement`的scope里

    :::

    ```xml
    <!-- 主要用于管理，不会实际导入jar包 -->
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.mybatis</groupId>
                <artifactId>mybatis</artifactId>
                <version>${banben}</version>
                <!-- 加了 import 子工程只能使用父工程指定的版本号 -->
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
    
    <properties>
        <!-- 定义版本 -->
        <banben>3.5.4</banben>
    </properties>
    ```

    子工程如何使用：

    ```xml
    <!-- 子工程引入父工程 -->
    <parent>
    	<groupId>com.wxvirus</groupId>
        <artifactId>MavenDemo</artifactId>
        <version>1.0-SNAPSHOT</version>
        <!-- 父工程的pom文件路径 -->
        <relativePath>../MavenDemo/pom.xml</relativePath>
    </parent>
    
    <dependencies>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <!-- 此时子工程就不必要写版本号了 -->
        </dependency>
    </dependencies>
    ```

    