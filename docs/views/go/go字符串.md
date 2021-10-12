---
title: 'go字符串'
date: 2021-10-12 23:40:15
# 永久链接
permalink: '/go/string'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - string
---



## 字符串

>   整点实操类型的吧。go语言里的字符串都是以`utf8`的编码形式存在的。



**定义很长一串字符串的方式：**

```go
var toolongstring = `
dwqdqwqwbalabdqwdqwd
dqwdqw
dqwd
qwd
qw
`
```

可以使用反引号进行输出换行的一个很长的一个字符串



**字符串为中文的一些处理：**

```go
fmt.Println("hello" + "无解")
```

遍历上述字符串

```go
var strings = "hello, i am 无解"

// 使用len方法获取字符串的长度
stringLen := len(strings)

for index := 0; index < stringLen; index++ {
    fmt.Printf("%s--编码值=%d,值=%c\n", strings, strings[index], strings[index])
}
```

**有中文时，输出就会出现乱码**

使用另一种遍历的方式进行遍历，别的语言里称谓`foreach`

```go
for _, value := range strings {
    fmt.Printf("%s--编码值=%d,值=%c\n", strings, value, value)
}
```

:::tip

此时的`value`其实是`rune`类型，是`int32`类型

:::

