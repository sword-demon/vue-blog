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



## 底层结构

物理结构：跳转结构

逻辑结构：线性表(链表)

链表：双向链表

放入三个元素：`"aa", "bb", "cc"`

1.   将放入的元素封装成对象

     1.   前一个元素的地址
     2.   当前存入的元素
     3.   后一个元素的地址

     ![存储结构](https://gitee.com/wxvirus/img/raw/master/img/20211120155734.png)

     **(对了，这里的箭头是双向的)**

     



代码实现：

```java
package com.linkedlist;

public class MyLinkedList {

    // 链中一定有一个首节点
    Node first;

    // 链中一定有一个尾节点
    Node last;

    // 计数器
    int count = 0;

    public MyLinkedList() {
    }

    // 添加元素的方法
    public void add(Object o) {
        if (first == null) {
            // 证明你添加的元素是第一个节点
            // 将添加的元素封装为一个Node对象
            Node n = new Node();
            n.setPre(null);
            n.setObj(o);
            n.setNext(null);
            // 当前链的第一个节点变为n
            first = n;
            // 当前链中最后一个节点变为n
            last = n;
        } else {
            // 证明已经不是链中的第一个节点了
            Node n = new Node();
            n.setPre(last); // n的上一个节点一定是当前链中的最后一个节点last
            n.setObj(o);
            n.setNext(null);
            // 当前链中的最后一个节点的下一个元素要指向n
            last.setNext(n);
            // 将最后一个节点变为n
            last = n;
        }
        // 链中元素数量加1
        count++;
    }

    // 得到结合中元素的数量
    public int getCount() {
        return this.count;
    }
    
    // 通过下标得到元素
    public Object getObject(int index) {
        // 查找得从头往下一个一个找
        // 获取链表的头元素
        Node n = first;
        for (int i = 0; i < index; i++) {
            // 一路next得到想要的元素
            n = n.getNext();
        }

        return n.getObj();
    }
}

class Test {
    public static void main(String[] args) {
        MyLinkedList m1 = new MyLinkedList();
        m1.add("aa");
        m1.add("bb");
        m1.add("cc");

        System.out.println(m1.getCount());
        
        System.out.println(m1.getObject(2)); // cc
    }
}

```

![debug验证结果](https://gitee.com/wxvirus/img/raw/master/img/20211120203233.png)



## 源码解析JDK1.8

```java
public class LinkedList<E>
    extends AbstractSequentialList<E>
    implements List<E>, Deque<E>, Cloneable, java.io.Serializable
{
    transient int size = 0; // 集合中元素的数量
    
    transient Node<E> first; // 链表的首节点
    transient Node<E> last; // 链表的尾节点
    
    // Node的内部类
    private static class Node<E> {
        E item;	// 当前元素
        Node<E> next; // 指向下一个元素的地址
        Node<E> prev; // 指向上一个元素的地址

        Node(Node<E> prev, E element, Node<E> next) {
            this.item = element;
            this.next = next;
            this.prev = prev;
        }
    }
    
    // 空构造器
    public LinkedList() {
    }
    
    // 添加元素操作
    public boolean add(E e) {
        linkLast(e);
        return true;
    }
    
    void linkLast(E e) { // 添加的元素 e
        final Node<E> l = last; // 将链表中的last节点给l，如果是第一个元素，l为null
        // 上一个元素地址，当前元素，下一个元素地址
        final Node<E> newNode = new Node<>(l, e, null); // 封装为一个对象
        last = newNode; // 将链表的last节点指向新的创建的对象
        if (l == null) // 如果添加的是第一个节点
            first = newNode; // 将链表的first指向新的节点
        else // 如果添加的不是第一个节点
            l.next = newNode; // 将l的下一个指向为新的节点
        size++; // 集合中元素数量+1
        modCount++;
    }
    
    // 获取集合中元素的数量
    public int size() {
        return size;
    }
    
    public E get(int index) {
        checkElementIndex(index); // 健壮性考虑代码
        return node(index).item;
    }
    
    Node<E> node(int index) {
        // assert isElementIndex(index);
		// 对链表的一半的值进行判断 提高了效率
        // 如果index在链表的前半段，从前往后找
        if (index < (size >> 1)) {
            Node<E> x = first;
            for (int i = 0; i < index; i++)
                x = x.next;
            return x;
        } else {
            // 从后往前找
            Node<E> x = last;
            for (int i = size - 1; i > index; i--)
                x = x.prev;
            return x;
        }
    }
}
```

**`<E>`是一个泛型，具体的类型要在实例化的时候才会最终确认**



