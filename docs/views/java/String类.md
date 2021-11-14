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



### 其他常用方法

```java
// 字符串的截取
String s8 = "asdsadadas";
System.out.println(s8.substring(3));
System.out.println(s8.substring(3, 6)); // [3, 6) 左闭右开

// 字符串拼接/合并
System.out.println(s8.concat("php"));

// 将所有 'a' 替换为 'u' 返回一个新的字符串
System.out.println(s1.replace('a', 'u'));

// 按照指定的字符串进行字符串分隔
String s9 = "a-b-c-d-e";
String[] strs = s9.split("-");
System.out.println(Arrays.toString(strs));

// 转大写
System.out.println(s9.toUpperCase());
// 转小写
System.out.println(s9.toLowerCase());

String s10 = "   a   ab dadas   ";
// 去除首尾空格
System.out.println(s10.trim());

// 转换为String类型
System.out.println(String.valueOf(false));
```



## String内存分析

### 1. 字符串拼接

```java
package com.str;

public class Test02 {
    public static void main(String[] args) {
        String s1 = "a" + "b" + "c";
        String s2 = "ab" + "c";
        String s3 = "a" + "bc";
        String s4 = "abc";
        String s5 = "abc" + "";
    }
}

```

**上面的字符串，会进行编译期优化，直接合并为完整的字符串，我们可以查看字节码进行验证：**

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package com.str;

public class Test02 {
    public Test02() {
    }

    public static void main(String[] args) {
        String s1 = "abc";
        String s2 = "abc";
        String s3 = "abc";
        String s4 = "abc";
        String s5 = "abc";
    }
}

```

**然后再常量池中，常量池的特点是第一次如果没有这个字符串，就放进去，如果有这个字符串吗，后面就都直接从常量池里取**

![上述内存分析](https://gitee.com/wxvirus/img/raw/master/img/20211112213111.png)



### 2. new关键字创建对象

```java
String s6 = new String("abc");
```

**内存分析：开辟两个空间(1. 字符串常量池中的字符串  2.堆中创建的对象)**

![上述内存分析](https://gitee.com/wxvirus/img/raw/master/img/20211112215604.png)



### 3. 有变量参与的字符串拼接

```java
package com.str;

public class Test03 {
    public static void main(String[] args) {
        String a = "abc";
        String b = a + "def";
        System.out.println(b);
    }
}

```

**a变量在编译的时候，不知道a是字符串"abc"，所以不会进行编译期优化，不会直接合并为"abcdef"**

**反汇编过程：为了更好的分析字节码文件是如何进行解析的。**

-   利用控制台打开字节码文件所在的地址在终端显示
-   输入：`javap -c Test03.class`



```bash
Compiled from "Test03.java"
public class com.str.Test03 {
  public com.str.Test03();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: ldc           #7                  // String abc
       2: astore_1
       3: aload_1
       4: invokedynamic #9,  0              // InvokeDynamic #0:makeConcatWithConstants:(Ljava/lang/String;)Ljava/lang/String;
       9: astore_2
      10: getstatic     #13                 // Field java/lang/System.out:Ljava/io/PrintStream;
      13: aload_2
      14: invokevirtual #19                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      17: return
}

```

>   虽然我现在看不懂哈。。。

-   invokedynamic：关键特征：检查的主题的过程是在运行期而不是编译期



下面的内容翻译的是人家的，简单分析一下：

-   ldc 将常量池中的String入栈
-   astore_1 将栈顶ref对象保存至局部变量1
-   aload_1 将局部变量1入栈
-   invokedynamic动态调用
-   astore 保存最终的值到一个位置
-   。。。
-   return 返回

---

JDK1.8反编译的内容

```bash
Compiled from "Test03.java"
public class com.str.Test03 {
  public com.str.Test03();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: ldc           #2                  // String abc
       2: astore_1
       3: new           #3                  // class java/lang/StringBuilder
       6: dup
       7: invokespecial #4                  // Method java/lang/StringBuilder."<init>":()V
      10: aload_1
      11: invokevirtual #5                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      14: ldc           #6                  // String def
      16: invokevirtual #5                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
      19: invokevirtual #7                  // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
      22: astore_2
      23: getstatic     #8                  // Field java/lang/System.out:Ljava/io/PrintStream;
      26: aload_2
      27: invokevirtual #9                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      30: return
}

```

**jdk8对字符串拼接的操作，虚拟机使用的是`StringBuilder`进行的优化**



## 字符串的分类

1.   不可变字符串：`String`
2.   可变字符串：`StringBuilder`、`StringBuffer`



