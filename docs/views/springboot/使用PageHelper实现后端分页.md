---
title: '使用PageHelper实现后端分页'
date: 2021-12-18 21:01:15
# 永久链接
permalink: '/springboot/pageheler'
sidebar: 'auto'
isShowComment: true
categories:
 - springboot
tags:
 - null
---



## 集成PageHelper插件

依赖

```xml
<!-- pageHelper 插件 -->
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.2.13</version>
</dependency>
```

配置打印SQL语句

```properties
logging.level.com.xxx.wiki.mapper=trace
```

```yaml
# 打印所有sql日志：sql，参数，结果
logging:
  level:
    com:
      xxx:
        wiki:
          mapper: trace
```



可以直接使用

```java
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.wx.wiki.domain.Ebook;
import com.wx.wiki.domain.EbookExample;
import com.wx.wiki.mapper.EbookMapper;
import com.wx.wiki.req.EbookReq;
import com.wx.wiki.resp.EbookResp;
import com.wx.wiki.util.CopyUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import javax.annotation.Resource;
import java.util.List;

@Service
public class EbookService {

    private static final Logger LOG = LoggerFactory.getLogger(EbookService.class);

    @Resource
    private EbookMapper ebookMapper;

    public List<EbookResp> list(EbookReq req) {

        EbookExample ebookExample = new EbookExample();
        EbookExample.Criteria criteria = ebookExample.createCriteria();
        // 参数可以为空
        if (!ObjectUtils.isEmpty(req.getName())) {
            criteria.andNameLike("%" + req.getName() + "%");
        }
        // 只对第一个select有用 所以最好就把这2个放在一起
        PageHelper.startPage(1, 3);
        List<Ebook> ebookList = ebookMapper.selectByExample(ebookExample);

        PageInfo<Ebook> pageInfo = new PageInfo<>(ebookList);
        LOG.info("总行数: {}", pageInfo.getTotal());
        LOG.info("总页数: {}", pageInfo.getPages());

        // 列表复制 => 工具类的列表复制
        List<EbookResp> list = CopyUtil.copyList(ebookList, EbookResp.class);

        return list;
    }
}

```



## 封装分页请求参数和返回参数

封装分页请求参数

```java
public class PageReq {
    private int page;

    private int size;

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    @Override
    public String toString() {
        return "PageReq{" +
                "page=" + page +
                ", size=" + size +
                '}';
    }
}
```

让本身的业务请求继承它来使用

```java
public class EbookReq extends PageReq {
    private Long id;

    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "EbookReq{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
```

封装自定义返回内容

```java
import java.util.List;

public class PageResp<T> {
    private long total;

    private List<T> list;

    @Override
    public String toString() {
        return "PageResp{" +
                "total=" + total +
                ", list=" + list +
                '}';
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public List<T> getList() {
        return list;
    }

    public void setList(List<T> list) {
        this.list = list;
    }
}
```



此时，服务层对应的代码变化

```java
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.wx.wiki.domain.Ebook;
import com.wx.wiki.domain.EbookExample;
import com.wx.wiki.mapper.EbookMapper;
import com.wx.wiki.req.EbookReq;
import com.wx.wiki.resp.EbookResp;
import com.wx.wiki.resp.PageResp;
import com.wx.wiki.util.CopyUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import javax.annotation.Resource;
import java.util.List;

@Service
public class EbookService {

    private static final Logger LOG = LoggerFactory.getLogger(EbookService.class);

    @Resource
    private EbookMapper ebookMapper;

    public PageResp<EbookResp> list(EbookReq req) {

        EbookExample ebookExample = new EbookExample();
        EbookExample.Criteria criteria = ebookExample.createCriteria();
        // 参数可以为空
        if (!ObjectUtils.isEmpty(req.getName())) {
            criteria.andNameLike("%" + req.getName() + "%");
        }
        // 只对第一个select有用 所以最好就把这2个放在一起
        PageHelper.startPage(req.getPage(), req.getSize());
        List<Ebook> ebookList = ebookMapper.selectByExample(ebookExample);

        PageInfo<Ebook> pageInfo = new PageInfo<>(ebookList);
        LOG.info("总行数: {}", pageInfo.getTotal());
        LOG.info("总页数: {}", pageInfo.getPages());

        // 列表复制 => 工具类的列表复制
        List<EbookResp> list = CopyUtil.copyList(ebookList, EbookResp.class);

        // 定义返回内容
        PageResp<EbookResp> pageResp = new PageResp<>();
        pageResp.setTotal(pageInfo.getTotal());
        pageResp.setList(list);

        return pageResp;
    }
}

```

对应的控制器也要修改响应的返回类型

```java
import com.wx.wiki.req.EbookReq;
import com.wx.wiki.resp.CommonResp;
import com.wx.wiki.resp.EbookResp;
import com.wx.wiki.resp.PageResp;
import com.wx.wiki.service.EbookService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/ebook") // 提取请求地址前缀
public class EbookController {

    @Resource
    private EbookService ebookService;

    @GetMapping("/list")
    public CommonResp<PageResp<EbookResp>> list(EbookReq req) {
        CommonResp<PageResp<EbookResp>> resp = new CommonResp<>();
        PageResp<EbookResp> list = ebookService.list(req);
        resp.setContent(list);
        return resp;
    }
}

```



测试请求

```http
GET http://localhost:8880/ebook/list?page=1&size=4
#Accept: application/json

###
```

```bash
GET http://localhost:8880/ebook/list?page=1&size=4

HTTP/1.1 200 
Vary: Origin
Vary: Access-Control-Request-Method
Vary: Access-Control-Request-Headers
Content-Type: application/json
Transfer-Encoding: chunked
Date: Sat, 18 Dec 2021 14:35:00 GMT
Keep-Alive: timeout=60
Connection: keep-alive

{
  "success": true,
  "message": null,
  "content": {
    "total": 5,
    "list": [
      {
        "id": 1,
        "name": "SpringBoot 入门教程",
        "category1Id": null,
        "category2Id": null,
        "description": "零基础入门Java开发，企业级应用开发最佳首选框架",
        "cover": "/image/cover1.png",
        "docCount": null,
        "viewCount": null,
        "voteCount": null
      },
      {
        "id": 2,
        "name": "Vue 入门教程",
        "category1Id": null,
        "category2Id": null,
        "description": "零基础入门 Vue 开发，企业级应用开发最佳首选框架",
        "cover": "/image/cover2.png",
        "docCount": null,
        "viewCount": null,
        "voteCount": null
      },
      {
        "id": 3,
        "name": "Python 入门教程",
        "category1Id": null,
        "category2Id": null,
        "description": "零基础入门 Python 开发，企业级应用开发最佳首选框架",
        "cover": null,
        "docCount": null,
        "viewCount": null,
        "voteCount": null
      },
      {
        "id": 4,
        "name": "MySQL 入门教程",
        "category1Id": null,
        "category2Id": null,
        "description": "零基础入门 MySQL 开发，企业级应用开发最佳首选框架",
        "cover": null,
        "docCount": null,
        "viewCount": null,
        "voteCount": null
      }
    ]
  }
}

Response code: 200; Time: 109ms; Content length: 792 bytes

```

