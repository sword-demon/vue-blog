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



## 可变和不可变

**String不可变**

```java
String a = "abc";
```

不可变：在地址不变的情况下，想把"abc"变成"abcdef"是不可能的。这两个完全就是2个字符串了，而且分别对应的地址也是不一样的。



**StringBuilder可变**

可变：在`StringBuilder`这个对象的地址不变的情况下，想把"abc"变成"abcdef"，是可能的，直接追加即可。



## String和StringBuffer和StringBuilder的区别与联系

1.   String类是不可变类，即一旦一个String对象被创建后，包含在这个对象中的字符序列是不可改变的，直至这个对象销毁。

2.   StringBuffer类则代表一个字符序列可变的字符串，可以通过`append,insert,reverse,setCharAt,setLength`等方法改变其内容。一旦生成了最终的字符串，调用`toString`方法将其转变为`String`

3.   JDK1.5新增了一个`StringBuilder`类，与`StringBuffer`类想相似，构造方法和方法基本相同，不同的是`StringBuffer`是线程安全的，而`StringBuilder`是线程不安全的，所以性能略高。通常情况下，创建一个可变的字符串，优先考虑`StringBuilder`

     StringBuilder：JDK1.5开始  效率高  线程不安全

     StringBuffer：JDK1.0开始  效率低  线程安全