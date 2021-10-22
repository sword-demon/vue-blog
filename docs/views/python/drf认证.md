---
02title: 'drf认证组件'
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



<!-- more -->



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



## 多个认证类

一般情况下编写一个认证类足矣。

多个时，可以写多个认证类

-   在请求中传递token进行验证
-   请求携带cookie进行验证
-   请求携带jwt进行验证
-   请求携带的加密的数据，需要特定的算法解密，一般为app开发的接口都有加解密算法
-   etc.

此时，就可以写多个认证类



案例

```python
# auth.py

# -*- coding: utf8 -*-
# @Time    : 2021/10/3 23:20
# @Author  : wxvirus
# @File    : auth.py
# @Software: PyCharm
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from app01 import models


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

    def authenticate_header(self, request):
        """
        认证失败了，给用户返回的响应头信息
        :param request:
        :return:
        """
        return "Bearer realm='API'"


class CookieAuthentication(BaseAuthentication):

    def authenticate(self, request):
        session_id = request.COOKIE.get('session_id')
        if not session_id:
            return None
        user_object = models.UserInfo.objects.filter(token=session_id).first()
        if not user_object:
            return None
        return user_object, session_id

    def authenticate_header(self, request):
        return 'Bearer realm="API"'

```



### 全局配置

在每个视图类的类变量`authentication_classes`中可以定义，在配置文件中也可以进行全局配置

```python
REST_FRAMEWORK = {
   "UNAUTHENTICATED_USER": lambda: None,
   "UNAUTHENTICATED_TOKEN": lambda: None,
   "DEFAULT_AUTHENTICATION_CLASSES": ["auth.TokenAuthentication", "auth.CookieAuthentication", ] # 认证类的路径
}
```

>   下面的所有的类视图，就可以不用编写了

如果在视图类中写上

```python
authentication_classes = []
```

就会使用当前配置的认证类 ，就会覆盖掉全局的配置的内容



::: datails APIView源码

```python
class APIView(View):

    # The following policies may be set at either globally, or per-view.
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
    parser_classes = api_settings.DEFAULT_PARSER_CLASSES
    # 如果你的视图类里写了自己一个类的配置，则会覆盖全局配置里的认证类
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    throttle_classes = api_settings.DEFAULT_THROTTLE_CLASSES
    permission_classes = api_settings.DEFAULT_PERMISSION_CLASSES
    content_negotiation_class = api_settings.DEFAULT_CONTENT_NEGOTIATION_CLASS
    metadata_class = api_settings.DEFAULT_METADATA_CLASS
    versioning_class = api_settings.DEFAULT_VERSIONING_CLASS
```

:::



## 权限

>   读取认证中获取的用户信息，判断当前用户是否有权限访问。

```python
class UserInfo(models.Model):
    role_choices = ((1, "普通用户"), (2, "管理员"), (3, "超级管理员"),)
    role = models.IntegerField(verbose_name='角色', choices=role_choices, default=1)
    username = models.CharField(max_length=32, verbose_name='用户名')
    password = models.CharField(max_length=64, verbose_name='密码')
    token = models.CharField(max_length=64, verbose_name='token认证', null=True, blank=True)
```



权限类

```python
from rest_framework.permissions import BasePermission
class PermissionA(BasePermission):
    message = {"code": 1003, 'data': '无权访问'}

    def has_permission(self, request, view):
      """
      此方法必须有
      """
        pass

    def has_object_permission(self, request, view, obj):
        pass
```

视图类

```python
class OrderView(APIView):
    # 通过类变量进行绑定，这就意味着，这个视图类有限需要进行认证，认证成功了才会走到 下面的方法
    authentication_classes = [TokenAuthentication, CookieAuthentication]
    permission_classes = [PermissionA, ] # 加上了这个

    def get(self, request, *args, **kwargs):
        print(request.user)
        print(request.auth)

        if not request.user:
            # 匿名访问返回内容
            return Response({"code": 0, "data": [11, 22, 33]})

        return Response({"code": 0, "data": {"user": None, "list": [44, 55, 66]}})
```



验证权限简单实现

```python
def has_permission(self, request, view):
  if request.user.role == 2:
    return True
  return False
```



**因为在配置的时候是列表，所以这个也是可以有多个权限类**

关系：

:::danger

列表里的所有权限都通关了才能继续往下走，缺一不可！

:::



---

这也可以进行全局配置

```python
# settings.py
REST_FRAMEWORK = {
    "VERSION_PARAM": "v",
    "DEFAULT_VERSION": "v1",  # 设置默认版本为v1
    "ALLOWED_VERSIONS": ["v1", "v2", "v3"],
    "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.QueryParameterVersioning",
    "DEFAULT_AUTHENTICATION_CLASSES": ["app01.auth.TokenAuthentication", "app01.auth.CookieAuthentication", ],
    "DEFAULT_PERMISSION_CLASSES": ["app01.permission.PermissionA"]
}

```

