---
title: 'go切片'
date: 2022-01-30 21:52:15
# 永久链接
permalink: '/go/slice'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - null
---



## go切片

>   go语言一般不使用数组，一般使用的是切片。

案例：

```go
arr := [...]int{0, 1, 2, 3, 4, 5, 6, 7}

s := arr[2:6]
```

**在计算机中，一般区间是左闭右开，所以s的值是2到5**



几种冒号的位置

```go
fmt.Println("arr[2:6]: ", arr[2:6])
fmt.Println("arr[:6]: ", arr[:6])
fmt.Println("arr[2:]: ", arr[2:])
fmt.Println("arr[:]: ", arr[:])
```

```bash
arr[2:6]:  [2 3 4 5]
arr[:6]:  [0 1 2 3 4 5]
arr[2:]:  [2 3 4 5 6 7]
arr[:]:  [0 1 2 3 4 5 6 7]

```

**`Slice`就不是一个值类型，Slice是对Array的一个视图**

```go
func updateSlice(s []int)  {
	s[0] = 100
}
```

当我们的切片经过上述函数之后，原本的结构也会进行变化

```go
s1 := arr[2:]
fmt.Println("s1: ", arr[2:])
//s2 := arr[:]
//fmt.Println("s2: ", arr[:])

fmt.Println("update slice s1")
updateSlice(s1)
fmt.Println(s1)
fmt.Println(arr)
```

```bash
s1:  [2 3 4 5 6 7]
update slice s1
[100 3 4 5 6 7]
[0 1 100 3 4 5 6 7]

```

-   Slice本身是没有数据的，是对底层数组的一个`view`



### reslice

```go
fmt.Println("Reslice")
s2 = s2[:5]
s2 = s2[2:]
```

每次下标都是针对自己的切片。



## Slice的扩展

```go
arr := [...]int{0, 1, 2, 3, 4, 5, 6, 7}
s1 := arr[2:6]
s2 := s1[3:5]
```

>   想想一下这边`s1的值是多少？`,`s2的值是多少`或者`s2`取不取的到值？

打印一下：

```go
fmt.Println("Extending Slice")
s1 := arr[2:6]
s2 := s1[3:5] // [s1[3], s1[4]]

fmt.Println(s1)
fmt.Println(s2)
```

```bash
Extending Slice
[2 3 4 5]
[5 6]

```

此时：`s1`为[2 3 4 5]可以理解，但是`s2 = [5 6]`就很难理解，因为6都不在`s1`里。

但是此时又能打印出来，所以即`s2`取的值为`s1[3]和s1[4]`，但是我们打印`s1[4]`却报错。



解析：

![底层解析](https://gitee.com/wxvirus/img/raw/master/img/20220130215030.png)



引申出，切片还有一个容量的属性，所以我们取`s1[4]`会报越界错误，因为我们长度已经到不了，但是容量可以。

![容量](https://gitee.com/wxvirus/img/raw/master/img/20220130221735.png)



-   `s1`的值为`[2 3 4 5]`，`s2`的值为`[5 6]`
-   `slice`可以向后扩展，不可以向前扩展，`s2`再怎么看，也只能看到2，所以只能向后扩展
-   `s[i]`不可以超越`len(s)`，向后扩展不可以超过底层数组`cap(s)`

```go
fmt.Println("Extending Slice")
s1 := arr[2:6]
s2 := s1[3:5] // [s1[3], s1[4]]
fmt.Printf("s1=%v, len(s1)=%d, cap(s1)=%d\n", s1, len(s1), cap(s1))
fmt.Printf("s2=%v, len(s2)=%d, cap(s2)=%d\n", s2, len(s2), cap(s2))
//fmt.Println(s1[4])
// slice 是对 arr 的一个 view
fmt.Println(s1)
fmt.Println(s2)
```

```bash
Extending Slice
s1=[2 3 4 5], len(s1)=4, cap(s1)=6
s2=[5 6], len(s2)=2, cap(s2)=3
[2 3 4 5]
[5 6]

```



## 切片元素操作

```go
func slice5() {
	s1 := []int{2, 4, 6, 8}
	s2 := make([]int, 16)
	// 拷贝切片
	copy(s2, s1)
	printSlice(s2)

	fmt.Println("deleting element from slice")
	s2 = append(s2[:3], s2[4:]...)
	printSlice(s2)

	// 删除头尾
	fmt.Println("Popping from front")
	front := s2[0]
	s2 = s2[1:]
	fmt.Println(front)
	printSlice(s2)

	fmt.Println("Popping from tail")
	tail := s2[len(s2)-1]
	s2 = s2[:len(s2)-1]
	fmt.Println(tail)
	printSlice(s2)
}

func main() {
	slice5()
}
```



## 判断切片是否为空

>   要检查切片是否为空，请使用`len(s) == 0`来判断，而不应该使用`s == nil`来判断。

```go
// 如果使用的是0去初始化，那么它就不是nil了，但是它的长度还是0
s := make([]int, 0)
```



## 字面量初始化

```go
s := []int{1, 2, 3}
fmt.Println(s) // [1, 2, 3]
```

即直接使用后面花括号的形式给值。





## 切片的赋值拷贝

下面演示了拷贝前后2个变量共享底层数组，对一个切片的修改会影响另一个切片的内容，这点需要特别注意。

```go
func main() {
    s1 := make([]int, 3) // [0, 0, 0]
    s2 := s1 // 将s1的直接赋值给s2，s1和s2共享一个底层数组
    s2[0] = 100
    fmt.Println(s1) // [100, 0, 0]
    fmt.Println(s2) // [100, 0, 0]
}
```

那如果改`s1`会不会影响`s2`

```go
func main() {
    s1 := make([]int, 3) // [0, 0, 0]
    s2 := s1 // 将s1的直接赋值给s2，s1和s2共享一个底层数组
    s1[0] = 100
    fmt.Println(s1) // [100, 0, 0]
    fmt.Println(s2) // [100, 0, 0]
}
```

其实还是一样的。因为改的都是底层数组的值。



但是，如果我们不想影响别的切片怎么办，我们就需要使用到`copy`拷贝函数

```go
func main() {
	a := []int{1, 2, 3}
	var b = make([]int, len(a))
	fmt.Println(len(b), cap(b))
	// 把切片a的值拷贝到切片b中
	copy(b, a)
	b[1] = 200
	fmt.Println(a)
	fmt.Println(b)
}
```

:::tip 注意

拷贝的时候，需要先指定好被拷贝的对象的容量和长度，一定要比拷贝的要大，否则报错。如果直接`b := make([]int, 0)`这个底层数组就没有空间，就无法将拷贝的值进行赋值。



通常使用目标切片的长度进行初始化：`var b = make([]int, len(a))`

:::



## 从切片中删除元素

>   Go语言中没有删除切片元素的专用方法，我们可以使用切片本身的特性来删除元素。

```go
func main() {
	a := []int{1, 2, 3}
	// 要删除索引为2的元素
	a = append(a[:2], a[3:]...)
	fmt.Println(a)
}
```

:::tip 总结

>   要从切片a中删除索引为`index`的元素，操作方法是`a = append(a[:index], a[index + 1:]...)`



!!!

使用`append`函数一定要有变量接收

:::





## 练习

写出下面的代码的输出结果

```go
func main() {
	var a = make([]string, 5, 10)
	for i := 0; i < 10; i++ {
		a = append(a, fmt.Sprintf("%v", i))
	}

	fmt.Println(a, len(a), cap(a))
}
```

>   [     0 1 2 3 4 5 6 7 8 9] 15 20

-   初始化的时候有5个空的字符串
-   继续往后追加字符串类型的`0-9`,触发扩容
-   长度变为15，容量不确定，经过验证为20，底层扩容机制，5+10>5，就会触发双倍扩容，如果5+5不大于10，就不会触发扩容，容量还是10，

```go
func main() {
	var a = make([]string, 5, 10)
	for i := 0; i < 10; i++ {
		_ = append(a, fmt.Sprintf("%v", i))
	}

	fmt.Println(a, len(a), cap(a))
}
```

如果换成`_`来接收，则`a`切片不会发生变化。

