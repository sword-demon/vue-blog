---
title: 'drf序列化'
date: '2022-06-18 15:26:00'
sidebar: 'auto'
permalink: '/python/drf/serializer'
categories:
 - python
tags:
 - Django
 - restframework
 - serializer
publish: true
---



## 序列化示例1

通过ORM从数据库获取到的QuerySet或对象均可以被序列化为`json`格式数据。

```python
class UserModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.UserInfo
        fields = ["username", "age", "email"]


class UserView(APIView):
    """用户管理"""

    def get(self, request):
        """获取用户列表"""
        queryset = models.UserInfo.objects.all()
        ser = UserModelSerializer(instance=queryset, many=True)
        print(ser.data)
        return Response({"code": 0, "data": ser.data})
```

响应结果

```json
{
    "code": 0,
    "data": [
        {
            "username": "wujie",
            "age": 12
        },
        {
            "username": "wdqwdqwdq",
            "age": 12
        }
    ]
}
```



序列化示例2

```python
class UserModelSerializer(serializers.ModelSerializer):

    level_text = serializers.CharField(source="get_level_display")
    # 可以获取到关联对象的部门名称
    depart = serializers.CharField(source="depart.title")

    roles = serializers.SerializerMethodField()
    extra = serializers.SerializerMethodField()

    class Meta:
        model = models.UserInfo
        # 可以额外定义一些字段 和自定义一些钩子去展示数据
        fields = ["username", "age", "level", "depart", "roles", "extra"]
        # 额外的参数 追加一些字段的一些限制参数
        extra_kwargs = {
            "username": {"min_length": 6, "max_length": 32},
            # "email": {"validators": [EmailValidator, ]}
        }

    def get_roles(self, obj):
        data_list = obj.roles.all()
        return [model_to_dict(item, ["id", "title"]) for item in data_list]

    def get_extra(self, obj):
        return 666
```

