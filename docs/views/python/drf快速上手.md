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

![image-20210927212831528](/vue-blog/assets/images/drf_runtime.png)



## 请求数据的封装

以前Django开发，视图中的request是`django.core.handlers.wsgi.WSGIRequest`类的对象，包含了请求相关的所有数据。

而使用drf框架时，视图的request是`rest_framework.request.Request`类的对象，其实又是对django的request进行了一次封装，包含了除django原request对象以外，还包含其他后期会使用的其他对象。

内部包含了django的request、认证、解析器等。

```
新的request对象 = (django的request, 其他数据)
```



>   源码位置
>
>   `rest_framework.requset.Request`类

:::details 点击查看Request源码

```python
class Request:
    """
    Wrapper allowing to enhance a standard `HttpRequest` instance.

    Kwargs:
        - request(HttpRequest). The original request instance.
        - parsers(list/tuple). The parsers to use for parsing the
          request content.
        - authenticators(list/tuple). The authenticators used to try
          authenticating the request's user.
    """

    def __init__(self, request, parsers=None, authenticators=None,
                 negotiator=None, parser_context=None):
        assert isinstance(request, HttpRequest), (
            'The `request` argument must be an instance of '
            '`django.http.HttpRequest`, not `{}.{}`.'
            .format(request.__class__.__module__, request.__class__.__name__)
        )

        self._request = request
        self.parsers = parsers or ()
        self.authenticators = authenticators or ()
        self.negotiator = negotiator or self._default_negotiator()
        self.parser_context = parser_context
        self._data = Empty
        self._files = Empty
        self._full_data = Empty
        self._content_type = Empty
        self._stream = Empty

        if self.parser_context is None:
            self.parser_context = {}
        self.parser_context['request'] = self
        self.parser_context['encoding'] = request.encoding or settings.DEFAULT_CHARSET

        force_user = getattr(request, '_force_auth_user', None)
        force_token = getattr(request, '_force_auth_token', None)
        if force_user is not None or force_token is not None:
            forced_auth = ForcedAuthentication(force_user, force_token)
            self.authenticators = (forced_auth,)

    def __repr__(self):
        return '<%s.%s: %s %r>' % (
            self.__class__.__module__,
            self.__class__.__name__,
            self.method,
            self.get_full_path())

    def _default_negotiator(self):
        return api_settings.DEFAULT_CONTENT_NEGOTIATION_CLASS()

    @property
    def content_type(self):
        meta = self._request.META
        return meta.get('CONTENT_TYPE', meta.get('HTTP_CONTENT_TYPE', ''))

    @property
    def stream(self):
        """
        Returns an object that may be used to stream the request content.
        """
        if not _hasattr(self, '_stream'):
            self._load_stream()
        return self._stream

    @property
    def query_params(self):
        """
        More semantically correct name for request.GET.
        """
        return self._request.GET

    @property
    def data(self):
        if not _hasattr(self, '_full_data'):
            self._load_data_and_files()
        return self._full_data

    @property
    def user(self):
        """
        Returns the user associated with the current request, as authenticated
        by the authentication classes provided to the request.
        """
        if not hasattr(self, '_user'):
            with wrap_attributeerrors():
                self._authenticate()
        return self._user

    @user.setter
    def user(self, value):
        """
        Sets the user on the current request. This is necessary to maintain
        compatibility with django.contrib.auth where the user property is
        set in the login and logout functions.

        Note that we also set the user on Django's underlying `HttpRequest`
        instance, ensuring that it is available to any middleware in the stack.
        """
        self._user = value
        self._request.user = value

    @property
    def auth(self):
        """
        Returns any non-user authentication information associated with the
        request, such as an authentication token.
        """
        if not hasattr(self, '_auth'):
            with wrap_attributeerrors():
                self._authenticate()
        return self._auth

    @auth.setter
    def auth(self, value):
        """
        Sets any non-user authentication information associated with the
        request, such as an authentication token.
        """
        self._auth = value
        self._request.auth = value

    @property
    def successful_authenticator(self):
        """
        Return the instance of the authentication instance class that was used
        to authenticate the request, or `None`.
        """
        if not hasattr(self, '_authenticator'):
            with wrap_attributeerrors():
                self._authenticate()
        return self._authenticator

    def _load_data_and_files(self):
        """
        Parses the request content into `self.data`.
        """
        if not _hasattr(self, '_data'):
            self._data, self._files = self._parse()
            if self._files:
                self._full_data = self._data.copy()
                self._full_data.update(self._files)
            else:
                self._full_data = self._data

            # if a form media type, copy data & files refs to the underlying
            # http request so that closable objects are handled appropriately.
            if is_form_media_type(self.content_type):
                self._request._post = self.POST
                self._request._files = self.FILES

    def _load_stream(self):
        """
        Return the content body of the request, as a stream.
        """
        meta = self._request.META
        try:
            content_length = int(
                meta.get('CONTENT_LENGTH', meta.get('HTTP_CONTENT_LENGTH', 0))
            )
        except (ValueError, TypeError):
            content_length = 0

        if content_length == 0:
            self._stream = None
        elif not self._request._read_started:
            self._stream = self._request
        else:
            self._stream = io.BytesIO(self.body)

    def _supports_form_parsing(self):
        """
        Return True if this requests supports parsing form data.
        """
        form_media = (
            'application/x-www-form-urlencoded',
            'multipart/form-data'
        )
        return any([parser.media_type in form_media for parser in self.parsers])

    def _parse(self):
        """
        Parse the request content, returning a two-tuple of (data, files)

        May raise an `UnsupportedMediaType`, or `ParseError` exception.
        """
        media_type = self.content_type
        try:
            stream = self.stream
        except RawPostDataException:
            if not hasattr(self._request, '_post'):
                raise
            # If request.POST has been accessed in middleware, and a method='POST'
            # request was made with 'multipart/form-data', then the request stream
            # will already have been exhausted.
            if self._supports_form_parsing():
                return (self._request.POST, self._request.FILES)
            stream = None

        if stream is None or media_type is None:
            if media_type and is_form_media_type(media_type):
                empty_data = QueryDict('', encoding=self._request._encoding)
            else:
                empty_data = {}
            empty_files = MultiValueDict()
            return (empty_data, empty_files)

        parser = self.negotiator.select_parser(self, self.parsers)

        if not parser:
            raise exceptions.UnsupportedMediaType(media_type)

        try:
            parsed = parser.parse(stream, media_type, self.parser_context)
        except Exception:
            # If we get an exception during parsing, fill in empty data and
            # re-raise.  Ensures we don't simply repeat the error when
            # attempting to render the browsable renderer response, or when
            # logging the request or similar.
            self._data = QueryDict('', encoding=self._request._encoding)
            self._files = MultiValueDict()
            self._full_data = self._data
            raise

        # Parser classes may return the raw data, or a
        # DataAndFiles object.  Unpack the result as required.
        try:
            return (parsed.data, parsed.files)
        except AttributeError:
            empty_files = MultiValueDict()
            return (parsed, empty_files)

    def _authenticate(self):
        """
        Attempt to authenticate the request using each authentication instance
        in turn.
        """
        for authenticator in self.authenticators:
            try:
                user_auth_tuple = authenticator.authenticate(self)
            except exceptions.APIException:
                self._not_authenticated()
                raise

            if user_auth_tuple is not None:
                self._authenticator = authenticator
                self.user, self.auth = user_auth_tuple
                return

        self._not_authenticated()

    def _not_authenticated(self):
        """
        Set authenticator, user & authtoken representing an unauthenticated request.

        Defaults are None, AnonymousUser & None.
        """
        self._authenticator = None

        if api_settings.UNAUTHENTICATED_USER:
            self.user = api_settings.UNAUTHENTICATED_USER()
        else:
            self.user = None

        if api_settings.UNAUTHENTICATED_TOKEN:
            self.auth = api_settings.UNAUTHENTICATED_TOKEN()
        else:
            self.auth = None

    def __getattr__(self, attr):
        """
        If an attribute does not exist on this instance, then we also attempt
        to proxy it to the underlying HttpRequest object.
        """
        try:
            return getattr(self._request, attr)
        except AttributeError:
            return self.__getattribute__(attr)

    @property
    def DATA(self):
        raise NotImplementedError(
            '`request.DATA` has been deprecated in favor of `request.data` '
            'since version 3.0, and has been fully removed as of version 3.2.'
        )

    @property
    def POST(self):
        # Ensure that request.POST uses our request parsing.
        if not _hasattr(self, '_data'):
            self._load_data_and_files()
        if is_form_media_type(self.content_type):
            return self._data
        return QueryDict('', encoding=self._request._encoding)

    @property
    def FILES(self):
        # Leave this one alone for backwards compat with Django's request.FILES
        # Different from the other two cases, which are not valid property
        # names on the WSGIRequest class.
        if not _hasattr(self, '_files'):
            self._load_data_and_files()
        return self._files

    @property
    def QUERY_PARAMS(self):
        raise NotImplementedError(
            '`request.QUERY_PARAMS` has been deprecated in favor of `request.query_params` '
            'since version 3.0, and has been fully removed as of version 3.2.'
        )

    def force_plaintext_errors(self, value):
        # Hack to allow our exception handler to force choice of
        # plaintext or html error responses.
        self._request.is_ajax = lambda: value
```



所以在使用drf的框架的requet的时候，会有一些不同，例如：

```python
# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response


class UserView(APIView):
    def get(self, request, *args, **kwargs):
        # 通过对象的嵌套直接找到request，读取相关值
        request._request.method
        request._request.GET
        request._request.POST
        request._request.body

        # 直接去读新request对象中的值，一般此处会对原始数据的进行处理，方便在视图函数里使用
        request.query_params    # 内部本质上就是 request._request.GET
        request.data # 内部读取请求体中的数据，并进行处理，对请求者发送来的JSON会对JSON字符串进行反序列化
        
        # 通过 __getattr__ 去访问reqeust._request 中的值
        return Response({"code": 1000, "data": "xxx"})

    def post(self, request, *args, **kwargs):
        return Response({"code": 1000, "data": "xxx"})

```

:::

drf内部会根据请求头`content-type`来进行内部处理数据然后组装完了扔到request里，方便我们进行使用。



`__getattr__`什么时候触发？

当你调用了`reqeust.属性`就会去调用

:::details 点击查看代码

源码

```python
def __getattr__(self, attr):
        """
        If an attribute does not exist on this instance, then we also attempt
        to proxy it to the underlying HttpRequest object.
        """
        try:
            return getattr(self._request, attr)
        except AttributeError:
            return self.__getattribute__(attr)
```

:::

```python
request.method => self._request.method
```



## 版本管理

在restful规范中，后端的API需要体现版本

`drf`框架中支持5种版本的设置



>   第一个

```python
# views.py

from rest_framework.versioning import QueryParameterVersioning
from rest_framework.views import APIView
from rest_framework.response import Response


class UserView(APIView):
    versioning_class = QueryParameterVersioning

    def get(self, request, *args, **kwargs):

        print(request.version)
        return Response({"code": 1000, "data": "xxx"})
```

```python
# urls.py

from django.urls import path
from app01 import views

urlpatterns = [
    # path('admin/', admin.site.urls),

    # path("api/<str:version>/users", views.users),
    # path("api/<str:version>/users/<int:pk>", views.users),

    path('api/users/', views.UserView.as_view()),
]
```

在浏览器中输入地址：http://127.0.0.1:8000/api/users/?version=v1

此时终端会输出一个对应的版本号：**v1**

:::danger

注意，浏览器输入的`version=v几`的`version`是固定的

:::



那么可以不可以修改呢，毕竟`version`要输入这么一长串

:::details 看下`QueryParameterVersioning`的源码的父类`BaseVersioning`

```python
class BaseVersioning:
    default_version = api_settings.DEFAULT_VERSION
    allowed_versions = api_settings.ALLOWED_VERSIONS
    version_param = api_settings.VERSION_PARAM
```

:::

其中的`VERSION_PARAM`，我们可以拿出来放到配置文件里，我们重新设置一下内容

```python
# settings.py

# 之前说的drf的框架的配置文件都放在这个里面
REST_FRAMEWORK = {
  "VERSION_PARAM": "v"
}
```

写成这个时，后面浏览器写的时候传入的版本就得写：http://127.0.0.1:8000/api/users/?v=v1

:::danger

此时如果你还写成`version`就不行

:::



如果想设置一个默认值的版本，就是你不想写后面一串，如何设置一个默认值的版本？

还是看上面的源码部分，里面有一个`DEFAULT_VERSION`看英文就知道是啥意思了。配置一下这个的默认值即可

```python
# settings.py

REST_FRAMEWORK = {
  "VERSION_PARAM": "v",
  "DEFAULT_VERSION": "v1", # 设置默认版本为v1
}
```



>   看到源码里还有一个`ALLOWED_VERSIONS`没用上，那肯定还是有用的啊，这个从字面上看就是可以允许的版本，我们可以进行限制一些版本名称

```python
# settings.py

REST_FRAMEWORK = {
  "VERSION_PARAM": "v",
  "DEFAULT_VERSION": "v1", # 设置默认版本为v1
  "ALLOWED_VERSIONS": ["v1", "v2", "v3"],
}
```

:::danger

此时浏览器只能传入`v1、v2、v3`，其余的就会出错

:::



### 省事教程

此时，如果有多个视图，`versioning_class = QueryParameterVersioning`这一句是不是要在很多个视图类里都要写一遍。是的，很麻烦，`drf`还提供了一个解决办法。

`全局配置`

```python
# settings.py

REST_FRAMEWORK = {
    "VERSION_PARAM": "v",
    "DEFAULT_VERSION": "v1",  # 设置默认版本为v1
    "ALLOWED_VERSIONS": ["v1", "v2", "v3"],
    "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.QueryParameterVersioning"
}

```

:::details 查看源码位置

```python
class APIView(View):

    # The following policies may be set at either globally, or per-view.
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES
    parser_classes = api_settings.DEFAULT_PARSER_CLASSES
    authentication_classes = api_settings.DEFAULT_AUTHENTICATION_CLASSES
    throttle_classes = api_settings.DEFAULT_THROTTLE_CLASSES
    permission_classes = api_settings.DEFAULT_PERMISSION_CLASSES
    content_negotiation_class = api_settings.DEFAULT_CONTENT_NEGOTIATION_CLASS
    metadata_class = api_settings.DEFAULT_METADATA_CLASS
    versioning_class = api_settings.DEFAULT_VERSIONING_CLASS # 此处
```

:::

