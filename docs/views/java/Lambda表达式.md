---
title: 'Lambda表达式'
date: 2022-01-17 22:05:15
# 永久链接
permalink: '/java/lambda'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## 简介

>   Lambda是一个匿名函数，我们可以把Lambda表达式理解为是一段可以传递的代码(将代码像数据一样进行传递)。可以写出更简洁、更灵活的代码。作为一种更紧凑的代码风格，使Java语言表达能力得到了提升。



## 匿名内部类

一个比较器

```java
// 匿名内部类
public void test1() {
    Comparator<Integer> com = new Comparator<Integer>() {
        @Override
        public int compare(Integer o1, Integer o2) {
            // 有用的代码就这一句
            return Integer.compare(o1, o2);
        }
    };

    TreeSet<Integer> ts = new TreeSet<>(com);
}
```

其实有用的就一个比较的代码。使用Lambda表达式来简写

```java
public void test2() {
    Comparator<Integer> com = (x, y) -> Integer.compare(x, y);
    TreeSet<Integer> ts = new TreeSet<>(com);
}
```



## 演进

>   需求：获取员工工资大于5000的员工信息

我们先建立一个实体类

```java
package com.wx.java8;

public class Employee {
    private String name;
    private int age;
    private double salary;

    public Employee(String name, int age, double salary) {
        this.name = name;
        this.age = age;
        this.salary = salary;
    }

    public Employee() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", salary=" + salary +
                '}';
    }
}

```

然后造一个员工集合

```java
List<Employee> employeeList = Arrays.asList(
            new Employee("张三", 18, 999.99),
            new Employee("李四", 36, 21321),
            new Employee("王五", 39, 33333.33),
            new Employee("赵六", 29, 7777.77)
    );
```



### 第一种：遍历的角度

```java
public List<Employee> filterEmployee(List<Employee> list) {
    // 遍历角度来获取
    List<Employee> emps = new ArrayList<>();
    for (Employee employee : list) {
        if (employee.getSalary() > 5000) {
            emps.add(employee);
        }
    }
    return emps;
}
```



### 第二种：接口形式

```java
public interface MyPredicate<T> {
    public boolean test(T t);
}
```

实现一个判断的方法

```java
public class FilterEmployeeBySalary implements MyPredicate<Employee> {

    @Override
    public boolean test(Employee employee) {
        return employee.getSalary() > 5000;
    }
}
```

然后在进行遍历的时候使用这个方法进行判断，代替上述遍历的判断一步

```java
public List<Employee> filterEmployee2(List<Employee> list, MyPredicate<Employee> myPredicate) {
    List<Employee> emps = new ArrayList<>();

    for (Employee employee : list) {
        if (myPredicate.test(employee)) {
            emps.add(employee);
        }
    }
    return emps;
}
```



### 第三种：使用匿名内部类来实现接口

上面使用额外的类来实现接口，如果判断越来越多，类也会越来越多，维护也比较麻烦，所以使用匿名内部类来实现。

```java
public void test5() {
    List<Employee> employees = filterEmployee2(employeeList, new MyPredicate<Employee>() {
        @Override
        public boolean test(Employee employee) {
            // 最后还是绕到这里，有用的就这一句，但是代码量很多，可读性降低了
            return employee.getSalary() > 5000;
        }
    });

    for (Employee employee : employees) {
        System.out.println(employee);
    }
}
```



### 第四种：使用lambda表达式来简化代码

```java
public void test6() {
    List<Employee> employees = filterEmployee2(employeeList, (e) -> e.getSalary() <= 5000);
    // 打印遍历结果
    employees.forEach(System.out::println);
}
```



### 第五种：使用`Stream API`

```java
public void test7() {
    employeeList.stream().filter((e) -> e.getSalary() > 5000).forEach(System.out::println);
}
```

