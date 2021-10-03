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

