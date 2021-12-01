---
title: 'spring源码概述'
date: 2021-11-30 22:39:15
# 永久链接
permalink: '/spring/source'
sidebar: 'auto'
isShowComment: true
categories:
 - spring
tags:
 - null
---



## Spring源码概述

>   Spring是啥，春天？这只是翻译上来说，可以理解为一个框架，一个拥有很好的生态的框架。
>
>   它提供了方便的扩展性，可以让我们程序员为所欲为。







配置xml文件(对象对应信息)

```xml
<beans>
    <!-- 包含一系列属性 -->
	<bean id="" class="" abstract init-method scope dependon>
    	<property name="" value="" />
        <property name="" ref="" />
        <constructor-arg name="" value="" /?>
    </bean>
</beans>
```

```java
ApplicationContext ac = new ClassPathXmlApplicationContext("applicationContext.xml");
Xxx xxx = ac.getBean(Xxx.class);	// 获取到一个对象 入口 Bean对象从xml文件来
```

1.   加载xml文件
2.   解析xml文件
3.   封装BeanDefinition
4.   实例化
5.   放到容器中
6.   从容器中获取