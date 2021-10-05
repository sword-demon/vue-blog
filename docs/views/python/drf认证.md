---
title: 'drf认证组件'
date: '2021-10-03 22:10:00'
sidebar: 'auto'
permalink: '/python/drf/authz'
categories:
 - python
tags:
 - Django
 - restframework
 - authz
publish: true
---



## 认证

```python
# urls.py

urlpatterns = [
    path('api/auth',  views.AuthView.as_view()),
    path('api/order', views.OrderView.as_view()),
]
```



需要认证的接口的模式

```python
class AuthView(APIView):

    def post(self, request, *args, **kwargs):
        print(request.data)
        username = request.data.get('username')
        password = request.data.get('password')

        user_object = models.UserInfo.objects.filter(username=username, password=password).first()
        if not user_object:
            return Response({"code": 1000, "data": "用户名和密码错误"})

        token = str(uuid.uuid4())
        user_object.token = token
        user_object.save()

        return Response({"code": 0, "data": {"token": token, "name": username}})
```



编辑认证类

必须继承`BaseAuthentication`这个父类

```python
# Create your views here.
import uuid

from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.versioning import QueryParameterVersioning, URLPathVersioning, AcceptHeaderVersioning, \
    HostNameVersioning, NamespaceVersioning
from rest_framework.views import APIView
from rest_framework.response import Response

from app01 import models


class AuthView(APIView):

    def post(self, request, *args, **kwargs):
        print(request.data)
        username = request.data.get('username')
        password = request.data.get('password')

        user_object = models.UserInfo.objects.filter(username=username, password=password).first()
        if not user_object:
            return Response({"code": 1000, "data": "用户名和密码错误"})

        token = str(uuid.uuid4())
        user_object.token = token
        user_object.save()

        return Response({"code": 0, "data": {"token": token, "name": username}})


class TokenAuthentication(BaseAuthentication):
    """
    认证组件
    """

    def authenticate(self, request):
        """
        认证的方法
        :param request:
        :return:
        """
        token = request.query_param.get("token")
        if not token:
            raise AuthenticationFailed({"code": 1002, "data": "认证失败"})

        user_object = models.UserInfo.objects.filter(token=token).first()
        if not user_object:
            raise AuthenticationFailed({"code": 1002, "data": "认证失败"})

        # request.user
        # request.auth
        return user_object, token

    def authenticate_header(self, request):
        """
        认证失败了，给用户返回的响应头信息
        :param request:
        :return:
        """
        return "Bearer realm='API'"


class OrderView(APIView):
    # 通过类变量进行绑定，这就意味着，这个视图类有限需要进行认证，认证成功了才会走到 下面的方法
    authentication_classes = [TokenAuthentication, ]

    def get(self, request, *args, **kwargs):
        print(request.user)
        print(request.auth)

        return Response({"code": 0, "data": {"user": None, "list": [1, 2, 3]}})

```

**认证成功后，用户和token会存在`request.user、request.auth`中**



## 返回None

如果在验证token的地方返回None

**意思就是跳过当前认证类，执行下一个认证类**

```python
class TokenAuthentication(BaseAuthentication):
    """
    认证组件
    """

    def authenticate(self, request):
        """
        认证的方法
        :param request:
        :return:
        """
        return None # 此处
        token = request.query_param.get("token")
        if not token:
            # 抛出异常，终止认证，返回认证失败
            raise AuthenticationFailed({"code": 1002, "data": "认证失败"})

        user_object = models.UserInfo.objects.filter(token=token).first()
        if not user_object:
            raise AuthenticationFailed({"code": 1002, "data": "认证失败"})

        # 返回元祖
        # 第一个赋值给 request.user
        # 第二个赋值给 request.auth
        return user_object, token
```

此时`request.user`为`AnonymouseUser`，以及`request.auth = None`

也可以将上述写入配置文件

```python
REST_FRAMEWORK = {
  "UNAUTHENTICATED_USER": lambda: None,
  "UNAUTHENTICATED_TOKEN": lambda: None,
}
```

所有都没有认证，最后多会经过配置项返回None



**返回None的应用场景**

>   当某个API，已认证和未认证的用户都可以访问方法时，比如
>
>   -   已认证用户，访问API返回该用户的视频播放记录表
>   -   未认证用户，访问API返回最新的视频列表
>
>   **此案例是已认证和未认证均可访问**

```python
class TokenAuthentication(BaseAuthentication):
    """
    认证组件
    """

    def authenticate(self, request):
        """
        认证的方法
        :param request:
        :return:
        """
        token = request.query_param.get("token")
        if not token:
            # 代表用户匿名访问
            return None
            # 抛出异常，终止认证，返回认证失败
            # raise AuthenticationFailed({"code": 1002, "data": "认证失败"})

        user_object = models.UserInfo.objects.filter(token=token).first()
        if not user_object:
            # 认证失败
            raise AuthenticationFailed({"code": 1002, "data": "认证失败"})

        # 返回元祖
        # 第一个赋值给 request.user
        # 第二个赋值给 request.auth
        return user_object, token
```

```python
class OrderView(APIView):
    # 通过类变量进行绑定，这就意味着，这个视图类有限需要进行认证，认证成功了才会走到 下面的方法
    authentication_classes = [TokenAuthentication, ]

    def get(self, request, *args, **kwargs):
        print(request.user)
        print(request.auth)

        if not request.user:
            # 匿名访问返回内容
            return Response({"code": 0, "data": [11, 22, 33]})

        return Response({"code": 0, "data": {"user": None, "list": [44, 55, 66]}})
```

