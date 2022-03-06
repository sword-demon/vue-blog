---
title: '基于JWT的用户token认证'
date: 2022-03-06 15:02:15
# 永久链接
permalink: '/springboot/jwttoken'
sidebar: 'auto'
isShowComment: true
categories:
 - springboot
tags:
 - null
---



## 基于session的用户身份验证

验证过程：

>   服务端验证浏览器携带的用户名和密码，验证通过后，生成用户凭证保存在服务端(`session`)，浏览器再次访问时，服务端查询`session`，实现登录状态保持。

缺点：

>   随着用户的增多，服务端压力增大；
>
>   若浏览器`cookie`被攻击者拦截，容易收到跨站请求伪造攻击；
>
>   分布式系统下扩展性不强



## 基于Token的用户身份验证

验证过程：

>   服务端验证浏览器所携带的用户名和密码，验证通过后生成用户令牌(`token`)并返回给浏览器，浏览器(前端会将`token`放入`header`或者以`post`的形式)再次访问时携带`token`，服务端校验`token`并返回相关的数据。



优点：

-   token不存储在服务器，不会造成服务器的压力
-   token可以存储在非`cookie`中，安全性高
-   分布式系统下扩展性强



## Java实现

引入依赖

```xml
<dependency>
    <groupId>com.auth0</groupId>
    <artifactId>java-jwt</artifactId>
    <version>3.18.2</version>
</dependency>
```



`token`生成和验证类

```java
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.RSAKeyProvider;

// 自定义异常
import com.wjstar.project.domain.exception.ConditionException;

import java.util.Calendar;
import java.util.Date;

public class TokenUtil {

    public static final String ISSUER = "签发者";

    public static String generateToken(Long userId) throws Exception {

        // 定义加密算法
        // 使用 RSA 加密
        // 传入公钥和私钥
        Algorithm algorithm = Algorithm.RSA256(
                RSAUtil.getPublicKey(),
                RSAUtil.getPrivateKey()
        );

        // 生成过期时间用
        Calendar calendar = Calendar.getInstance();
        // 设置当前时间
        calendar.setTime(new Date());
        // 设置过期时间 30秒
        calendar.add(Calendar.SECOND, 30);

        return JWT.create().withKeyId(String.valueOf(userId))
                .withIssuer(ISSUER)
                .withExpiresAt(calendar.getTime())
                .sign(algorithm);
    }

    /**
     * 验证用户令牌
     * @param token String
     * @return Long
     */
    public static Long verifyToken(String token) {
        RSAKeyProvider keyProvider;
        Algorithm algorithm = null;
        // 这个使用 try catch 包裹，不能直接放在方法上抛出
        try {

            // 定义加解密算法
            algorithm = Algorithm.RSA256(
                    RSAUtil.getPublicKey(),
                    RSAUtil.getPrivateKey()
            );

            JWTVerifier verifier = JWT.require(algorithm).build();
            // 解密后的jwt
            DecodedJWT decodedJWT = verifier.verify(token);
            // 获取到相关的用户id
            String userId = decodedJWT.getKeyId();
            return Long.valueOf(userId);
        } catch (TokenExpiredException e) {
            // token 过期
            throw new ConditionException("555", "token过期!");
        } catch (Exception e) {
            throw new ConditionException("非法用户token");
        }
    }
}

```



从前端发送的请求头里获取`token`并解析用户身份

```java
import com.wjstar.project.domain.exception.ConditionException;
import com.wjstar.project.service.util.TokenUtil;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class UserSupport {

    public Long getCurrentUserId() {
        // 从 header 里获取 token
        ServletRequestAttributes requestAttributes = (ServletRequestAttributes)RequestContextHolder.getRequestAttributes();
        // 获取到token
        assert requestAttributes != null;
        String token = requestAttributes.getRequest().getHeader("token");
        Long userId = TokenUtil.verifyToken(token);

        if (userId < 0) {
            throw new ConditionException("非法用户");
        }

        return userId;
    }
}

```

获取到`userId`之后就可以进行一系列的查询数据库，判断用户是否存在，或者拿到用户信息等操作。



## RSA加密工具类

```java
import org.apache.commons.codec.binary.Base64;

import javax.crypto.Cipher;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;

/**
 * RSA加密
 * 非对称加密，有公钥和私钥之分，公钥用于数据加密，私钥用于数据解密。加密结果可逆
 * 公钥一般提供给外部进行使用，私钥需要放置在服务器端保证安全性。
 * 特点：加密安全性很高，但是加密速度较慢
 */
public class RSAUtil {

    private static final String PUBLIC_KEY = "可以自己整一个公钥";

    // 可以自己整一个私钥
    private static final String PRIVATE_KEY = "";

    public static void main(String[] args) throws Exception {
        String str = RSAUtil.encrypt("123456");
        System.out.println(str);
    }

    public static String getPublicKeyStr() {
        return PUBLIC_KEY;
    }

    public static RSAPublicKey getPublicKey() throws Exception {
        byte[] decoded = Base64.decodeBase64(PUBLIC_KEY);
        return (RSAPublicKey) KeyFactory.getInstance("RSA")
                .generatePublic(new X509EncodedKeySpec(decoded));
    }

    public static RSAPrivateKey getPrivateKey() throws Exception {
        byte[] decoded = Base64.decodeBase64(PRIVATE_KEY);
        return (RSAPrivateKey) KeyFactory.getInstance("RSA")
                .generatePrivate(new PKCS8EncodedKeySpec(decoded));
    }

    public static RSAKey generateKeyPair() throws NoSuchAlgorithmException {
        KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance("RSA");
        keyPairGen.initialize(1024, new SecureRandom());
        KeyPair keyPair = keyPairGen.generateKeyPair();
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        String publicKeyString = new String(Base64.encodeBase64(publicKey.getEncoded()));
        String privateKeyString = new String(Base64.encodeBase64(privateKey.getEncoded()));
        return new RSAKey(privateKey, privateKeyString, publicKey, publicKeyString);
    }

    public static String encrypt(String source) throws Exception {
        byte[] decoded = Base64.decodeBase64(PUBLIC_KEY);
        RSAPublicKey rsaPublicKey = (RSAPublicKey) KeyFactory.getInstance("RSA")
                .generatePublic(new X509EncodedKeySpec(decoded));
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(1, rsaPublicKey);
        return Base64.encodeBase64String(cipher.doFinal(source.getBytes(StandardCharsets.UTF_8)));
    }

    public static Cipher getCipher() throws Exception {
        byte[] decoded = Base64.decodeBase64(PRIVATE_KEY);
        RSAPrivateKey rsaPrivateKey = (RSAPrivateKey) KeyFactory.getInstance("RSA")
                .generatePrivate(new PKCS8EncodedKeySpec(decoded));
        Cipher cipher = Cipher.getInstance("RSA");
        cipher.init(2, rsaPrivateKey);
        return cipher;
    }

    public static String decrypt(String text) throws Exception {
        Cipher cipher = getCipher();
        byte[] inputByte = Base64.decodeBase64(text.getBytes(StandardCharsets.UTF_8));
        return new String(cipher.doFinal(inputByte));
    }

    public static class RSAKey {
        private RSAPrivateKey privateKey;
        private String privateKeyString;
        private RSAPublicKey publicKey;
        public String publicKeyString;

        public RSAKey(RSAPrivateKey privateKey, String privateKeyString, RSAPublicKey publicKey, String publicKeyString) {
            this.privateKey = privateKey;
            this.privateKeyString = privateKeyString;
            this.publicKey = publicKey;
            this.publicKeyString = publicKeyString;
        }

        public RSAPrivateKey getPrivateKey() {
            return this.privateKey;
        }

        public void setPrivateKey(RSAPrivateKey privateKey) {
            this.privateKey = privateKey;
        }

        public String getPrivateKeyString() {
            return this.privateKeyString;
        }

        public void setPrivateKeyString(String privateKeyString) {
            this.privateKeyString = privateKeyString;
        }

        public RSAPublicKey getPublicKey() {
            return this.publicKey;
        }

        public void setPublicKey(RSAPublicKey publicKey) {
            this.publicKey = publicKey;
        }

        public String getPublicKeyString() {
            return this.publicKeyString;
        }

        public void setPublicKeyString(String publicKeyString) {
            this.publicKeyString = publicKeyString;
        }
    }
}

```

