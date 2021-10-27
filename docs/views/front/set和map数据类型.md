---
title: 'Set和Map数据类型'
date: 2021-10-28 00:01:15
# 永久链接
permalink: '/front/es/extendobj'
sidebar: 'auto'
isShowComment: true
categories:
 - front
tags:
 - javascript
 - es6
---



## 集合Set

>   表示无重复值的有序列表

```js
// 集合：表示无重复值的有序列表
let set = new Set()
console.log(set) // Set(0) {}

// 添加元素
set.add(2)
console.log(set) // Set(1) {2}

set.add('4')
set.add('4') // 添加第二个字符串4，它不会给你添加上

set.add([1, 2, 3])

// 删除
set.delete(2) // 直接删除第一项

set.has('4') // 校验某个值是否在集合中

console.log(set.size) // 获取集合的长度

set.forEach((val, key) => {
    console.log(val)
    console.log(key)
})

// 将集合转换为数组
let set2 = new Set([1, 2, 3, 3, 4])
console.log(set2) // 不会有多余的3 进行显示
// 扩展运算符
let arr = [...set2]
console.log(arr)

// 1. set中对象的引用无法被释放
let set3 = new Set(),
    obj = {}
set3.add(obj)
obj = null // 释放当前的资源
console.log(set3)

let set4 = new WeakSet(),
    obj3 = {}
set4.add(obj3)
console.log(set4)
// 1. 添加元素的时候不能传入非对象类型的参数
// 2. 不可迭代
// 3. 没有forEach方法
// 4. 没有size属性
```



## Map

>   Map是键值对有序的列表，键和值是任意类型

```js
let map = new Map()
map.set('name', '张三')
map.set('age', 20)
console.log(map)
console.log(map.get('age')) // 获取值 可以再proto里看到它有的方法

console.log(map.has('name')) // true
map.delete('name')

map.clear() // 清除
console.log(map)

map.set([1, 2, 3], 'hello world')

// 不易读
let m = new Map([
    ['a', 1],
    ['c', 2],
])
console.log(m)
```

