---
title: 'String类'
date: 2021-11-11 22:45:15
# 永久链接
permalink: '/java/String'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## 特性

1.   直接使用，无需导包

     ```java
     package java.lang;
     ```

2.   形象上来说，是一堆字符组成的串

3.   字符串是字面常量

     ```java
     String str = "abc"; // "abc" 就是String类下的一个具体的对象
     ```

4.   字符串是不可变的(后面有可变的字符串)

     ```txt
     String is constant
     ```

5.   `String`类没有子类，无法被继承，它被`final`进行修饰

6.   `String`类底层原先是是一个`char`类型的数组

     ```java
     private final char value[];
     ```

     最新的JDK里好像是`byte`类型的数组

     ```java
     /**
          * The value is used for character storage.
          *
          * @implNote This field is trusted by the VM, and is a subject to
          * constant folding if String instance is constant. Overwriting this
          * field after construction will cause problems.
          *
          * Additionally, it is marked with {@link Stable} to trust the contents
          * of the array. No other facility in JDK provides this functionality (yet).
          * {@link Stable} is safe here, because value is never null.
          */
         @Stable
         private final byte[] value;
     ```

     验证：

     ![字符串验证](https://gitee.com/wxvirus/img/raw/master/img/20211111225318.png)



## 常用方法

### 构造器

```java
// 通过构造器创建对象
String s1 = new String();
String s2 = new String("ABC");
char[] c1 = {'a', 'b', 'c'};
String s3 = new String(c1);
```

>   实际就是给对象底层的`value`数组进行赋值操作



### 长度，判空，字符位置

```java
String s4 = "abc";
System.out.println("字符串的长度为: " + s4.length());

String s5 = new String("abc");
System.out.println("s5是否为空: " + s5.isEmpty()); // false 本质上是看底层value数组的长度是否为0

System.out.println(s5.charAt(1)); // 获取下标对应的字符 -> 就是value数组的索引对应的字符
```



### `equals`源码

```java
public boolean equals(Object anObject) {
    if (this == anObject) {
        return true;
    }
    // 判断对象是否是属于字符串的实例
    if (anObject instanceof String) {
        String aString = (String)anObject;
        if (!COMPACT_STRINGS || this.coder == aString.coder) {
            return StringLatin1.equals(value, aString.value);
        }
    }
    return false;
}
```

```java
@HotSpotIntrinsicCandidate
    public static boolean equals(byte[] value, byte[] other) {
        if (value.length == other.length) {
            for (int i = 0; i < value.length; i++) {
                if (value[i] != other[i]) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
```

```java
String s4 = "abc";
String s5 = new String("abc");
System.out.println(s5.equals(s4)); // true
```

前面画过了一个内存分析的图，字符串定义的变量，会在常量池里有一个对应的地址指向该对象，而同一个字符串的指向都是一样的，所以这2个对象的内存地址都是一样的。

所以：

-   当两个对象的地址是一样的时候`this == anObject`返回`true`
-   当自己跟自己比对的时候，直接返回`true`

最终判断的依据：

1.   判断两个对象的底层的`value`数组的长度是否一致
2.   对两个底层数组进行遍历，按位遍历，只要不一样，直接返回`false`



### `compareTo`

`String`类实现了`Comparable`，里面有一个抽象方法叫`compareTo`，所以`String`类要进行重写。

```java
public int compareTo(String anotherString) {
    byte v1[] = value;
    byte v2[] = anotherString.value;
    byte coder = coder();
    if (coder == anotherString.coder()) {
        return coder == LATIN1 ? StringLatin1.compareTo(v1, v2)
            : StringUTF16.compareTo(v1, v2);
    }
    return coder == LATIN1 ? StringLatin1.compareToUTF16(v1, v2)
        : StringUTF16.compareToLatin1(v1, v2);
}
```

```java
@HotSpotIntrinsicCandidate
public static int compareTo(byte[] value, byte[] other) {
    int len1 = value.length;
    int len2 = other.length;
    return compareTo(value, other, len1, len2);
}

public static int compareTo(byte[] value, byte[] other, int len1, int len2) {
    // lim 指的是两个比较的里面长度较短的值
    int lim = Math.min(len1, len2);
    for (int k = 0; k < lim; k++) {
        if (value[k] != other[k]) {
            return getChar(value, k) - getChar(other, k);
        }
    }
    return len1 - len2;
}

public static char getChar(byte[] val, int index) {
    return (char)(val[index] & 0xff);
}
```

案例：

```java
"abc"
"abccdef"
返回结果是短的和长的之间的一个长度的差值
```

```java
"abc"
"accdef"
返回的是不一样的那个位置的ASCII的差值 -> 这个就是b和c的ASCII的差值
```

![debug分析](https://gitee.com/wxvirus/img/raw/master/img/20211111233342.png)

