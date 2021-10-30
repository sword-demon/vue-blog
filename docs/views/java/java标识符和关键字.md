---
title: 'java标识符和关键字'
date: 2021-10-30 14:20:15
# 永久链接
permalink: '/java/keywords/'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## 标识符

>   Java所有的组成部分都需要名字。类名、变量名以及方法名称都称之为标识符。



**关键字**

| abstract   | assert       | boolean   | break      | byte   |
| ---------- | ------------ | --------- | ---------- | ------ |
| case       | catch        | char      | class      | const  |
| continue   | default      | do        | double     | else   |
| enum       | extends      | final     | finally    | float  |
| for        | goto         | if        | implements | import |
| instanceof | int          | interface | long       | native |
| new        | package      | private   | protected  | public |
| return     | strictfp     | short     | static     | super  |
| switch     | synchronized | this      | throw      | throws |
| transient  | try          | void      | volatile   | while  |



:::warning

注意点：

-   所有的标识符都应该以字母(A-Z或者a-z)，美元符($)，或者下划线(_)开始
-   首字母之后可以是字母(A-Z或者a-z)，美元符($)，或者下划线(_)或数字的任何组合
-   **不能使用关键字作为变量名或方法名**
-   标识符是**大小写敏感**的
-   合法标识符距离：`age、$salary、_value、_1_value`

:::



:::tip

可以使用中文命名，但是一般不建议这样去使用 ，也不建议使用拼音，很Low

:::

