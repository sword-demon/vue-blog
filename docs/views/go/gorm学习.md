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

[官网链接](https://gorm.io/zh_CN/docs/index.html)

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



<!-- more -->



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



CRUD简单案例

```go
package main

import (
	"fmt"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

type UserTable struct {
	ID     uint
	Name   string
	Gender string
	Hobby  string
}

func main() {

	db, err := gorm.Open("mysql", "root:root@(127.0.0.1:3306)/db1?charset=utf8mb4&parseTime=True&loc=Local")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	// 创建表、自动迁移:把结构体和数据表进行对应
	db.AutoMigrate(&UserTable{})

	// 创建数据行
	u1 := UserTable{1, "无解", "男", "乒乓球"}
	db.Create(u1)

	// 查询数据
	var u UserTable
	db.First(&u) // 把查询的对象保存到u里，要传指针  查询表中第一条数据
	fmt.Printf("u:%#v\n", u)

	// 更新
	db.Model(&u).Update("hobby", "双色球")

	// 删除
	db.Delete(&u)
}
```



## Model模型定义

`gorm`内置了一个`gorm.Model`结构体。是包含了一个`ID、CreatedAt、UpdatedAt、DeletedAt`四个字段的结构体。

```go
// gorm.Model
type Model struct {
  ID uint `gorm:"primary_key"`
  CreatedAt time.Time
  UpdatedAt time.Time
  DeletedAt time.Time
}
```

嵌入到自己的模型中

```go
// 将它的四个字段注入到 User 模型中
type User struct {
  gorm.Model
  Name string
}
```



```go
// User 定义模型
type User struct {
	gorm.Model
	Name         string
	Age          sql.NullInt64
	Birthday     *time.Time
	Email        string  `gorm:"type:varchar(100);unique_index"`
	Role         string  `gorm:"size:255"`
	MemberNumber *string `gorm:"unique;not null"` // 设置会员号 唯一且不为空
	Num          int     `gorm:"AUTH_INCREMENT"`  // 设置自增
	Address      string  `gorm:"index:addr"`      // 设置名为addr的索引
	IgnoreMe     int     `gorm:"-"`               // 忽略本字段
}
```



### 主键约定

GORM默认会使用名为ID的字段作为表的主键

```go
type User struct {
  ID string
  Name string
}

// 使用别的名称作为主键
type Admin struct {
  AdminID int64 `gorm:"primary_key"`
  Name string
  Age int64
}
```



### 表名

表名默认就是结构体名称的负数

驼峰转换为`_`进行连接且单词首字母小写

```go
// 生成的表为 users
type User struct {
  ID string
  Name string
}

// 将User的表名设置为 `profiles`
func (User) TableName() string {
  return "profiles"
}

// 生成的表为 user_tables
type UserTable struct {
	ID     uint
	Name   string
	Gender string
	Hobby  string
}


// 禁用默认表名的复数形式，设置为true，则没有复数
db.SingularTable(true)
```

也可以通过`Table()`指定表名

```go
// 使用UserTable结构体创建一个名叫 wujie 的表
db.Table("wujie").CreateTable(&UserTable{})
```

还支持更改默认表名称的规则：

加一个表前缀

```go
// 表名规则修改
	gorm.DefaultTableNameHandler = func (db *gorm.DB, defaultTableName string) string {
		return "prefix_" + defaultTableName
	}
```



## GORM使用创建记录

```go
// 生成的表为 users
type User struct {
  Name string `gorm:"default:'无解'"`
  Age int
}

func main() {
  db, err := gorm.Open("mysql", "root:root@(127.0.0.1:3306)/db1?charset=utf8mb4&parseTime=True&loc=Local")
	if err != nil {
		panic(err)
	}
	defer db.Close()
  // 创建表
  db.AutoMigrate(&User{})
}
```

使用标签创建表的默认值

此时创建的表语句的name字段就有一个默认值属性`default = '无解'`



添加记录

```go
user := User{Age: 99, Name: ""}
fmt.Println(db.NewRecord(&user)) // 判断主键是否为空 true
db.Debug().Create(&user) // 在每个操作前加上 Debug方法会输出对应的SQL语句
fmt.Println(db.NewRecord(&user)) // false
```

```sql
insert into users("age") values (99);
```

如果对Name字段使用零值传入，此时的代码实际执行的SQL语句如上所述，它会排除零值字段Name，而在数据库中会使用设置的默认值`无解`作为Name字段的值。



:::danger

**注意：所有字段的零值，比如`0，"",false`或者它的零值，都不会保存到数据库内，的那会使用他们的默认值。如果想避免这种情况，可以考虑使用指针或实现`Scanner/Valuer`接口。**

:::



**使用指针的方式将零值存入数据库**

```go
// 使用指针
type User struct {
  Name *string `gorm:"default:'无解'"`
  Age int
}

user := User{Age: 99, Name: new(string)}
db.Create(&user) // 此时数据库中该条记录name的字段的值就是 ''
```



**使用Scanner/Valuer**

```go
// 使用 Scanner/Valuer
type User struct {
  Name sql.NullString `gorm:"default:'无解'"`
  Age int
}

user := User{Name: sql.NullString{"", true}, Age: 18}
db.Create(&user) // 此时数据库中该条记录name的字段的值就是 ''
```

`sql.NullString`实现了`Scanner/Valuer`的接口



### 扩展创建选项

例如`PostgreSQL`数据库中可以使用下面的方式实现合并插入，有则更新，无则插入

```go
// 为 Insert 语句添加扩展SQL选项
db.Set("gorm:insert_option", "ON CONFLICT").Create(&product)

// insert into products (name, code) values ("name", "code") ON CONFILICT;
```

就是MySQL中类似`replace into`的方式进行更新



## GORM查询操作

:::tip

大部分还是借鉴，基本还是去看 GORM的官网的文档去了解。

:::

下面直接转自：https://www.liwenzhou.com/posts/Go/gorm_crud/

### 一般查询

```go
// 根据主键查询第一条记录
db.First(&user)
//// SELECT * FROM users ORDER BY id LIMIT 1;

// 随机获取一条记录
db.Take(&user)
//// SELECT * FROM users LIMIT 1;

// 根据主键查询最后一条记录
db.Last(&user)
//// SELECT * FROM users ORDER BY id DESC LIMIT 1;

// 查询所有的记录
db.Find(&users)
//// SELECT * FROM users;

// 查询指定的某条记录(仅当主键为整型时可用)
db.First(&user, 10)
//// SELECT * FROM users WHERE id = 10;
```



### where条件

:::details 普通SQL查询

```go
// Get first matched record
db.Where("name = ?", "jinzhu").First(&user)
//// SELECT * FROM users WHERE name = 'jinzhu' limit 1;

// Get all matched records
db.Where("name = ?", "jinzhu").Find(&users)
//// SELECT * FROM users WHERE name = 'jinzhu';

// <>
db.Where("name <> ?", "jinzhu").Find(&users)
//// SELECT * FROM users WHERE name <> 'jinzhu';

// IN
db.Where("name IN (?)", []string{"jinzhu", "jinzhu 2"}).Find(&users)
//// SELECT * FROM users WHERE name in ('jinzhu','jinzhu 2');

// LIKE
db.Where("name LIKE ?", "%jin%").Find(&users)
//// SELECT * FROM users WHERE name LIKE '%jin%';

// AND
db.Where("name = ? AND age >= ?", "jinzhu", "22").Find(&users)
//// SELECT * FROM users WHERE name = 'jinzhu' AND age >= 22;

// Time
db.Where("updated_at > ?", lastWeek).Find(&users)
//// SELECT * FROM users WHERE updated_at > '2000-01-01 00:00:00';

// BETWEEN
db.Where("created_at BETWEEN ? AND ?", lastWeek, today).Find(&users)
//// SELECT * FROM users WHERE created_at BETWEEN '2000-01-01 00:00:00' AND '2000-01-08 00:00:00';
St
```

:::



### Struct & Map查询

```go
// Struct
db.Where(&User{Name: "jinzhu", Age: 20}).First(&user)
//// SELECT * FROM users WHERE name = "jinzhu" AND age = 20 LIMIT 1;

// Map
db.Where(map[string]interface{}{"name": "jinzhu", "age": 20}).Find(&users)
//// SELECT * FROM users WHERE name = "jinzhu" AND age = 20;

// 主键的切片
db.Where([]int64{20, 21, 22}).Find(&users)
//// SELECT * FROM users WHERE id IN (20, 21, 22);
```



### 其他还是去看官方文档吧



