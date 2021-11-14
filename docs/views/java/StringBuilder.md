---
title: 'StringBuilder'
date: 2021-11-12 22:28:15
# 永久链接
permalink: '/java/StringBuilder'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## StringBuilder

可变字符串：

-   `StringBuilder`
-   `StringBuffer`



**StringBuilder底层：非常重要的两个属性：**

```java
/**
  * The value is used for character storage.
  */
byte[] value;

// value就是StrigBuilder底层的存储
```

```java
/**
  * The count is the number of characters used.
  */
int count;

// count指的是value数组中被使用的长度
```



```java
public class Test04 {
    public static void main(String[] args) {
        // 表面上调用它本身的空构造器，实际底层是对value数组进行初始化，且初始化长度为16
        StringBuilder sb = new StringBuilder();
        // 表面上调用它本身的空构造器，实际底层是对value数组进行初始化，且初始化长度为传入的3
        StringBuilder sb1 = new StringBuilder(3);
        // 表面上调用它本身的空构造器，实际底层是对value数组进行初始化，且初始化长度为你传入的字符串的长度加上16
        StringBuilder sb2 = new StringBuilder("abc");
        // 如果追加的字符串超出一定的长度，会进行扩容
        sb2.append("def").append("ghijklmn"); // 链式调用 ：底层 return this;

        System.out.println(sb2);
        System.out.println(sb2.length());
    }
}

```



