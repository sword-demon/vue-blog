---
title: 'Collections工具类'
date: 2021-11-23 23:28:15
# 永久链接
permalink: '/java/collections'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## 常用方法

**Collections 不支持创建对象，构造器私有化，直接使用类名.方法名使用，方法都是被`static`修饰**。

```java
import java.util.ArrayList;
import java.util.Collections;

public class Demo {
    public static void main(String[] args) {

        // Collections 不支持创建对象，构造器私有化

        // 1. addAll
        ArrayList<String> list = new ArrayList<>();
        list.add("aa");
        list.add("bb");
        list.add("cc");
        Collections.addAll(list, "dd", "ee", "ff");
        System.out.println(list);

        // 2. binarySearch 前提：必须在有序的集合中查找
        // 先进行排序
        Collections.sort(list); // sort 提供的是一个升序的排列
        System.out.println(Collections.binarySearch(list, "cc")); // 返回对应的索引

        // 3. copy：替换的方法，将后面的内容替换到前面的内容
        ArrayList<String> list2 = new ArrayList<>();
        Collections.addAll(list2, "tt", "ss");
        Collections.copy(list, list2);

        System.out.println(list);
        System.out.println(list2);

        // 4. fill: 填充 所有的都变成yyy
        Collections.fill(list2, "yyy");
        System.out.println(list2);
    }
}

```



