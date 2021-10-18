---
title: 'Serializer学习'
date: '2021-10-18 21:32:00'
sidebar: 'auto'
permalink: '/python/drf/serializer'
categories:
 - python
tags:
 - Django
 - restframework
 - Serializer
publish: true
---



## Serializer

>   drf为我们提供了`Serializer`，它主要有两大功能：

-   对请求数据校验(底层调用Django的Form和ModelForm)
-   对数据库查询到的对象进行序列化



<!-- more -->



## 数据校验

实例1：基于Serializer

```python
class RegexValidator(object):
    def __init__(self, base):
        self.base = base

    def __call__(self, value):
        match_object = re.match(self.base, value)
        if not match_object:
            raise serializers.ValidationError('格式错误')

class UserSerializer(serializers.Serializer):
    username = serializers.CharField(label='姓名', min_length=32)
    age = serializers.IntegerField(label='年龄', min_value=0, max_value=200)
    level = serializers.ChoiceField(label='级别', choices=models.UserInfo.level_choices)
    email = serializers.CharField(label='邮箱', validators=[EmailValidator, ])
    email1 = serializers.EmailField(label='邮箱1')
    email2 = serializers.CharField(label='邮箱2', validators=[RegexValidator(r"^\w+@\w+\.\w+$"), ])
    email3 = serializers.CharField(label='邮箱3')

    def validate_email3(self, value):
        """钩子函数，用于验证某个字段"""
        if re.match(r"\w+@\w+\.\w+$", value):
            return value
        raise exceptions.ValidationError('邮箱格式错误')


class UserView(APIView):
    """用户管理"""

    def post(self, request):
        """添加用户"""
        ser = UserSerializer(data=request.data)
        if not ser.is_valid():
            return Response({"code": 1006, "data": ser.errors})

        print(ser.validated_data)
        # 自行进行数据库操作
        return Response({"code": 0, 'data': "创建成功"})
```

