---
title: 'Set集合'
date: 2021-11-21 12:11:15
# 永久链接
permalink: '/java/set'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## Set接口

特点：

-   唯一
-   无序(这个是相对于`List`接口来说的，不等于随机)
-   没有跟索引相关的方法
-   遍历方式：
    -   迭代器
    -   增强for循环



<!-- more -->



## HashSet实现类

放入`Integer`数据

```java
package com.set;

import java.util.HashSet;

public class TestInteger {
    public static void main(String[] args) {
        // 创建一个HashSet集合
        HashSet<Integer> hs = new HashSet<>();
        hs.add(19);
        hs.add(5);
        hs.add(20);
        hs.add(12);
        hs.add(40);

        System.out.println(hs.size());

        System.out.println(hs);
    }
}

```

放入`String`数据

```java
package com.set;

import java.util.HashSet;

public class TestString {
    public static void main(String[] args) {
        HashSet<String> hs = new HashSet<>();
        hs.add("hello");
        hs.add("apple");
        hs.add("banana");
        hs.add("orange");
        hs.add("watermelon");
        System.out.println(hs.add("apple")); // false 代表没有添加进去

        System.out.println(hs);
    }
}

```

放入自定义的引用数据类型的数据

```java
package com.set;

import java.util.Objects;

public class Student {
    private int age;
    private String name;

    public Student(int age, String name) {
        this.age = age;
        this.name = name;
    }

    @Override
    public String toString() {
        return "Student{" +
                "age=" + age +
                ", name='" + name + '\'' +
                '}';
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

```



```java
package com.set;

import java.util.HashSet;

public class TestStudent {
    public static void main(String[] args) {
        HashSet<Student> hs = new HashSet<>();;
        hs.add(new Student(19, "无解"));
        hs.add(new Student(19, "亚索"));

        // 两个都放进去了
        hs.add(new Student(19, "永恩"));
        hs.add(new Student(19, "永恩"));

        System.out.println(hs.size()); // 4
        System.out.println(hs); // [Student{age=19, name='亚索'}, Student{age=19, name='永恩'}, Student{age=19, name='无解'}, Student{age=19, name='永恩'}]

    }
}

```

**自定义的类型不满足 唯一，无序的特点。**



### Hashset简要原理图

集合中存入`Integer`数据为例

![案例](https://gitee.com/wxvirus/img/raw/master/img/20211121143113.png)

1.   调用对应的`hashCode`方法计算哈希值

​	![哈希值](https://gitee.com/wxvirus/img/raw/master/img/20211121143113.png)

2.   通过哈希值和一个表达式计算在数组中存放的位置

​	![位置](https://gitee.com/wxvirus/img/raw/master/img/20211121143702.png)

底层数组：

![哈希表](https://gitee.com/wxvirus/img/raw/master/img/20211121143528.png)

底层原理：数组 + 链表 = 哈希表

:::tip

如果放入`HashSet`中的数据，一定要重写2个方法：`hashCode`、`equals`

:::



将上述`Student`类进行重写上述2个方法之后

```java
package com.set;

import java.util.Objects;

public class Student {
    private int age;
    private String name;

    public Student(int age, String name) {
        this.age = age;
        this.name = name;
    }

    @Override
    public String toString() {
        return "Student{" +
                "age=" + age +
                ", name='" + name + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Student student = (Student) o;
        return age == student.age && Objects.equals(name, student.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(age, name);
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

```

得到的结果：

```bash
3
[Student{age=19, name='永恩'}, Student{age=19, name='亚索'}, Student{age=19, name='无解'}]
```



### 疑问：

1.   数组的长度是多少
2.   数组的类型是什么
3.   `hashCode和equals`方法真的调用了吗
4.   底层的表达式是什么
5.   同一个位置的数据是向前放还是向后放
6.   放入数组中的数据是直接放吗？是否封装为对象了？



## LinkedHashSet实现类

特点：

-   唯一
-   有序(按照输入顺序进行输出)

>   就是在`HashSet`的基础上多了一个总的链表，这个总链表将放入的元素串在一起，方便有序遍历

```java
package com.set;

import java.util.LinkedHashSet;

public class TestLinkedHashSet {
    public static void main(String[] args) {
        LinkedHashSet<Integer> hs = new LinkedHashSet<>();
        hs.add(19);
        hs.add(5);
        hs.add(20);
        hs.add(12);
        hs.add(40);

        System.out.println(hs.size());

        System.out.println(hs);
    }
}

```



## 比较器的使用

**比较int类型的数据**

比较的思路：将比较的数据作差，然后返回一个`int`类型的数据，将这个`int`类型的数据按照`=0,>0,<0`来判断

```java
public class Demo01 {
    public static void main(String[] args) {
        int a = 10;
        int b = 20;

        System.out.println(a - b);
    }
}

```

----

**比较String类型的数据**

`String`实现了一个`Comparable`接口的`compareTo`方法

```java
public int compareTo(T o);
```

它是一个返回`int`类型的方法。

```java
public int compareTo(String anotherString) {
    int len1 = value.length;
    int len2 = anotherString.value.length;
    int lim = Math.min(len1, len2);
    char v1[] = value;
    char v2[] = anotherString.value;

    int k = 0;
    while (k < lim) {
        char c1 = v1[k];
        char c2 = v2[k];
        if (c1 != c2) {
            return c1 - c2;
        }
        k++;
    }
    return len1 - len2;
}
```

```java
public class Demo01 {
    public static void main(String[] args) {
        String a = "A";
        String b = "B";

        System.out.println(a.compareTo(b)); // -1
    }
}

```

---

**比较double类型的数据**

```java
public class Demo01 {
    public static void main(String[] args) {
        double a = 9.6;
        double b = 8.3;

        System.out.println(((Double) a).compareTo((Double) b));
    }
}

```

或者有IDEA提示的精简代码

```java
package com.set;

public class Demo01 {
    public static void main(String[] args) {
        double a = 9.6;
        double b = 8.3;

        System.out.println(Double.compare(a, b));
    }
}

```

---

**比较自定义的数据类型**

```java
import java.util.Objects;

public class Student implements Comparable<Student> {
    private int age;
    private String name;

    public Student(int age, String name) {
        this.age = age;
        this.name = name;
    }

    @Override
    public String toString() {
        return "Student{" +
                "age=" + age +
                ", name='" + name + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Student student = (Student) o;
        return age == student.age && Objects.equals(name, student.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(age, name);
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public int compareTo(Student o) {
        // 比较学生的年龄差
        return this.getAge() - o.getAge();
    }
}

```

```java
public class Demo02 {
    public static void main(String[] args) {
        // 比较两个学生
        Student s1 = new Student(10, "john");
        Student s2 = new Student(14, "david");

        System.out.println(s1.compareTo(s2));
    }
}

```



### 外部比较器

```java
class CompareStudentAge implements Comparator<Student> {

    @Override
    public int compare(Student o1, Student o2) {
        // 比较年龄
        return o1.getAge() - o2.getAge();
    }
}

class CompareStudentName implements Comparator<Student> {

    @Override
    public int compare(Student o1, Student o2) {
        // 比较年龄
        return o1.getName().compareTo(o2.getName());
    }
}
```

```java
import java.util.Comparator;

public class Demo02 {
    public static void main(String[] args) {
        // 比较两个学生
        Student s1 = new Student(10, "john");
        Student s2 = new Student(14, "david");

        // 外部比较器使用
        Comparator<Student> compareStudentAge = new CompareStudentAge();
        System.out.println(compareStudentAge.compare(s1, s2));

        // 比较姓名
        Comparator<Student> compareStudentName = new CompareStudentAge();
        System.out.println(compareStudentName.compare(s1, s2));
    }
}

```

:::tip

推荐使用外部比较器，因为它使用了多态，扩展性比较好

:::



## TreeSet实现类

**存入Integer类型数据：(底层用的是内部比较器)**

```java
package com.set;

import java.util.TreeSet;

public class Demo03 {
    public static void main(String[] args) {
        TreeSet<Integer> ts = new TreeSet<>();
        ts.add(12);
        ts.add(3);
        ts.add(7);
        ts.add(9);
        ts.add(3);
        ts.add(16);

        System.out.println(ts.size());
        System.out.println(ts);
    }
}

```

特点：

-   唯一
-   无序(没有按照输入顺序进行输出)
-   有序(按照升序进行遍历)

---

原理：底层：**二叉树(数据结构中的逻辑结构)**

物理结构：跳转结构

![二叉树](https://gitee.com/wxvirus/img/raw/master/img/20211121170435.png)

>   在树中放入数据的时候，最重要的事就是比较
>
>   左边放比较小的数，右边放比较大的数；且两个叉；

**TreeSet在进行遍历的时候得到的是升序的结果**

:::tip

二叉树的遍历：

1.   中序遍历：左 根 右   `当前二叉树使用的遍历方式`
2.   先序遍历：根 左 右
3.   后序遍历：左 右 根

:::



---

**`String`类型数据比较**

```java
package com.set;

import java.util.TreeSet;

public class Demo03 {
    public static void main(String[] args) {
        TreeSet<String> ts = new TreeSet<>();

        ts.add("el");
        ts.add("bl");
        ts.add("al");
        ts.add("ll");
        ts.add("el");
        ts.add("cl");
        ts.add("fl");
        ts.add("gl");

        System.out.println(ts.size());
        System.out.println(ts);
    }
}

```

```bash
7
[al, bl, cl, el, fl, gl, ll]
```

**底层也是实现类内部比较器**

----

**自定义的数据类型比较**

```java
import java.util.TreeSet;

public class Demo03 {
    public static void main(String[] args) {
        TreeSet<Student> ts = new TreeSet<>();

        ts.add(new Student(10, "el"));
        ts.add(new Student(8, "bl"));
        ts.add(new Student(4, "al"));
        ts.add(new Student(9, "cl"));
        ts.add(new Student(10, "el"));
        ts.add(new Student(1, "dl"));
        ts.add(new Student(12, "fl"));
        
        // 这里添加的数据和年龄有关

        System.out.println(ts.size());
        System.out.println(ts);
    }
}

```

内部比较器

```java
public class Student implements Comparable<Student> {
    private int age;
    private String name;

    public Student(int age, String name) {
        this.age = age;
        this.name = name;
    }

    @Override
    public String toString() {
        return "Student{" +
                "age=" + age +
                ", name='" + name + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Student student = (Student) o;
        return age == student.age && Objects.equals(name, student.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(age, name);
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public int compareTo(Student o) {
        return this.getAge() - o.getAge();
    }
}
```

外部比较器

```java
class CompareStudentAge implements Comparator<Student> {

    @Override
    public int compare(Student o1, Student o2) {
        // 比较年龄
        return o1.getAge() - o2.getAge();
    }
}

class CompareStudentName implements Comparator<Student> {

    @Override
    public int compare(Student o1, Student o2) {
        // 比较年龄
        return o1.getName().compareTo(o2.getName());
    }
}
```

```java
import java.util.Comparator;
import java.util.TreeSet;

public class Demo03 {
    public static void main(String[] args) {

        // 利用外部比较器
        Comparator<Student> com = new CompareStudentName();
        // 一旦指定外部比较器，就会按照外部比较器来比较
        TreeSet<Student> ts = new TreeSet<>(com);

        ts.add(new Student(10, "el"));
        ts.add(new Student(8, "bl"));
        ts.add(new Student(4, "al"));
        ts.add(new Student(9, "cl"));
        ts.add(new Student(10, "el"));
        ts.add(new Student(1, "dl"));
        ts.add(new Student(12, "fl"));

        System.out.println(ts.size());
        System.out.println(ts);
    }
}

```

**实际开发中，利用外部比较器比较多，因为扩展性好(多态)**

---

**匿名内部类实现**

```java
import java.util.Comparator;
import java.util.TreeSet;

public class Demo03 {
    public static void main(String[] args) {
        // 利用外部比较器
        Comparator<Student> com = new Comparator<Student>() {
            @Override
            public int compare(Student o1, Student o2) {
                return o1.getName().compareTo(o2.getName());
            }
        };
        TreeSet<Student> ts = new TreeSet<>(com);
        // 一旦指定外部比较器，就会按照外部比较器来比较

        ts.add(new Student(10, "el"));
        ts.add(new Student(8, "bl"));
        ts.add(new Student(4, "al"));
        ts.add(new Student(9, "cl"));
        ts.add(new Student(10, "el"));
        ts.add(new Student(1, "dl"));
        ts.add(new Student(12, "fl"));

        System.out.println(ts.size());
        System.out.println(ts);
    }
}

```



:::tip

底层原理：**实现内部比较器或外部比较器，所以向`TreeSet`中放入的数据的时候，自定义的类必须实现比较器**

:::



