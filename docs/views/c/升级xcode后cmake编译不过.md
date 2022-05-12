---
title: '升级xcode后cmake编译不过的问题'
date: 2022-05-12 21:58:15
# 永久链接
permalink: '/c/xcodemake'
sidebar: 'auto'
isShowComment: true
categories:
 - c
tags:
 - null
---

## 一、问题


升级 xcode 后，在Clion 中的 cmake 工程编译不过了。reload cmake 工程后，提示如下错误**

CMake Warning at /Applications/CLion.app/Contents/bin/cmake/mac/share/cmake-3.15/Modules/Platform/Darwin-Initialize.cmake:131 (message):
Ignoring CMAKE_OSX_SYSROOT value:

/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.14.sdk

because the directory does not exist.

而直接编译的话，又会得到类似于如下的错误：

`fatal error: ‘stdio.h’ file not found`

总之就是 c/c++ 中的头文件找不到了

## 二、原因

Clion 中的 cmake 依赖了环境变量 CMAKE_OSX_SYSROOT 的设置，这里升级了 Xcode 后，其路径就发生了变化了。

## 三、解决

1.   build -> clean 工程
2.   删除 cmake 生成的编译目录 cmake-build-debug
3.   再 file -> reload cmake 工程
4.   再重新编译工程，解决。

