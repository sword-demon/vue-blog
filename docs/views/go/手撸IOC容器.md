---
title: '手撸IOC容器'
date: 2022-04-12 09:10:15
# 永久链接
permalink: '/go/ioc'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - null
---



## 控制反转基本代码

-   在项目对性能要求高，那么在运行时要尽可能的避免反射
-   如果追求业务的封装和维护（譬如做项目后台）则无妨



来一个案例

`services/UserService.go`

```go
package services

import "fmt"

type UserService struct {
	
}

func NewUserService() *UserService {
	return &UserService{}
}

func (this *UserService) GetUserInfo(uid int)  {
	fmt.Println("用户id=", uid)
}
```



`services/OrderService.go`

```go
package services

import "fmt"

type OrderService struct {
	
}

func NewOrderService() *OrderService {
	return &OrderService{}
}

func (this *OrderService) GetOrderInfo(uid int)  {
	fmt.Println("获取用户id=",uid,"的订单信息")
}

```



`main.go`

```go
package main

import "ioc/services"

func main() {
	uid := 123
	services.NewUserService().GetUserInfo(uid)

	services.NewOrderService().GetOrderInfo(uid)
}

```



```bash
➜ go run main.go        
用户id= 123
获取用户id= 123 的订单信息

```



在`go`语言写代码不一定要和`java`一样，要进行类的嵌套。如果此时需要把获取用户订单的方法放到`UserSerivce`里。

```go
package services

import "fmt"

type UserService struct {
	
}

func NewUserService() *UserService {
	return &UserService{}
}

func (this *UserService) GetUserInfo(uid int)  {
	fmt.Println("用户id=", uid)
}

func (this *UserService) GetOrderInfo(uid int)  {
	NewOrderService().GetOrderInfo(uid)
}
```

```go
package main

import "ioc/services"

func main() {
	uid := 123
	userService := services.NewUserService()
	userService.GetUserInfo(uid)
	userService.GetOrderInfo(uid)
}

```

这种情况是我们的程序去主动初始化所谓的依赖，主动也就称之为：”正转“





此时我们在来调整一个”反转“

```go
package services

import "fmt"

type UserService struct {
	order *OrderService
}

func NewUserService(order *OrderService) *UserService {
	return &UserService{order: order}
}

func (this *UserService) GetUserInfo(uid int)  {
	fmt.Println("用户id=", uid)
}

func (this *UserService) GetOrderInfo(uid int)  {
	this.order.GetOrderInfo(uid)
}
```

```go
package main

import "ioc/services"

func main() {
	uid := 123
	userService := services.NewUserService(services.NewOrderService())
	userService.GetUserInfo(uid)
	userService.GetOrderInfo(uid)
}

```

这里我们需要被动的传入一个订单服务的依赖，所以就就是反转。但是这里我们只有一个依赖需要传入，如果后面我们又很多依赖需要传入，这样写就会很麻烦，所以就需要有一个东西来帮我们统一创建，它就是`IOC`容器。



## 设计IOC容器初步雏形：基于类型的存储

在`orderService`里加了一个版本用于标识输出

```go
package services

import "fmt"

type OrderService struct {
	Version string
}

func NewOrderService() *OrderService {
	return &OrderService{Version: "1.0"}
}

func (this *OrderService) GetOrderInfo(uid int)  {
	fmt.Println("获取用户id=",uid,"的订单信息")
}

```

`Injector/BeanFactory.go`

```go
package Injector

var BeanFactory *BeanFactoryImpl

func init() {
	BeanFactory = NewBeanFactoryImpl()
}

type BeanFactoryImpl struct {
	beanMapper BeanMapper
}

func (this *BeanFactoryImpl) Set(vList ...interface{})  {
	if vList == nil || len(vList) == 0 {
		return
	}
	for _, v := range vList {
		this.beanMapper.add(v)
	}
}

func (this *BeanFactoryImpl) Get(v interface{}) interface{} {
	if v == nil{
		return nil
	}
	get_v := this.beanMapper.get(v)
	if get_v.IsValid() {
		return get_v.Interface()
	}
	return nil
}

func NewBeanFactoryImpl() *BeanFactoryImpl {
	return &BeanFactoryImpl{beanMapper:make(BeanMapper)}
}

```

`Injector/BeanMapper.go`

```go
package Injector

import "reflect"

type BeanMapper map[reflect.Type]reflect.Value

func (this BeanMapper) add(bean interface{}) {
	t := reflect.TypeOf(bean)
	if t.Kind() != reflect.Ptr {
		panic("bean must be a pointer")
	}
	this[t] = reflect.ValueOf(bean)
}

func (this BeanMapper) get(bean interface{}) reflect.Value {
	t := reflect.TypeOf(bean)
	if v, ok := this[t]; ok {
		return v
	}
	return reflect.Value{}
}

```



测试

```go
package main

import (
	"fmt"
	. "ioc/Injector"
	"ioc/services"
)

func main() {
	BeanFactory.Set(services.NewOrderService())
	order := BeanFactory.Get((*services.OrderService)(nil))
	fmt.Println(order)
}

```

```bash
➜ go run main.go  
&{1.0}

```

如果是

```go
BeanFactory.Set(&services.OrderService{})
```

那么就会输出`nil`，因为此时的里面的`Version`是空值



## 处理依赖注入

我们会在结构体里加上`tag`，可以让反射获取到对应的内容

```go
type UserService struct {
	Order *OrderService `inject:"-"`
}

func NewUserService() *UserService {
	return &UserService{}
}
```

这里我们约定`-`来表示注入，后面可能还有别的`json:""`啥的



这里的获取对象需要调整一下

```go
func (this BeanMapper) get(bean interface{}) reflect.Value {
	//t := reflect.TypeOf(bean)
	var t reflect.Type
	if bt, ok := bean.(reflect.Type); ok {
		t = bt
	} else {
		t = reflect.TypeOf(bean)
	}
	if v, ok := this[t]; ok {
		return v
	}
	return reflect.Value{}
}
```

`BeanFactory`添加依赖处理函数

```go
// Apply 处理依赖注入
func (this *BeanFactoryImpl) Apply(bean interface{}) {
	if bean == nil {
		return
	}
	// 反射
	v := reflect.ValueOf(bean)
	if v.Kind() == reflect.Ptr {
		// 代表是指针类型
		v = v.Elem()
	}
	// 判断是否是一个结构体
	if v.Kind() != reflect.Struct {
		return
	}
	for i := 0; i < v.NumField(); i++ {
		field := v.Type().Field(i)
		// 获取tag的属性值
		// 还得判断属性是否首字母大写
		if v.Field(i).CanSet() && field.Tag.Get("inject") != "" {
			if get_v := this.Get(field.Type); get_v != nil {
				v.Field(i).Set(reflect.ValueOf(get_v))
			}
		}
	}
}
```

测试

```go
package main

import (
	"fmt"
	. "ioc/Injector"
	"ioc/services"
)

func main() {

	BeanFactory.Set(services.NewOrderService())

	userService := services.NewUserService()
	BeanFactory.Apply(userService)
	fmt.Println(userService.Order)
}

```

