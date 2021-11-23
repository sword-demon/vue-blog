---
title: 'Map接口'
date: 2021-11-21 20:21:15
# 永久链接
permalink: '/java/map'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## Map接口

`Map<K,V>`

类型参数：

`K`：此映射所维护的键的类型

`V`：此映射值的类型



<!-- more -->

---

```java
boolean containsKey(Object key);

boolean containsValue(Object value);

Set<Map.Entry<K,V>> entrySet();

V get(Object key);

boolean isEmpty();

V put(K key, V value);

void putAll(Map<? extends K,? extends V> m);

// etc...
```

----

特点：

-   无序
-   唯一

---

常用方法：

```java
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class Demo01 {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("年龄", 19);
        map.put("身份证号", 2132131);
        map.put("学号", 20);
        map.put("学号", 21);

        // 移除
        // map.remove("学号");

        // 是否包含key和value
        System.out.println(map.containsKey("学号"));
        System.out.println(map.containsValue(21));

        System.out.println(map.size());
        System.out.println(map);

        System.out.println(map.isEmpty()); // false 是否为空

        // 根据key获取value
        System.out.println(map.get("年龄"));

        System.out.println("----------------------->");

        // 对集合中的key进行遍历查看
        Set<String> set = map.keySet();
        for (String s : set) {
            System.out.println(s);
        }

        System.out.println("----------------------->");

        // 获取集合中的所有值方式1
        Collection<Integer> values = map.values();
        for (Integer value : values) {
            System.out.println(value);
        }

        System.out.println("----------------------->");

        // 获取集合中的所有的值方式2
        for (String s : set) {
            System.out.println(map.get(s));
        }

        System.out.println("----------------------->");
        // 获取集合中的所有值方式3
        Set<Map.Entry<String, Integer>> entries = map.entrySet();
        for (Map.Entry<String, Integer> entry : entries) {
            // 得到一对数据
//            System.out.println(entry);
            System.out.println(entry.getKey() + "---" + entry.getValue());
        }
    }

```



## 实现类

![Map接口的实现类](https://gitee.com/wxvirus/img/raw/master/img/20211121205920.png)

-   HashMap JDK1.2 效率高 线程不安全  key可以存入空值，null值也得遵循唯一的特点
-   Hashtable JDK1.0 效率低  线程安全



![Map接口系列](https://gitee.com/wxvirus/img/raw/master/img/20211121211149.png)



`TreeMap`

```java
import java.util.Map;
import java.util.TreeMap;

public class Demo02 {

    public static void main(String[] args) {
        Map<String, Integer> map = new TreeMap<>();
        map.put("bilibili", 20);
        map.put("ailibili", 202312);
        map.put("cilibili", 20213);
        map.put("dilibili", 2232);

        System.out.println(map.size());
        System.out.println(map);
    }
}
```





## HashMap

```java
import java.util.HashMap;

public class Demo03 {
    public static void main(String[] args) {
        HashMap<Integer, String> hm = new HashMap<>();
        // 存储数据
        System.out.println(hm.put(1, "无解"));
        System.out.println(hm.put(2, "virus"));
        System.out.println(hm.put(3, "hash"));
        System.out.println(hm.put(4, "map"));
        System.out.println(hm.put(2, "啦啦啦"));

        System.out.println(hm);
        System.out.println(hm.size());
    }
}

```

```bash
null
null
null
null
virus
{1=无解, 2=啦啦啦, 3=hash, 4=map}
4
```



简单原理图

![简单原理图](https://gitee.com/wxvirus/img/raw/master/img/20211122235050.png)

-   JDK1.7之前相同key的元素是使用链表的头插法
-   JDK1.8之后使用的是链表的尾插法
-   俗称：**7上8下**

在底层数组中存储的其实是一个封装好的`Entry`类的对象，而底层可见的就是一个`Entry[]`数组。



---

```java
public class HashMap<K,V> extends AbstractMap<K,V>
    implements Map<K,V>, Cloneable, Serializable
```

>   HashMap的K,V的值，在创建对象的时候确定，就上述例子来说，`K：Integer  V：String`

```java
public abstract class AbstractMap<K,V> implements Map<K,V>
```

>   HashMap父类`AbstractMap`已经实现了`Map`接口，但是自己又单独实现了`Map`接口 ，这个操作就是一个多余的操作。--- **大佬说自己写的多余了，任性，也不改掉**

---

重要属性：

```java
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16 就是定义了一个16，最终会赋给数组的长度
```

```java
static final int MAXIMUM_CAPACITY = 1 << 30; // 非常大的一个数

static final float DEFAULT_LOAD_FACTOR = 0.75f; // 负载因子，加载因子

transient Node<K,V>[] table; // 底层数组

transient int size; // 添加的元素的个数

int threshold; // 没赋值默认为0，用来表示数组扩容的边界值，门槛值

final float loadFactor; // 用来接收：装填因子，负载因子，加载因子
```

```java
// 空构造器
public HashMap() {
    this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
}

// 有参构造器
public HashMap(int initialCapacity) {
    this(initialCapacity, DEFAULT_LOAD_FACTOR);
}

// 不建议使用者调用这个构造器
public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
                                           initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " +
                                           loadFactor);
    this.loadFactor = loadFactor;
    this.threshold = tableSizeFor(initialCapacity);
}

// cap = 2^n 
static final int tableSizeFor(int cap) {
     int n = cap - 1;
     n |= n >>> 1;
     n |= n >>> 2;
     n |= n >>> 4;
     n |= n >>> 8;
     n |= n >>> 16;
     return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
 }
```

:::details 存储数据的方法

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}

/**
     * Implements Map.put and related methods.
     *
     * @param hash hash for key
     * @param key the key
     * @param value the value to put
     * @param onlyIfAbsent if true, don't change existing value
     * @param evict if false, the table is in creation mode.
     * @return previous value, or null if none
     */
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    else {
        Node<K,V> e; K k;
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {
                    p.next = newNode(hash, key, value, null);
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    break;
                }
                // 比较key是否是同一个对象，如果key是一个对象的话，equals就不比较了，如果不是同一个对象，会比较equals方法，如果hash值一样，equals方法比较的结果也一样，那么才会走这个if里
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;
            }
        }
        // 发生哈希碰撞
        if (e != null) { // existing mapping for key
            // 获取老的值
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                // 新的值替换老的值  --> 只替换value不替换key
                e.value = value;
            afterNodeAccess(e);
            // 返回老的值
            return oldValue;
        }
    }
    ++modCount;
    if (++size > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}

// 为的就是让我们最后得到的哈希值尽量不一样
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}

// 计算元素在数组中的位置的公式
private static int indexFor(int h, int length) {
    return h & (length-1);
}

// 添加元素的方法
private void addEntry(int hash, K key, V value, int index) {
    modCount++;

    Entry<?,?> tab[] = table;
    if (count >= threshold) {
        // Rehash the table if the threshold is exceeded
        rehash();

        tab = table;
        hash = key.hashCode();
        index = (hash & 0x7FFFFFFF) % tab.length;
    }

    // Creates the new entry.
    @SuppressWarnings("unchecked")
    Entry<K,V> e = (Entry<K,V>) tab[index];
    // 创建一个Entry的对象
    tab[index] = new Entry<>(hash, key, value, e);
    count++;
}
```

:::



## HashMap经典面试题

### 1. 为什么装填因子、负载因子、加载因子是0.75

>   如果装填因子为1：空间利用率得到了很大的满足，装东西却很容易碰撞，就会产生链表，链表就会查询效率低。
>
>   如果为0.5：如果长度为16，基本8个就可以了，碰撞的概率就低了，就会扩容，产生链表的几率很低，查询效率高，空间利用率低。
>
>   0.5-1：取中间值 -> 0.75

代码注释原文：

```txt
As a general rule, the default load factor (.75) offers a good
 tradeoff between time and space costs.  Higher values decrease the
 space overhead but increase the lookup cost (reflected in most of
 the operations of the <tt>HashMap</tt> class, including
 <tt>get</tt> and <tt>put</tt>).  The expected number of entries in
 the map and its load factor should be taken into account when
 setting its initial capacity, so as to minimize the number of
 rehash operations.  If the initial capacity is greater than the
 maximum number of entries divided by the load factor, no rehash
 operations will ever occur.
```

翻译：

```txt
	作为一般规则，默认的负载系数(.75)提供了一个良好的时间和空间成本之间的权衡。较高的值降低空间开销，但增加了查找成本(反映在大多数HashMap类的操作，包括(get and put)。输入条目的预期数量地图及其载重系数应在时考虑设置其初始容量，以便使数量最小化重复操作。如果初始容量大于最大条目数除以负载因子，没有重新散列操作永远不会发生
```



### 2. 主数组的长度为什么必须为2^n

-   `h & (length - 1)`等效于`h % length`操作，等效的前提，`length`必须是2的整数倍

-   为了防止哈希冲突，位置冲突

    验证：

    ```
    验证整数倍
    length: 8
    hash: 3 	000 00011
    length-1	000 00111
    
    			000 00011   --> 3位置
    			
    			
    hash: 2		000 000010
    lenght-1	000 000111
    			
    			000	000010  --> 2位置
    			
    验证不是整数倍
    length: 9
    hash 3		000 000011
    length-1	000 001000
    
    			000 000000  ---> 0位置
    			
    hash: 2		000 000010
    length-1	000 001000
    
    			000 000000  ---> 0位置
    会产位置冲突
    ```

    

## HashSet

```java
public class HashSet<E>
    extends AbstractSet<E>
    implements Set<E>, Cloneable, java.io.Serializable
```

```java
// 重要属性
private transient HashMap<E,Object> map;

private static final Object PRESENT = new Object();
```

```java
// 构造器
public HashSet() {
    map = new HashMap<>(); // HashSet底层就是利用HashMap来完成的
}
```

```java
// add 方法
public boolean add(E e) {
    return map.put(e, PRESENT)==null;
}
```





## TreeMap

```java
import java.util.Map;
import java.util.TreeMap;

public class Demo02 {

    public static void main(String[] args) {
        Map<String, Integer> map = new TreeMap<>();
        map.put("bilibili", 20);
        map.put("ailibili", 202312);
        map.put("cilibili", 20213);
        map.put("dilibili", 2232);

        System.out.println(map.size());
        System.out.println(map);
    }
}
```

![案例图示](https://gitee.com/wxvirus/img/raw/master/img/20211123231507.png)

---

源码解析：

```java
public class TreeMap<K,V>
    extends AbstractMap<K,V>
    implements NavigableMap<K,V>, Cloneable, java.io.Serializable
{
    // 重要属性
    
    // 外部比较器
    private final Comparator<? super K> comparator;
    
    // 树的根节点
    private transient Entry<K,V> root;
    
    // 空构造器
    public TreeMap() {
        // 如果使用空构造器，那么底层就不使用外部比较器，使用内部比较器
        comparator = null;
    }
    
    // 有参构造器：如果使用了这个进行初始化，相当于指定了外部比较器
    public TreeMap(Comparator<? super K> comparator) {
        this.comparator = comparator;
    }
    
    public V put(K key, V value) {
        // 如果放入的是第一对元素，那么t的值为null
        // 在放入第二对元素的时候，root已经是根节点了
        Entry<K,V> t = root;
        // 第一对元素会走入这个if
        if (t == null) {
            // 自我检验
            compare(key, key); // type (and possibly null) check
			// 根节点确定为root 封装了一个具体的对象
            root = new Entry<>(key, value, null);
            size = 1;
            modCount++;
            // 放置第一个元素的返回值是null
            return null;
        }
        int cmp;
        Entry<K,V> parent;
        // split comparator and comparable paths
        // 将外部比较器赋值给cpr
        Comparator<? super K> cpr = comparator;
        
        // 确定元素放左边还是放右边，还是直接赋值
        if (cpr != null) {
            // cpr不为空，有外部构造器
            do {
                parent = t;
                // 将元素的key值进行比较
                // 返回的就是int类型的数据
                cmp = cpr.compare(key, t.key);
                // 小于0 t指向左节点
                if (cmp < 0)
                    t = t.left;
                else if (cmp > 0)
                    t = t.right;
                else
                    // cmp == 0 
                    // 如果key的值一样，新的value替换老的value，但是key不变，key是唯一的
                    return t.setValue(value);
            } while (t != null);
        }
        else {
            // 使用内部比较器
            if (key == null)
                throw new NullPointerException();
            @SuppressWarnings("unchecked")
                Comparable<? super K> k = (Comparable<? super K>) key;
            do {
                parent = t;
                // 将元素的key值进行比较
                cmp = k.compareTo(t.key);
                if (cmp < 0)
                    t = t.left;
                else if (cmp > 0)
                    t = t.right;
                else
                    return t.setValue(value);
            } while (t != null);
        }
        
        // 元素封装为对象保存到对应的地方
        Entry<K,V> e = new Entry<>(key, value, parent);
        if (cmp < 0)
            parent.left = e;
        else
            parent.right = e;
        fixAfterInsertion(e);
        size++;
        modCount++;
        return null;
    }
    
    // Entry内部类
    static final class Entry<K,V> implements Map.Entry<K,V> {
        K key;
        V value;
        Entry<K,V> left;
        Entry<K,V> right;
        Entry<K,V> parent;
        boolean color = BLACK;
    }
}
```

**上面图中还缺了一个父节点的存储地址**



## TreeSet

和TreeMap类似

```java
public class TreeSet<E> extends AbstractSet<E>
    implements NavigableSet<E>, Cloneable, java.io.Serializable
{
    
    // 调用空构造器 底层创建了一个TreeMap
    public TreeSet() {
        this(new TreeMap<E,Object>());
    }
    
    // 重要属性
    private transient NavigableMap<E,Object> m;

    /**
     * Constructs a set backed by the specified navigable map.
     */
    TreeSet(NavigableMap<E,Object> m) {
        this.m = m; // m -> TreeMap
    }
    
    public boolean add(E e) {
        return m.put(e, PRESENT)==null;
    }
    
    // 存的value的值
    private static final Object PRESENT = new Object();
}
```

