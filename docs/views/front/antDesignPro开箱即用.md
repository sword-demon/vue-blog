---
title: 'antDesignPro开箱即用'
date: 2022-03-19 11:35:15
# 永久链接
permalink: '/front/antdv'
sidebar: 'auto'
isShowComment: true
categories:
 - front
tags:
 - null
---



## 使用antDesignPro来快速开发管理系统

[官网文档地址](https://pro.ant.design/zh-CN/docs/getting-started)



到文档地址的，初始化部分进行开箱即用

我们选择`ant-design-pro`、`typescript`、`simple`进行创建项目即可。



如果出现啥`node`版本不适配的，去`nodejs`官网下载更新，然后再重新使用初始化项目的相关命令。



### 安装依赖

使用`webstorm`或者`vscode`打开项目，出现一大片红，即代表项目依赖没有安装，我们需要进行安装依赖，

打开终端：

```bash
yarn

# or
yarn install

#or 
npm install
```

`yarn`是怎么知道我们要安装什么依赖的？

>   有一个`package.json`文件中的`dependencies`内容，会识别他们进行下载。



### 运行项目

>   我们如何允许项目呢？

在`package.json`文件中有一个`scripts`内容，写了很多各种运行的方式

```json
"scripts": {
    "analyze": "cross-env ANALYZE=1 umi build",
    "build": "umi build",
    "deploy": "npm run build && npm run gh-pages",
    "dev": "npm run start:dev",
    "gh-pages": "gh-pages -d dist",
    "i18n-remove": "pro i18n-remove --locale=zh-CN --write",
    "postinstall": "umi g tmp",
    "lint": "umi g tmp && npm run lint:js && npm run lint:style && npm run lint:prettier && npm run tsc",
    "lint-staged": "lint-staged",
    "lint-staged:js": "eslint --ext .js,.jsx,.ts,.tsx ",
    "lint:fix": "eslint --fix --cache --ext .js,.jsx,.ts,.tsx --format=pretty ./src && npm run lint:style",
    "lint:js": "eslint --cache --ext .js,.jsx,.ts,.tsx --format=pretty ./src",
    "lint:prettier": "prettier -c --write \"src/**/*\" --end-of-line auto",
    "lint:style": "stylelint --fix \"src/**/*.less\" --syntax less",
    "openapi": "umi openapi",
    "playwright": "playwright install && playwright test",
    "precommit": "lint-staged",
    "prettier": "prettier -c --write \"src/**/*\"",
    "serve": "umi-serve",
    "start": "cross-env UMI_ENV=dev umi dev",
    "start:dev": "cross-env REACT_APP_ENV=dev MOCK=none UMI_ENV=dev umi dev",
    "start:no-mock": "cross-env MOCK=none UMI_ENV=dev umi dev",
    "start:no-ui": "cross-env UMI_UI=none UMI_ENV=dev umi dev",
    "start:pre": "cross-env REACT_APP_ENV=pre UMI_ENV=dev umi dev",
    "start:test": "cross-env REACT_APP_ENV=test MOCK=none UMI_ENV=dev umi dev",
    "test": "umi test",
    "test:component": "umi test ./src/components",
    "test:e2e": "node ./tests/run-tests.js",
    "tsc": "tsc --noEmit"
  },
```

我们通过`webstorm`点击`scripts`的`start`进行运行即可。然后就开始相关的编译内容。最终会有一个编译完成的链接，我们点击即可。

![项目内容](https://gitee.com/wxvirus/img/raw/master/img/20220319114620.png)



### 安装`umi ui`工具

```bash
yarn add @umijs/preset-ui -D
```

可以帮助我们快速开发。

![安装完之后右下角内容](https://gitee.com/wxvirus/img/raw/master/img/20220319115114.png)

安装完之后，右下角会出现这个图标，可以帮我们快速生成代码。



我们可以点击模板页，进行添加页面模板

![选择模板内容进行添加](https://gitee.com/wxvirus/img/raw/master/img/20220319115450.png)

这个是一个漫长的等待的过程。机器再好，也得等它编译完。



上述主要过程，就是

```bash
git pull 一个远程的写好的代码
然后安装，编译
```

