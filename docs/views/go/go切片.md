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

