---
title: 'Laravel用户认证脚手架的安装过程'
date: 2022-02-27 15:41:15
# 永久链接
permalink: '/php/laravel-auth'
sidebar: 'auto'
isShowComment: true
categories:
 - php
tags:
 - null
---



## Laravel用户认证脚手架的安装过程

1.   引入`ui`包：`composer require laravel/ui`

2.   `php artisan ui bootstrap --auth`，安装`bootstrap`相关的样式，如果安装之后看到是有`popper`和`jquery`引用的，那就还是`bootstrap4`，如果没有那就是`boostrap5`

3.   通过`npm`下载依赖：`npm install`

4.   如果发现有`error`，那就根据终端提示，需要下载什么内容就继续下载，比如我这里提示要下载一个东西：` npm install resolve-url-loader@^5.0.0 --save-dev --legacy-peer-deps`

5.   安装完之后使用`npm run dev`来编译

     ![编译成功](https://gitee.com/wxvirus/img/raw/master/img/20220227154631.png)

​	如果出现上述内容，即代表运行成功

6.   现在可以查看一下和原先的目录对比，多了哪些文件，而且页面现在打开会多了一个用户认证的相关的功能。



## bootstrap4升级到5

把`bootstrap4`升级到5版本：

1.   打开`resource/js/bootstrap.js`将关于4版本的依赖`jquery`和`popper`这两行代码删掉
2.   打开`package.json`，将`bootstrap4`改为5的版本的信息，删掉`jquery`和`popper`的配置信息，运行`npm run install`
3.   重新运行`npm run dev`



>   但是现在，基本下载就是5的版本。