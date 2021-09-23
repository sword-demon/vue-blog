---
title: 'Django用户认证组件'
date: '2021-09-23 22:50:00'
sidebar: 'auto'
permalink: '/djangoauth'
categories:
 - python
tags:
 - Django
 - Auth
publish: true
---



::: tip
Django用户认证组件学习
:::



功能：用session记录登录验证状态

前提：使用`Django`自带的用户表`auth_user`

---

创建超级用户：

```bash
python manage.py createsuperuser
```

---

后期扩展字段方法

1. 继承`User`模型
2. 使用一对一模型扩展用户表模型字段



## auth模块

封装在auth模块中

```python
from django.contrib import auth
```

它提供了很多方法，主要使用其中的三个。



### authenticate()

提供了用户认证，即验证用户名及密码是否正确，一般需要`username password`两个关键字参数。如果认证有效，会返回一个`User`对象。`authenticate()`会在`User`对象上设置一个属性标识那种认证后端的认证了该用户，且该信息在后面的登录过程中是需要的。如果取出一个数据库取出一个不经过`authenticate()`的`User`对象会报错！

```python
user = authenticate(username='username', password='密码')
```



### login(HttpRequest, user)

接收一个HttpRequest对象，以及一个认证了的`User`对象

此函数使用`Django`的session框架给某个已认证的用户附加上session id等信息

```python
from django.contrib.auth import authenticate, login

def login(request):
  username = request.POST.get("username")
  password = request.POST.get("password")
  
  user = authenticate(username=username, password=password)
  if user is not None:
    login(request, user)
    # 跳转到一个页面
  else:
    # 提示认证错误信息
```



### logout(request)注销用户

无返回值，接收一个`HttpRequest`对象，会清除当前请求的session信息，即使用户没有登录，也不会报错。

```python
from django.contrib.auth import logout

def logout_view(request):
  logout(request)
  
  # 跳转到登录页
```



### User对象

登录成功后会有一个`request.user`当前登录对象，可以全局使用。

#### 判断是否登录成功

```python
if not request.user.is_authenticated:
  	# 没有登录成功
```



#### 注册插入新用户

> 使用对象的`create`方法是可以插入数据，但是用户的密码就没有进行加密。
>
> 应该使用`User`对象的`create_user`方法，它会将我们的密码进行加密存储，返回插入的那条对象。

```python
def reg(request):
  username = request.POST.get("username")
  password = request.POST.get("password")
  
  user = User.objects.create_user(username=username, password=password)
  
  return redirect('/login/')
```



#### 修改密码

使用`set_password()`来进行修改密码

```python
user = User.objects.get(username="xxx")
user.set_password(password='xxxx')
user.save()
```



## 便携验证登录装饰器

`@login_required`

需要在配置文件里进行配置登录的跳转页面

`settings.py`

```python
LOGIN_URL="/login/"
```



视图函数里

```python
from django.contrib.auth.decorators import login_required

@login_required
def index(request):
  
  return render(request, 'index.html')
```

---

验证成功后，可以设置需要跳转的以前的页面

```python
next_url = request.GET.get("next", "/index") # 如果没有就默认跳转到首页
return redirect(next_url)
```

