#!/bin/bash

# 星露谷物语物品代码修改器 APK 构建脚本

echo "开始构建 APK..."

# 进入 android-apk 目录
cd android-apk

# 清理之前的构建
./gradlew clean

# 构建 Debug APK
echo "构建 Debug APK..."
./gradlew assembleDebug

# 构建 Release APK（未签名）
echo "构建 Release APK..."
./gradlew assembleRelease

echo "构建完成！"
echo "Debug APK 位置: app/build/outputs/apk/debug/app-debug.apk"
echo "Release APK 位置: app/build/outputs/apk/release/app-release-unsigned.apk"