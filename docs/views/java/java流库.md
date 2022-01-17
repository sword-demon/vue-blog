---
title: 'java流库'
date: 2022-01-16 23:33:15
# 永久链接
permalink: '/java/stream'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - stream
---



## 从迭代到流的操作

>   在处理集合时，我们通常会迭代遍历它的元素，并在每个元素上执行某项操作。比如：对一个列表中的很多个长单词进行统计计数：

```java
@Test
public void testStream1() {
    List<String> words = new ArrayList<>();
    words.add("springframework");
    words.add("SpringRunner");
    words.add("MainApplication");
    words.add("RunWith");

    int count = 0;
    for (String word : words) {
        if (word.length() > 12) {
            count++;
        }
    }
    System.out.println(count);
}
```

现在我们用流来操作

```java
@Test
public void testCountWordsByStream() {
    List<String> words = new ArrayList<>();
    words.add("springframework");
    words.add("SpringRunner");
    words.add("MainApplication");
    words.add("RunWith");

    long count = words.stream().filter(w -> w.length() > 12).count();
    System.out.println(count);
}
```

>   现在我们不必去扫描整个代码去查找过滤和计数操作，方法名就可以直接告诉我们其代码意欲何为。而且循环需要非常详细地指定操作的顺序，而流却能够以其想要的任何方式来调度这些操作，只要是结果正确即可。



```java
Stream<T> filter(Predicate<? super T> predicate);

// 产生一个流，其中包含当前流中满足 predicate 的所有元素
```

```java
long count();

// 产生当前流中的元素的数量，这是一个终止的操作
```

