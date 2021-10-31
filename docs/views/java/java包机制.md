---
title: 'java包机制'
date: 2021-10-31 14:43:15
# 永久链接
permalink: '/java/package/'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---

## 包机制

>   为了更好的组织类，Java提供了包机制，用于区别类名的命名空间

包语句的语法格式为

```java
package pkg1[.pkg2[.pkg3...]];
```



-   **一般利用公司域名倒置作为包名**

    ```
    www.baidu.com -> com.baidu.com
    ```

-   为了能够使用某一个包的成员，我们需要在Java程序中明确导入该包，使用`import`语句即可完成此功能

    ```java
    import package1.package2.(classname|*);
    ```

    

:::tip

这个主要用于提高编程规范

:::