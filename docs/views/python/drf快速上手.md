---
title: 'Django restframework快速上手'
date: '2021-09-27 21:10:00'
sidebar: 'auto'
permalink: '/python/drf/'
categories:
 - python
tags:
 - Django
 - restframework
publish: true
---



## 快速上手

-   安装

    ```bash
    pip install djangorestframework=3.12.4
    ```

    ```
    版本要求: djangorestframework=3.12.4
    	Python (3.5,3.6,3.7,3.8,3.9)
    	Django(2.2, 3.0, 3.1)
    	
    djangorestframework=3.11.2
    Python (3.5,3.6,3.7,3.8)
    Django(1.11, 2.0, 2.1, 2.2, 3.0)
    ```

-   配置，在`settings.py`中添加配置

    ```python
    INSTALLED_APPS = [
      	...
      	# 注册 rest_framework
        'rest_framework'
    ]
    
    # drf相关配置写在这里
    REST_FRAMEWORK = {
      
    }
    ```

-   URL和视图

    ```python
    # urls.py
    
    urlpatterns = [
        # path('admin/', admin.site.urls),
    
        # path("api/<str:version>/users", views.users),
        # path("api/<str:version>/users/<int:pk>", views.users),
    
        path('users/', views.UserView.as_view()),
    ]
    ```

    ```python
    # views.py
    
    from rest_framework.views import APIView
    from rest_framework.response import Response
    
    
    class UserView(APIView):
        def get(self, request, *args, **kwargs):
            return Response({"code": 1000, "data": "xxx"})
    
        def post(self, request, *args, **kwargs):
            return Response({"code": 1000, "data": "xxx"})
    ```

:::tip

其实drf框架是django基础进行的扩展，所以上述执行的底层实现流程还是和django的CBV类似。

drf中重写了`as_view`和`dispatch`方法，就是在原来的django的功能的基础上加了一些功能

-   `as_view`，免除了`csrf`的验证，前后端分离的项目一般不会使用`csrf_token`认证，会使用`jwt`认证
-   `dispatch`内部添加了版本处理、认证、权限、访问频率限制等诸多功能。

:::

现在运行的一个页面

![image-20210927212831528](/assets/images/drf_runtime.png)



