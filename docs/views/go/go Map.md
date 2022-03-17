---
title: 'go Map'
date: 2022-03-17 23:10:15
# 永久链接
permalink: '/go/map'
sidebar: 'auto'
isShowComment: true
categories:
 - go
tags:
 - null
---



## 定义

存储一个KV模式的数据类型

```go
map[K]V
map[K1]map[K2]V
```

案例：

```go
m := map[string]string {
		"name": "wujie",
		"course": "golang",
		"site": "wjstar",
		"quality": "notbad",
	}

m2 := make(map[string]int) // empty map

var m3 map[string]int // nil

fmt.Println(m, m2, m3)
```

```bash
map[course:golang name:wujie quality:notbad site:wjstar] map[] map[]
```



## 遍历操作

```go
func map1() {
	m := map[string]string {
		"name": "wujie",
		"course": "golang",
		"site": "wjstar",
		"quality": "notbad",
	}

	fmt.Println("Traversing map")

	for k, v := range m {
		fmt.Println(k, v)
	}
}
```

```bash
Traversing map
name wujie
course golang
site wjstar
quality notbad

```

这里的`k`也可以使用`_`进行省略

```go
for _, v := range m {
    fmt.Println(v)
}
```

几次运行下来，可以发现一个问题：

>   有时候键”name“是在前面的，有时候键”quality“是在前面的。

这说明了一个这个`k` 在`map`里是无序的，而且底层是`HashMap`



## 获取map的值

```go
func map1() {
	m := map[string]string {
		"name": "wujie",
		"course": "golang",
		"site": "wjstar",
		"quality": "notbad",
	}

	fmt.Println("Getting value")
    // 存在的key
	courseName := m["course"]
	fmt.Println(courseName)
    // 不存在的key
	causeName := m["cause"]
	fmt.Println(causeName)
}
```

这里我们测试了一个不存在的`k`去获取值，此时会得到一个空的字符串，虽然在控制台打印看不出啥，但是正符合了`go`语言定义的一个总归会有一个`Zero value`提供使用。

但是我们如何进行判断这个`k`是否存在呢？

```go
fmt.Println("Getting value")
courseName, ok := m["course"]
fmt.Println(courseName, ok)
if causeName, ok := m["cause"]; ok {
    fmt.Println(causeName)
} else {
    fmt.Println("key does not exist")
}
```

```bash
golang true
key does not exist

```



## 删除元素

```go
fmt.Println("deleting values")
name, ok := m["name"]
fmt.Println(name, ok)

delete(m, "name")

name, ok = m["name"]
fmt.Println(name, ok)
```

```bash
wujie true
 false

```



## Map的Key

-   `map`使用了哈希表，必须可以比较相等
-   除了`slice,map,function`的内奸类型都可以作为`key`
-   `Struct`类型不包含上述字段，也可以作为`key`，在编译的时候会进行检查



## 实例

>   寻找最长不含有重复字符的子串

从`abcabcbb` -> `abc`

从`bbbbb` -> `b`

从`pwwkew` -> `wke`



思路步骤：

对于每一个字母`x`

-   `lastOccurred[x]`不存在，或者`< start` 则无需操作
-   `lastOccurred[x] >= start`，则更新`start`的位置
-   更新`lastOccurred[x]`，更新`maxLength`

```go
func lengthOfNnRepeatingSubStr(s string) int {
	lastOccurred := make(map[byte]int)
	start := 0
	maxLength := 0
	for i, ch := range []byte(s) {
        // 避免ch为0的情况
		lastI, ok := lastOccurred[ch]
		if ok && lastI >= start {
			// 更新 start
			start = lastI + 1
		}
		if i-start+1 > maxLength {
			maxLength = i - start + 1
		}
		lastOccurred[ch] = i
	}
	return maxLength
}

func map2() {
	fmt.Println(lengthOfNnRepeatingSubStr("abcabcbb")) // 3
	fmt.Println(lengthOfNnRepeatingSubStr("bbbbbbb")) // 1
	fmt.Println(lengthOfNnRepeatingSubStr("pwwkew")) // 3
	fmt.Println(lengthOfNnRepeatingSubStr("")) // 0
	fmt.Println(lengthOfNnRepeatingSubStr("b")) // 1
	fmt.Println(lengthOfNnRepeatingSubStr("abcdef")) // 6
}

func main() {
	map2()
}
```

```go
fmt.Println(lengthOfNnRepeatingSubStr("这里是中文"))
fmt.Println(lengthOfNnRepeatingSubStr("一二三二一"))
```

假如这里使用了中文，这里就不对了，因为这里是使用的`byte`类型，必须转换为`ascii`。



## 操作总结

-   创建：`make(map[string]int)`
-   获取元素：`m[k]`
-   `key`不存在时，获得`value`类型的初始值
-   用`value, ok := m[key]`来判断是否存在`key`
-   使用`range`遍历`key`或者遍历`key value`对
-   遍历不保证顺序，如果需要顺序，需手动对`key`排序
-   使用`len`获得元素个数