---
title: 'go基本数据类型'
date: 2022-01-19 22:51:15
# 永久链接
permalink: '/go/base_type'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - null
---



<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20220119225226.png" alt="go基本数据类型" /></p>



## bool类型

布尔类型的值只可以是常量`true`或者`false`。

一个简单的例子：

```go
var gender bool = false

flag := true
```



## 数值型

### 整数型

-   int8有符号8位整型(-128-127)长度：8bit 一个字节
-   int16有符号16位整型(-32768-32767)
-   int32有符号32位整型(-214783648到214783647)
-   int64有符号63位整型(-922337203854775808到922337203854775807)
-   uint8无符号8位整型(0-255)8位都用于表示数值
-   uint16无符号16位整型(0-65535)
-   uint32无符号32位整型(0-4294967295)
-   uint64无符号63位整型(0-184457440737095)

```
有符号数 缺陷：不能表示负数
11111111 = 257
后面就把第一位拿出来代表符号位
01111111 = 127
如果第一位是负数(第一位是1)
10000001 = -1

有符号数会拿出第一位来表示正/负数，所以它的上限就会小

无符号数，第一位就会参与计算，上限就会很高
```



:::tip 相比较python为啥go有这么多int类型

`python`不管你数据库设置的字段有啥上限，都是用`int`表示

但是相对于现实来说，很多都是有上限的，比如：年龄，分数都是有上限的，这些数据就不必要去用`int16`后面的。

所以在很多场景下，数字有上限，我们可以选择合适的数据类型来降低内存的占用。



在`python`中定一个`int`变量

```bash
>>> age = 18
>>> import sys
>>> print(sys.getsizeof(age))
28
>>>
```

它就占用了**28**个字节，虽然在`python`中`int`占用字节是动态的，但是它的使用我们不用担心超过上限。

:::



>   所以对应静态类型的语言的类型选择，我们必须得先做好预期，否则到了上限就很难受。



:::tip int类型

在`go`语言中，如果定义了`int`类型的数据，它也是一个动态类型，取决于机器本身是多少位，64位的机器上运行那么`int`就是`int64`，如果是`32`位的机器上那么就是4个字节 。

使用`go`语言内置的一个方法来查看

```go
var age int = 18
fmt.Println(age)
fmt.Println(unsafe.Sizeof(age))
```

```bash
18
8 
```

我这里是8个字节。

一般情况下，我们都会指明`int`占用多少个字节

:::

### 浮点型

-   float32 32位浮点型数
-   float64 64位浮点型数



:::tip 注意

它没有`float`类型

`float32`最大值：`3.4028234663852886e+38`

`float64`最大值：`1.7976931348623157e+308`



>   为什么64位的float最大值远大于int64，float底层存储和int的存储是不一样的
>
>   float32和float64两者占用内存不一样，64位的最大数和精度都比32位高

:::



```go
var age int = 18
fmt.Println(age)
fmt.Println(unsafe.Sizeof(age))

// float 类型
var weight float64 = 71.2
fmt.Println(weight)
fmt.Println(unsafe.Sizeof(weight))
fmt.Println(math.MaxFloat32)
fmt.Println(math.MaxFloat64)
fmt.Printf("%T\n", weight)
fmt.Printf("%T\n", age)
```

```bash
18
8
71.2
8
3.4028234663852886e+38
1.7976931348623157e+308
float64
int

```



### 其他

-   byte 等于 uint8 `type byte = uint8` 实际上是`uint8`的别称
-   rune 等于 int32 `type rune = int32` 和字符处理有关
-   uint 32 或 64位 自动选择32位或者64位的



### 字符

>   字符的本质是一个数字，可以进行加减乘除

```go
b := 'b'
fmt.Println(reflect.TypeOf(b + 1))
fmt.Printf("b+1=%c", b + 1)
```

```bash
int32
b+1=c

```

:::tip 注意

1.   b + 1 可以和数字金蒜
2.   b + 1 的类型是`int32`
3.   int类型可以直接变成字符

:::