---
title: 'drf限流'
date: '2021-10-08 20:26:00'
sidebar: 'auto'
permalink: '/python/drf/limit'
categories:
 - python
tags:
 - Django
 - restframework
 - limit
publish: true
---



## 限流

限流，限制用户访问频率，例如：用户1分钟内最多访问100次，或者短信验证码一天只能发送50次，防止盗刷。

-   对于匿名用户，使用用户IP作为唯一标识
-   对于登录用户，使用用户ID或名称作为唯一标识



使用django的一个模块，`django-redis`

下载：

```bash
pip3 install django-redis
```

```python
# setting.pu 配置文件
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "PASSWORD": "你的redis密码"
        }
    }
}
```

```python
# urls.py

path('api/order', views.OrderView.as_view()),
```

```python
# view.py
from rest_framework import exceptions, status
from rest_framework.throttling import SimpleRateThrottle
from django.core.cache import cache as default_cache

class ThrottleException(exceptions.APIException):
    """自定义异常"""
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    default_code = 'throttled'


class MyRateThrottle(SimpleRateThrottle):
    # 访问记录存放在django的缓存中(需设置缓存)
    cache = default_cache
    scope = "user"  # 构造缓存key
    cache_format = "throttle_%(scope)s_%(ident)s"

    # 设置访问频率
    # 其他： 's' 'sec' 'm' 'min' 'h' 'hour' 'd' 'day'
    # 秒 分钟 小时 天
    THROTTLE_RATES = {"user": "10/m"}  # 1分钟能访问10次

    def get_cache_key(self, request, view):
        if request.user:
            ident = request.user.pk  # 拿到用户id
        else:
            ident = self.get_ident(request)  # 获取请求用户IP (去request中找请求头)

        # throttle_user_2
        # throttle_user_11.11.11.11
        return self.cache_format % {"scope": self.scope, "ident": ident}

    def throttle_failure(self):
        # 根据当前时间以及最近的一个过期时间比较还有多久可以访问
        wait = self.wait()
        detail = {
            "code": 1005,
            "data": "访问频率限制",
            "detail": "需要等待{}s才能访问".format(int(wait))
        }
        raise ThrottleException(detail)

class OrderView(APIView):
  	# 把限流类应用到视图类中
    throttle_classes = [MyRateThrottle, ]

    def get(self, request, *args, **kwargs):
        return Response({"code": 0, "data": {"user": None, "list": [44, 55, 66]}})
```

