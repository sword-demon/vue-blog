---
title: '谓词 Predicate 的原理与应用'
date: 2022-01-24 20:40:15
# 永久链接
permalink: '/springcloud/Predicate'
sidebar: 'auto'
isShowComment: true
categories:
 - springcloud
tags:
 - null
---



>   它是`Gateway`的路由的组成部分之一，是对条件匹配的判断，对判断来猜测，它要么是`true`要么是`false`。



## 认识Predicate

>   由Java8引入，位于`java.util.function`包中，是一个`FunctionalInterface`(函数式接口)

```java
package java.util.function;

import java.util.Objects;

/**
 * Represents a predicate (boolean-valued function) of one argument.
 *
 * <p>This is a <a href="package-summary.html">functional interface</a>
 * whose functional method is {@link #test(Object)}.
 *
 * @param <T> the type of the input to the predicate
 *
 * @since 1.8
 */
@FunctionalInterface
public interface Predicate<T> {

    /**
     * Evaluates this predicate on the given argument.
     *
     * @param t the input argument
     * @return {@code true} if the input argument matches the predicate,
     * otherwise {@code false}
     */
    boolean test(T t);
}
```

`test`方法，需要输入一个参数，且返回`boolean`类型，通常是用在`Steam`的`filter`中，表示是否满足过滤条件。



既然是`Java8`的函数式编程，我们写一个测试用例来进行简单的描述

```java
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.List;
import java.util.function.Predicate;

/**
 * java8 Predicate 使用方法与思想
 * 断言 -> 判断
 */
@Slf4j
@SpringBootTest
@RunWith(SpringRunner.class)
public class PredicateTest {

    public static List<String> MICRO_SERVICE = Arrays.asList(
            "nacos", "authority", "gateway", "ribbon", "feign", "hystrix", "e-commerce"
    );

    /**
     * test 方法主要用于参数符不符合规则，返回值是 boolean
     */
    @Test
    public void testPredicateTest() {
        // 找到集合中每个字符串长度大于5的字符串进行过滤打印
        Predicate<String> letterLengthLimit = s -> s.length() > 5;
        MICRO_SERVICE.stream().filter(letterLengthLimit).forEach(System.out::println);
    }

    /**
     * and 方法 等同于 逻辑与 && 且的意思，存在一个短路的特性，需要所有的条件都满足才可以
     * 就是结合其他的 Predicate 进行一起判断
     */
    @Test
    public void testPredicateAnd() {
        Predicate<String> letterLengthLimit = s -> s.length() > 5;
        Predicate<String> letterStartWith = s -> s.startsWith("gate");

        // 两个条件同时生效
        MICRO_SERVICE.stream().filter(
                letterLengthLimit.and(letterStartWith)
        ).forEach(System.out::println);
    }

    /**
     * or 等同于 逻辑或 ||， 多个条件只要一个满足即可
     */
    @Test
    public void testPredicateOr() {
        Predicate<String> letterLengthLimit = s -> s.length() > 5;
        Predicate<String> letterStartWith = s -> s.startsWith("gate");

        // 只要有一个条件通过即可
        MICRO_SERVICE.stream().filter(
                letterLengthLimit.or(letterStartWith)
        ).forEach(System.out::println);
    }

    /**
     * negate 等同于 逻辑非 !，相反的意思
     */
    @Test
    public void testPredicateNegate() {
        Predicate<String> letterStartWith = s -> s.startsWith("gate");
        // 过滤不以 gate 开头的进行打印
        MICRO_SERVICE.stream().filter(letterStartWith.negate()).forEach(System.out::println);
    }

    /**
     * isEqual 类似于 equals()
     * 区别：先判断对象是否为 null， 如果不为null再使用 equals方()法进行比较
     */
    @Test
    public void testPredicateIsEqual() {
        Predicate<String> equalGateway = s -> Predicate.isEqual("gateway").test(s);
        MICRO_SERVICE.stream().filter(equalGateway).forEach(System.out::println);
    }
}

```

```java
Stream<T> filter(Predicate<? super T> predicate);
```

>   产生一个流，它包当前流中所有满足谓词(`Predicate`)条件的元素。



在SpringCloud Gateway中，可以根据谓词的特征，实现各种请求时的满足条件和判断。源码为`PathRoutePredicateFactory.java`工厂类。其中主要是`apply`方法是一个`Predicate`返回类型。进而来实现匹配`HTTP`请求中的所有内容(例如请求头或请求参数)，如果请求与断言相匹配则进行路由。



![struct](https://gitee.com/wxvirus/img/raw/master/img/20220124214406.png)



