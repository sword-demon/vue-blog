---
title: 'php解释器工作流程'
date: 2022-03-31 21:10:15
# 永久链接
permalink: '/php/explain'
sidebar: 'auto'
isShowComment: true
categories:
 - php
tags:
 - null
---



## PHP解释器的工作大概流程

```bash
php demo1.php
```

前面说了，我们的`php`解释器文件是`ELF`可执行文件



1.   Linux内核调用`execve`函数，会把`demo1.php`作为命令参数传入
2.   使用解释器去读取脚本文件，脚本文件是`ascii text`文本文件
3.   运行完之后就会调用`exit_group?(exit_status)`来进程终止状态



可以使用`size`命令来查看`ELF`文件程序指令，程序数据所占空间的大小

可以使用`strace -f -s65500 php demo1.php `来查看执行的过程



```bash
# 第一行
execve("/usr/bin/php", ["php", "demo1.php"], 0x7fffad2331e8 /* 25 vars */) = 0

# 下面加载了一些其他的第三方库

# 下面部分

open("demo1.php", O_RDONLY)             = 3
getcwd("/data/work/php/process", 4096)  = 23

mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) = 0x7efc8f74e000
# 解释运行
read(3, "<?php\n\necho \"hello world\";", 4096) = 26
close(3)                                = 0
munmap(0x7efc8f74e000, 4096)            = 0
# 打印内容 io 函数 没有缓冲区 向终端打印
write(1, "hello world", 11hello world)             = 11
# 退出 关闭标准输入
close(0)                                = 0
# 共享内存的释放
munmap(0x7efc80fb3000, 2176600)         = 0
munmap(0x7efc80d9a000, 2196680)         = 0
munmap(0x7efc8f637000, 192512)          = 0
munmap(0x7efc80b99000, 2097248)         = 0
munmap(0x7efc82aa6000, 4284872)         = 0
munmap(0x7efc82834000, 2560784)         = 0
munmap(0x7efc823d1000, 4596616)         = 0
munmap(0x7efc82184000, 2410688)         = 0
munmap(0x7efc81e9b000, 3050080)         = 0
munmap(0x7efc81c97000, 2109928)         = 0
munmap(0x7efc81a64000, 2302680)         = 0
munmap(0x7efc81854000, 2160296)         = 0
munmap(0x7efc81650000, 2109720)         = 0
munmap(0x7efc81429000, 2255216)         = 0
munmap(0x7efc811c7000, 2494984)         = 0
munmap(0x7efc8f6b7000, 196608)          = 0
munmap(0x7efc89400000, 2097152)         = 0
munmap(0x7efc8f596000, 659456)          = 0
munmap(0x7efc8f710000, 135168)          = 0
# 退出函数 退出状态码
exit_group(0)                           = ?
```



![PHP解释执行过程](https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/4021/20220331215143.png)



