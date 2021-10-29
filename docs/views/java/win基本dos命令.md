---
title: 'win基本dos命令'
date: 2021-10-29 21:15:15
# 永久链接
permalink: '/java/dos'
sidebar: 'auto'
isShowComment: true
categories:
 - java
tags:
 - dos
---



## 打开CMD的方式

1.   开始 + 系统 + 命令提示符
2.   Win键 + R 输入cmd打开控制台(推荐使用)
3.   在任意的文件夹下，按住`shift + 鼠标右键点击`，点击在此处打开命令，会出现`powershell`的窗口
4.   在任意文件夹的地址栏，前面输入`cmd + 空格 + 路径`也可以打开控制台
5.   右键选择以管理员方式运行



## 常用的dos命令

```bash
# 盘符切换

D:
# 直接输入盘加上冒号

# 查看当前目录下的所有文件
dir
# 对照linux里的是 -> ls

# 切换目录
cd (change director) 加上目录的具体位置
cd /d f: # 直接从别的盘进入到f盘 跨盘符
cd .. # 表示返回上一级

# 清理屏幕
cls(clear screen)

# 退出终端
exit

# 查看电脑的ip
ipconfig

# 打开计算器
calc

# 打开画图工具
mspaint

# 打开记事本
notepad

# ping命令
ping www.baidu.com

# 创建文件夹
md test

# 新建文件
a.txt -> linux: touch a.txt

# 删除文件
del a.txt

# 删除文件夹
rd test

# 输出java版本
java --version
```

