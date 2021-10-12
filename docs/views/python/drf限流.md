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





### 多个限流类

```python
# 在视图类里加上
throttle_classes = [MyRateThrottle, ]
```

>   多个限流类的时候，他会内容有一个列表用来存储不允许访问的限流类，最后去判断有没有不允许的类，最后在页面进行显示错误信息。无论它返回False还是True，都会把所有的限流类执行完，但是如果抛出异常了，后续的限流类都不会继续执行了。

`SimpleRateThrottle`类内部实现了一个`allow_request`的方法

-   返回True - 允许访问
-   返回False - 超过频率，不允许访问
-   抛出异常，表示当前限流类不允许访问，后续限流类不再执行



::: details SimpleRateThrottle 源码

```python
    def allow_request(self, request, view):
        """
        Implement the check to see if the request should be throttled.

        On success calls `throttle_success`.
        On failure calls `throttle_failure`.
        """
        if self.rate is None:
            return True

        self.key = self.get_cache_key(request, view)
        if self.key is None:
            return True

        self.history = self.cache.get(self.key, [])
        self.now = self.timer()

        # Drop any requests from the history which have now passed the
        # throttle duration
        while self.history and self.history[-1] <= self.now - self.duration:
            self.history.pop()
        if len(self.history) >= self.num_requests:
            return self.throttle_failure()
        return self.throttle_success()
```

:::

