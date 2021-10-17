---
title: 'let和const学习'
date: 2021-10-17 16:47:15
# 永久链接
permalink: '/front/es/letandconst'
sidebar: 'auto'
isShowComment: true
categories:
 - front
tags:
 - javascript
 - es6
---



## let和const

以前使用`var`定义变量时，会出现 以下情况

```javascript
var a;
console.log(a);

a = 2;


// undefined
```

ES就提供了一个`let`

```javascript
console.log(a);

let a = 10;

// 这里会报错
```

:::danger

**Cannot access 'a' before initialization**

:::

告诉我们不能在使用之前初始化。

`let`的特点：

1.   声明变量、没有变量提升

2.   是一个块级作用域

     ```javascript
     console.log(b);
     
     if (1 === 1) {
         // 在该作用域里
         let b = 10;
     }
     
     // b is not defined
     ```

3.   不能重复声明

     >   var声明的变量可以有覆盖性
     >
     >   let声明的变量不可以重复声明

     ```javascript
     let a = 10;
     let a = 2;
     
     
     // Identifier 'a' has already been declared
     ```



---

`const`在别的语言里代表着常量，和`let`也有着相似的特点，它也确实是用来声明常量的，一旦被声明，无法修改；

**const声明的变量是不允许被修改的**



`const`声明的对象里的属性的值你可以修改，但是不能修改对象本身

```javascript
const person = {
    name: "无解"
}

person.name = "lalala";
console.log(person);
```

```json
{name: 'lalala'}
```

```javascript
// 错误示范
person = {
    age: 20
}

// Assignment to constant variable.
```



### 案例

**for循环经典案例**

```javascript
var arr = [];
for (var i = 0; i < 10; i++) {
    arr[i] = function () {
        return i; // 使用var声明的最后的i就是10
    }
}

console.log(arr); // 保存了10个函数

console.log(arr[5]()); // 调用第五个函数  结果为10
```

使用`let`和`const`来进行修改

```javascript
const arr = [];
for (let i = 0; i < 10; i++) {
    // 此时只会在当前作用域里有用
    arr[i] = function () {
        return i;
    }
}

console.log(arr); // 保存了10个函数

console.log(arr[5]()); // 调用第五个函数  使用 const和let后 结果为 5
```



**不会污染全局变量**

```javascript
let RegExp = 10;
console.log(RegExp);
console.log(window.RegExp);

```

```
输出结果

10
let和const.html:37 ƒ RegExp() { [native code] }
```



:::tip

建议：在默认情况下使用`const`，而只有在你知道变量值需要被修改的时候一定使用`let`

:::

