---
title: 'java项目MySQL8.0配置'
date: 2021-11-07 19:42:15
# 永久链接
permalink: '/java/mysql/settings'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - null
---



## MySQL8.0配置

### `pom.xml`的配置

```xml
<dependency>
	<groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8/0.12</version>
</dependency>
```



### jdbc驱动类的配置

```yaml
driver-class-name: com.mysql.cj.jdbc.Driver
```



### 数据库时区的配置

```sql
# 查看系统设置的时区
show variables like '%time_zone%';
```

```sql
set GLOBALE time_zone = '+8:00'; # 东八区要加8小时
```





## MySQL索引-B树和B+树

### B树

B树是一种多路平衡查找树，B是平衡的意思，即`Balance`，`m`阶(m >= 2)的B树有以下特征：

1.   树中的每个节点最多有m个子节点
2.   除了根节点和叶子节点之外，其他每个节点至少有`m/2`个子节点
3.   所有的叶子节点都在同一层
4.   节点中关键字的顺序按照升序排列



### B+树

B+树是B树的一个变体，同样是多路平衡查找树，它与B树主要的不同是

1.   非叶子节点不存储数据，只存储索引
2.   叶子节点包含了全部的关键字信息，且叶子节点按照关键字顺序相互连接



## MySQL索引-聚簇索引

>   每个`InnoDB`的表都拥有一个索引 ，称之为`聚簇索引`，此索引中存储着`行记录`，一般来说，聚簇索引是根据`主键`生成的。



**聚簇索引的创建规则**

| 条件                                   | 规则                                         |
| -------------------------------------- | -------------------------------------------- |
| 显示的定义了主键                       | InnoDB会利用主键来生成其聚簇索引             |
| 没有定义主键                           | InnoDB会选择一个非空的唯一索引来创建聚簇索引 |
| 没有定义主键且所有列都不满足主键的条件 | InnoDB会隐式的创建一个自增的列来作为聚簇索引 |

:::tip

-   对于选择唯一索引的顺序是按照定义唯一索引的顺序，而非表中列的顺序
-   选中的唯一索引字段会充当为主键，或者InnoDB隐式创建的自增列也可以看做主键

:::

