---
title: 'MySQL事务隔离级别'
date: 2021-11-28 19:47:15
# 永久链接
permalink: '/note/transcation/level'
sidebar: 'auto'
isShowComment: true
categories:
 - note
tags:
 - MySQL
---





## 事务的隔离级别

>   事务的隔离级别取决于如何控制并发用户读写数据的操作。数据库是运行多用户并发访问的，如果多个用户同时开启事务，并对同一数据进行读写操作的话，有可能会出现脏读、不可重复读和幻读的问题，所以MySQL中提供了四种隔离级别来解决上述问题。

:::tip

事务的隔离级别从低到高依次为：

-   READ UNCOMMITTED
-   READ COMMITTED
-   REPEATABLE READ
-   SERIALIAZBLE

隔离级别越低，越能支持高并发的数据库操作

:::



|     隔离级别     | 脏读 | 不可重复读 | 幻读 |
| :--------------: | :--: | :--------: | :--: |
| READ UNCOMMITTED |  ✔️   |     ✔️      |  ✔️   |
|  READ COMMITTED  |  ×   |     ✔️      |  ✔️   |
| REPEATABLE READ  |  ×   |     ×      |  ✔️   |
|   SERIALIAZBLE   |  ×   |     ×      |  ×   |

-   <span style="color: red;font-size: 22px;">×</span>代表不会出问题 = 解决问题
-   <span style="color: green;">✔️</span>代表会出问题



:::tip

>   一般使用`REPEATABLE READ`这比较多，且数据库的默认隔离级别是它。

:::



**查看默认的事务隔离级别**

```sql
# 查看默认的事务隔离级别
select @@transaction_isolation;

# 设置事务的隔离级别(加上session是设置当前会话的隔离级别)
set session transaction isolation level read uncommitted;
set session transaction isolation level read committed;
set session transaction isolation level repeatable read;
set session transaction isolation level serializable;
```



### 模拟脏读

进程1：`navicat`客户端操作数据库

```sql
# 第一步
start transaction;

# 第三步
select * from account where id = 1; # 查询id=1的余额 当前余额 100

# 第五步
select * from account where id = 1; # 再次查询id=1的余额  现在 200
```



进程2：`cmd`或`terminal`操作数据库

```sql
# 第二步
start transaction;

# 第四步
update account set balance = balance + 100 where id = 1; # id=1的余额加100

# 第六步
rollback; # 事务回滚 ，修改的操作没用

# 第七步
select * from account where id = 1; # 100
```



设置事务隔离级别为`read committed`

再进行一次流程。

这次从`cmd/shell/terminal/zsh`进行操作的修改的后一步，`navicat`查询的时候，不会查询到`+100`的之后的结果。

如果`cmd`进程进行提交`commit`，则`navicat`客户端再次查询就会变成`+100`之后的结果。