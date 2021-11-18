---
title: 'LinkedList实现类'
date: 2021-11-18 21:58:15
# 永久链接
permalink: '/java/LinkedList'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



:::tip

`LinkedList`是实现了`List`接口的实现类，从名字上来看，就可以看出来底层的结构是一个**链表**形式

:::



## 常用方法

前面`List`接口有的方法就不列举了

-   增加：`addFirst(E e)、addLast(E e)、offer(E e)、offerFirst(E e)、offerLast(E e)`
-   查看：`element()`
-   获取：`getFirst()、getLast()、indexOf(Object o)、lastIndexOf(Object o)、peek()、peekFirst()、peekLast()`
-   删除：`poll()、pollFirst()、pollLast()、removeFirst()、removeLast()`



```java
package com.linkedlist;

import java.util.LinkedList;

public class Demo01 {
    public static void main(String[] args) {

        // LinkedList 的常用方法

        LinkedList<String> list = new LinkedList<>();
        list.add("aaa");
        list.add("bbb");
        list.add("ccc");
        list.add("ddd");
        list.add("eee");
        list.add("fff");
        list.add("fff");

        // LinkedList 可以添加重复数据
        System.out.println(list);

        list.addFirst("头");
        list.addLast("尾");

        System.out.println(list);
        System.out.println(list.element());

        System.out.println(list.getFirst());
        System.out.println(list.getLast());

        System.out.println(list.indexOf("fff"));

        System.out.println(list.peek());
        System.out.println(list.peekFirst());
        System.out.println(list.peekLast());

        System.out.println(list.pollFirst());
        System.out.println(list.pollLast());

        System.out.println(list.offer("无解")); // 添加到尾部
        System.out.println(list.offerFirst("无解的游戏")); // 添加到头部
        System.out.println(list.offerLast("无解的游戏1")); // 添加到最后

        // jdk1.6以后出的，提高了代码的健壮性
        System.out.println(list.pollFirst());
        System.out.println(list.removeFirst());

        list.clear(); // 清空集合

        System.out.println(list);
        list.pollFirst(); // 没东西让你删了，返回一个null
        // System.out.println(list.removeFirst()); // NoSuchElementException
    }
}

```

遍历：

```java
// 集合的遍历
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}

for (String s : list) {
    System.out.println(s);
}

// 这个 it  会直到整个方法结束了才会结束
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    System.out.println(it.next());
}

// 下面这种方式好，节省了内存 for循环结束了 it1这个变量就自动结束了
for (Iterator<String> it1 = list.iterator();it1.hasNext();) {
    System.out.println(it1.next());
}
```

