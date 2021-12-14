---
title: 'Vue Cli实现Antdv图标全局使用'
date: 2021-12-14 22:37:15
# 永久链接
permalink: '/front/antdvicons'
sidebar: 'auto'
isShowComment: true
categories:
 - front
tags:
 - null
---



## 在全局使用antdv的图标组件

>   我们需要进行全局可以随时使用图标组件，而不是每次需要的时候，`import`一次，这样对于初次开发的比较麻烦。





先下载依赖包：

```bash
npm install --save @ant-design/icons-vue
```

因为图标库没啥特别大的改动，我们无需去选择一些比较适合`Vue3`的版本。





在`main.js/ts`中引入

`js`版本

```javascript
// 导入所有的图标库
import * as Icons from '@ant-design/icons-vue'

const app = createApp(App);

app.use(store).use(router).use(Antd)

// 全局使用图标
const icons: any = Icons;
for (const i in icons) {
    app.component(i, icons[i]);
}

app.mount('#app');
```

`ts`版本

```typescript
// 导入所有的图标库
import * as Icons from '@ant-design/icons-vue'

const app = createApp(App);

app.use(store).use(router).use(Antd)

// 全局使用图标
const icons: any = Icons;
for (const i in icons) {
    app.component(i, icons[i]);
}

app.mount('#app');
```

