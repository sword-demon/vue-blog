---
title: 'jpa方法命名规则'
date: '2021-10-15 23:34:00'
sidebar: 'auto'
permalink: '/java/jparule'
categories:
 - java
tags:
 - spring
 - jpa
publish: true
---



## Sprint data jpa 方法命名规则

| 关键字             | 方法命名                       | sql where语句                |
| ------------------ | ------------------------------ | ---------------------------- |
| AND                | findByNameAndPwd               | where name = ? and pwd = ?   |
| Or                 | findByNameOrSex                | where name = ? or sex = ?    |
| Is, Equals         | findById, findByEquals         | where id = ?                 |
| Between            | findByIdBetween                | where id between ? and ?     |
| LessThan           | findByIdLessThan               | where id < ?                 |
| LessThanEquals     | findByIdLessThanEquals         | where id <= ?                |
| GreaterThan        | findByIdGreaterThan            | where id > ?                 |
| GreaterThanEquals  | findByIdGreaterThanEquals      | where id >= ?                |
| After              | findByIdAfter                  | where id > ?                 |
| Before             | findIdBefore                   | where id < ?                 |
| IsNull             | findByNameIsNull               | where name is null           |
| IsNotNull, NotNull | findByNameNotNull              | where name is not null       |
| Like               | findByNameLike                 | where name like ?            |
| NotLike            | findByNameNotLike              | where name not like ?        |
| StartingWith       | findByNameStartingWith         | where name like '?%'         |
| EndingWith         | findByNameEndingWith           | where name like '%?'         |
| Containing         | findByNameContaining           | whre name like '%?%'         |
| OrderBy            | findByIdOrderByXDesc           | where id = ? order by x desc |
| Not                | findByNameNot                  | where name <> ?              |
| In                 | findByIdIn(Collection<?> c)    | where id in (?)              |
| NotIn              | findByIdNotIn(Collection<?> c) | where id not in (?)          |
| TRUE               | findByAaaTrue                  | where aaa = true             |
| FALSE              | findByAaaFalse                 | where aaa = false            |
| IgnoreCase         | findByNameIgnoreCase           | where UPPER(name)=UPPER(?)   |

