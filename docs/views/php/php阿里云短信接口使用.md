---
title: 'PHP阿里云短信接口使用'
date: '2021-09-23 23:11:00'
sidebar: 'auto'
permalink: '/alisms'
categories:
 - php
tags:
 - Aliyun
 - Sms
 - SDK
publish: true
---



这里使用的PHP的框架 `ThinkPHP6.0`，别的语言种类去阿里云下载对应的SDK

## 下载扩展包

```bash
composer require alibabacloud/sdk
```

> 这个是包含阿里的很多服务内容，如果需要短信的就只下短信的服务

## 实现短信发送

- 设置配置文件
- 将`host`、`access_key_id`、`access_key_secret`、`region_id`、`template_code`、`sign_name`在配置里进行配置值
- 新建`sms`目录

>为了方便以后多个服务商的短信发送，这里我们使用接口形式写一个发送短信的方法，具体实现方法，然后根据特定的供应商的进行更改。

***接口类代码***

```php
declare(strict_types=1);
namespace app\common\lib\sms;

interface SmsBase
{
    public static function sendCode(string $phone, int $length);
}
```

***阿里的短信发送方法***

```php
use AlibabaCloud\Client\AlibabaCloud;
use AlibabaCloud\Client\Exception\ClientException;
use AlibabaCloud\Client\Exception\ServerException;
use think\facade\Log;

class AliSms implements SmsBase
{
    /**
     * @desc 阿里云短信发送场景
     * @param string $phone
     * @param int $code
     * @return bool
     * @throws ClientException
     */
    public static function sendCode(string $phone, int $code): bool
    {
        if (empty($phone) || empty($code)) {
            return false;
        }

        AlibabaCloud::accessKeyClient(config('aliyun.access_key_id'), config('aliyun.access_key_secret'))
            ->regionId(config('aliyun.region_id'))
            ->asDefaultClient();

        $templateParam = [
            'code' => $code,
        ];
        try {
            $result = AlibabaCloud::rpc()
                ->product('Dysmsapi')
                ->version('2017-05-25')
                ->action('SendSms')
                ->method('POST')
                ->host(config('aliyun.host'))
                ->options(
                    [
                        'query' => [
                            'RegionId'      => config('aliyun.region_id'),
                            'PhoneNumbers'  => $phone,
                            'SignName'      => config('aliyun.sign_name'),
                            'TemplateCode'  => config('aliyun.template_code'),
                            'TemplateParam' => json_encode($templateParam),
                        ],
                    ]
                )
                ->request();
            Log::info("alisms-sendCode-{$phone}result".json_encode($result->toArray()));
//            print_r($result->toArray());
        } catch (ClientException $e) {
            Log::error("alisms-sendCode-{$phone}ClientException".$e->getErrorMessage());
            return false;
//            echo $e->getErrorMessage().PHP_EOL;
        } catch (ServerException $e) {
            Log::error("alisms-sendCode-{$phone}ServerException".$e->getErrorMessage());
            return false;
//            echo $e->getErrorMessage().PHP_EOL;
        }

        if (isset($result['Code']) && $result['Code'] == "OK") {
            return true;
        }
        return false;
    }
}
```

## 高并发下解决短信流量控制

```php
$a = rand(0,99);
if($a < 80) {
    // 阿里云逻辑
} else {
    // 百度云逻辑
}
```

是不是感觉很讶异，我也感觉很讶异，但是"人家"是这么说的。我也就记录一下。可能有用。