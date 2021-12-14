---
title: 'Vue Cli多环境配置'
date: 2021-12-14 22:26:15
# 永久链接
permalink: '/front/vueclienv'
sidebar: 'auto'
isShowComment: true
categories:
 - front
tags:
 - null
---



## 前言

>   `Vue`项目我们最终都会有一个上线的过程，而且有的正规的公司会有测试环境和生产环境，我们需要分别配置一些启动参数。





<!-- more -->



## 配置环境参数

在项目根目录下新建`.env.dev`和`.env.prod`分别用于表示测试环境和生产环境的配置文件

`.env.dev`

```txt
NODE_ENV=development
VUE_APP_SERVER=http://127.0.0.1:8880
```

`.env.prod`

```txt
NODE_ENV=production
VUE_APP_SERVER=http://127.0.0.1:8880
```



## 配置启动命令

`package.json`

>   这个我只选取了主要的部分

```json
"scripts": {
    "serve-dev": "vue-cli-service serve --mode dev",
    "serve-prod": "vue-cli-service serve --mode prod",
    "build-dev": "vue-cli-service build --mode dev",
    "build-prod": "vue-cli-service build --mode prod",
    "lint": "vue-cli-service lint"
},
```

:::tip 如何更改端口

`Vue Cli`启动时默认的端口为：`8080`，我们如果遇到端口冲突或者需要更改端口的时候，该如何设置呢？

```json
{
    "serve-dev": "vue-cli-service serve --mode dev --port 8081"
}
```

只需在启动命令参数后面加上`--port 端口号`即可

:::



## 验证环境

我们在项目的`main.js/ts`文件中添加代码，且在`amount`前

```tsx
console.log('环境: ', process.env.NODE_ENV);
```

我们重新启动项目，并去控制台查看，输出内容，此时内容为：`development`，即成功。