---
title: '集成富文本插件wangeditor'
date: 2021-12-25 17:11:15
permalink: '/front/wangeditor'
sidebar: 'auto'
isShowComment: true
categories:
- front
tags:
- null
---



## 集成富文本插件wangeditor

官网：[wangeditor](https://www.wangeditor.com/)



在`Vue3`项目中安装

```bash
npm i wangeditor --save
```

安装后几行代码即可创建一个编辑器

```vue
import E from 'wangeditor'
const editor = new E("#div1")
editor.create()
```



我们在页面中添加表单内容

```vue
<a-modal
      title="文档表单"
      v-model:visible="modalVisible"
      :confirm-loading="modalLoading"
      @ok="handleModalOk">
    <a-form :modal="doc" :label-col="{span: 6}">
      <a-form-item label="名称">
        <a-input v-model:value="doc.name"/>
      </a-form-item>
      <a-form-item label="父文档">
        <!-- replaceFields 替换 treeNode 中 title,value,key,children 字段为 treeData 中对应的字段 -->
        <a-tree-select
            v-model:value="doc.parent"
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="treeSelectData"
            placeholder="请选择父文档"
            tree-default-expand-all
            :replaceFields="{title: 'name', key: 'id', value: 'id'}"
        >
        </a-tree-select>
      </a-form-item>
      <a-form-item label="排序">
        <a-input v-model:value="doc.sort"/>
      </a-form-item>
      <a-form-item label="内容">
        <div id="content"></div>	<!-- 这一块div放富文本内容 -->
      </a-form-item>
    </a-form>
  </a-modal>
```



我们在`setup()`中进行定义

```vue
import E from 'wangeditor'
const editor = new E("#div1")
editor.create()
```

:::warning 页面并没有显示

这里我们一开始是写在了一个`Modal`里。

1.   我们认为不显示的原因是在`setup()`里，`create()`方法没有执行到，所以将`editor.create()`放到`onMounted`里，但是还是没有显示。
2.   其次，我们把`<div id="content"></div>`移除出模态框进行显示，看看是否能够显示出来，这一次是显示出来了，于是我们又将`create`方法放进`setup`里，看看能否成功，结果不能；所以，主要问题还是模态框的问题。
3.   因为页面`Modal`初始不显示，我们页面上根本就没有这样的一个元素，所以初始的时候我们写`#id`去获取这个选择器的时候选择不到任何的元素，所以它不显示。**跟页面上有没有这个元素有关系**

:::



进行调整

>   我们此时将渲染的方法写到点击编辑和新增的时候弹出模态框也就是创建模态框的方法里

```typescript
// 编辑
const edit = (record: any) => {
    modalVisible.value = true;
   
    setTimeout(() => {
        editor.create()
    }, 100)
}

// 新增
const add = () => {
    modalVisible.value = true;

    setTimeout(() => {
        editor.create()
    }, 100)
}
```

:::tip

这里我们还加了延时器，这里主要还是因为你页面创建`Modal`的时间可能会比执行`create`方法要慢，所以加了一个延时器

:::



<p align="center"><img src="https://gitee.com/wxvirus/img/raw/master/img/20211225173453.png" alt="富文本显示成功" /></p>