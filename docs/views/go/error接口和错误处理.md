---
title: 'error接口和错误处理'
date: 2022-06-13 22:01:15
# 永久链接
permalink: '/go/errorhandle'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - null
---



## error接口和错误处理

```go
f, err := os.Open("a.txt")
if err != nil {
    // 说明有错误
    fmt.Println(err)
    return
}
// 代码能执行到这里说明打开文件成功，f 是个正经文件对象，下面就可以进行读写操作
defer f.Close() // 程序退出前关闭文件
```

`error`接口类型默认零值为`nil`，所以使用`if err != nil`来判断是否有错误

如果有错误，会提示：`open a.txt: no such file or directory`，是这个接口自己定义的错误信息，会调用`err.Error()`拿到错误描述信息。



>   创建错误

我们可以根据需求自定义错误。最简单的方式是使用`errors`包提供的`New`函数创建一个错误

```go
func New(text string) error
```

```go
// 全局变量
var (
    ErrInvalidOp = errors.New("无效的操作")
)
```

如果调用`ErrInvalidOp.Error()`返回的就是我们的描述信息。



>   基于一个已有的错误包装得到一个新的`error`

使用`fmt.Errorf`搭配特殊的格式化动词`%w`就可以得到一个新的错误【包含原始的错误】

```go
fmt.Errorf("连接数据库失败, err: %w", err)
```

但是，此时又包了一点内容，我们如何判断是否等于原来的错误呢？

```go
oErr := errors.Unwrap(err) // 解包 得到原始的错误

// 拿原始的错误去进行判断
```

```go
if ok := errors.Is(err, ErrInvalidOp); ok {
    fmt.Println("是订单数据错误") 
} // 是否包含了后面的一个错误，自动去判断
```

```go
type DBError struct {
    msg string
}

func (e *DBError) Error() string {
    return e.msg
}

func ConnectDB(username, password string) error {
    if password == "123" {
        return DBError {
            msg: "弱密码",
        }
	}
}
// ---------------------------------------------------------------------

var nErr *DBError
// 判断这个错误是不是你自定义的错误，就会自动做error的类型转换
if ok := errors.As(err, &nErr); ok {
    // 这个整合了上面2个步骤
}
```

