---
title: 'gorm学习'
date: 2021-09-29 22:12:15
# 永久链接
permalink: '/go/gin/gorm'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - gorm
 - gin
---



## gorm学习

https://gorm.io/zh_CN/docs/index.html

ORM => Object Relational Mapping  对象关系型映射

这里的gorm是go语言里的一个ORM的框架，基本支持主流的数据库



O：对象，这里在go语言指的是结构体实例

R：关系，就是对应的关系型数据库，例如MySQL

M：进行映射，一一对应，结构体对应表，结构体实例对应一行记录，结构体里的字段对应表字段



案例：

```go
type UserInfo struct {
  ID uint
  Name string
  Gender string
  Hobby string
}

func main() {
  u1 := UserInfo{1, "wujie", "男", "乒乓球"}
  orm.Create(&u1) // orm.Save(&u1) ORM语言，它可能会翻译成下面的SQL语句进行执行
}
```

对应SQL语句

```sql
insert into userinfo values(1, "wujie", "男", "乒乓球");
```



## 优缺点

优点：

提高开发效率



缺点：

牺牲执行性能，有一个ORM向SQL语句转换的过程

牺牲灵活性

弱化SQL能力，ORM用多了，SQL语句就会慢慢忘记



## 安装

```bash
go get -u gorm.io/gorm
go get -u gorm.io/driver/sqlite # sqlite 的驱动
go get -u gorm.io/driver/mysql # mysql 的驱动
```

go1.17往后使用`go install`



## 连接MySQL

```go
import (
  "gorm.io/driver/mysql"
  "gorm.io/gorm"
)

func main() {
  // 参考 https://github.com/go-sql-driver/mysql#dsn-data-source-name 获取详情
  dsn := "user:pass@tcp(127.0.0.1:3306)/dbname?charset=utf8mb4&parseTime=True&loc=Local"
  db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
}
```

有的时候导入的时候驱动前面需要加上下划线，只是用到了它内部的一些初始化方法。

