---
title: 'vscode生成自己的代码片段'
date: 2021-11-01 20:31:15
# 永久链接
permalink: '/tools/codetemplate'
sidebar: 'auto'
isShowComment: true
categories:
 - tools
tags:
 - null
---



## 设置vue快速生成data

```json
{
    "vue data": {
        "prefix": "vdata",
        "body": ["data() {", "    return {", "        $1: $2", "    }", "}"],
        "description": "生成vue data"
    }
}
```

到了代码里就可以直接输入 `vdata`，会有一下效果：

```js
const app = Vue.createApp({
    data() {
        return {
             : 
        }
    },
})
```

光标会停留在冒号前面，按下`tab`之后光标会移动到冒号后面让你输入`value`值。