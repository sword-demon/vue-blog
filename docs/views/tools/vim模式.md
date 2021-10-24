---
title: 'vim模式'
date: 2021-10-24 22:08:15
# 永久链接
permalink: '/tools/vim'
sidebar: 'auto'
isShowComment: true
categories:
 - tools
tags:
 - vim
---



## vim模式

### 从普通模式到插入模式

![image-20211024220920787](/vue-blog/assets/images/image-20211024220920787.png)



回到普通模式

按快捷键

`ESC`或者`jj/CapsLock`



![image-20211024221443945](/vue-blog/assets/images/image-20211024221443945.png)



### 从普通模式到可视模式

按下`v`键

退回普通模式再按下`v`或者`ESC`



### 从普通模式到命令模式

冒号`:`

退回到普通模式：`ESC`



## 光标移动

:::tip

均是在普通模式下进行移动的

:::

![image-20211024222529881](/vue-blog/assets/images/image-20211024222529881.png)



---

以单词为单位：

![image-20211024222811537](/vue-blog/assets/images/image-20211024222811537.png)



| 0    | 跳到行首                     |
| ---- | ---------------------------- |
| ^    | 跳到从行首开始第一个非空字符 |
| $    | 跳到行尾                     |
| gg   | 跳到第一行                   |
| G    | 跳到最后有行                 |



| f{char} | 光标跳到下个{char}所在位置                 |
| ------- | ------------------------------------------ |
| F{char} | 反向移动到上一个{char}所在位置             |
| t{char} | 光标跳到下个{char}的前一个字符的位置       |
| T{char} | 光标反向移动到上个{char}的后一个字符的位置 |
| ;       | 重复上次的字符查找操作                     |
| ,       | 反向查找上次的查找命令                     |

