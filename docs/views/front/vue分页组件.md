---
title: 'Vue分页组件'
date: 2022-05-12 21:56:15
# 永久链接
permalink: '/front/vue-pagination'
sidebar: 'auto'
isShowComment: true
categories:
 - front
tags:
 - javascript
---

## Vue分页组件

> 这里的分页样式和 bootstrap 有关，样式可以自己改，这个无所谓

pagination 组件

```javascript
<template>
    <div class="pagination" role="group" aria-label="分页">
        <button type="button" class="btn btn-default btn-white btn-round"
                v-bind:disabled="page === 1"
                v-on:click="selectPage(1)">
            1
        </button>
        <button type="button" class="btn btn-default btn-white btn-round"
                v-bind:disabled="page === 1"
                v-on:click="selectPage(page - 1)">
            上一页
        </button>
        <button v-for="p in pages" v-bind:id="'page-' + p"
                type="button" class="btn btn-default btn-white btn-round"
                v-bind:class="{'btn-primary active':page == p}"
                v-on:click="selectPage(p)">
            {{ p }}
        </button>
        <button type="button" class="btn btn-default btn-white btn-round"
                v-bind:disabled="page === pageTotal"
                v-on:click="selectPage(page + 1)">
            下一页
        </button>
        <button type="button" class="btn btn-default btn-white btn-round"
                v-bind:disabled="page === pageTotal"
                v-on:click="selectPage(pageTotal)">
            {{ pageTotal || 1 }}
        </button>

        <span class="m-padding-10">
            每页
            <select v-model="size">
                <option value="1">1</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
            条，共【{{ total }}】条
        </span>
    </div>
</template>

<script>
  export default {
    name: "pagination",
    props: {
      list: {
        type: Function,
        default: null
      },
      // 显示的页码数，比如总归有100页，只显示10页，其他用省略号表示
      itemCount: Number
    },
    data() {
      return {
        // 总行数
        total: 0,
        // 每页条数
        size: 10,
        // 当前页码
        page: 0,
        // 总页数
        pageTotal: 0,
        // 显示的页码数组
        pages: [],
      }
    },
    methods: {
      /**
       * 渲染分页组件
       * @param page
       * @param total
       */
      render(page, total) {
        let _this = this;
        _this.page = page;
        _this.total = total;
        _this.pageTotal = Math.ceil(total / _this.size);
        _this.pages = _this.getPageItems(_this.pageTotal, page, _this.itemCount || 5);
      },
      /**
       * 查询某一页
       * @param page
       */
      selectPage(page) {
        let _this = this;
        if (page < 1) {
          page = 1;
        }
        if (page > _this.pageTotal) {
          page = _this.pageTotal;
        }
        if (this.page !== page) {
          _this.page = page;
          if (_this.list) {
            _this.list(page);
          }
        }
      },
      /**
       * 当前显示再页面上的页码
       * @param total
       * @param current
       * @param length
       * @returns {Array}
       */
      getPageItems(total, current, length) {
        let items = [];
        if (length >= total) {
          for (let i = 1; i <= total; i++) {
            items.push(i);
          }
        } else {
          let base = 0;
          // 前移
          if (current - 0 > Math.floor((length - 1) / 2)) {
            // 后移
            base = Math.min(total, current - 0 + Math.ceil((length - 1) / 2)) - length;
          }
          for (let i = 1; i <= length; i++) {
            items.push(base + i);
          }
        }
        return items;
      }
    }
  }
</script>

<style scoped>
    .pagination {
        vertical-align: middle !important;
        font-size: 16px;
        margin-top: 0;
        margin-bottom: 10px;
    }

    .pagination button {
        margin-right: 5px;
    }

    .btn-primary.active {
        background-color: #2f7bba !important;
        border-color: #27689d !important;
        color: white !important;
        font-weight: 600;
    }
</style>
```

## 进行使用

在页面中进行使用该组件

```javascript
<template>
    <div>
        <pagination ref="pagination" v-bind:list="list"></pagination>
    </div>
</template>

<script>
    import Pagination from "组件所在的位置";
    export default {
        name: "该页面名称",
        components: {Pagination}
    }
</script>
```

> 这里的`list`，是当前页面的`list`方法，使用`axios`对后端进行获取数据
> 使用`post`方法
> 参数: `page`、`size` > `page`：当前页码
> `size`：每页条数

组件也可以绑定`itemCount`来初始化页面显示多少个页码数

```javascript
<pagination ref='pagination' v-bind:list='list' v-bind:itemCount='8'></pagination>
```

<span style="color: red; font-size: 22px;">这里的页码数主要是为了假如你想分 100 页，总不能在页面上显示 100 个页码数吧，这样就很不美观</span>