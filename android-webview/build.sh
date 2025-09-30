#!/bin/bash

# 复制HTML文件到assets目录
mkdir -p app/src/main/assets
cp ../stardew-item-ids.html app/src/main/assets/

# 构建APK
./gradlew clean
./gradlew assembleDebug
./gradlew assembleRelease

echo "APK构建完成！"
echo "Debug APK: app/build/outputs/apk/debug/app-debug.apk"
echo "Release APK: app/build/outputs/apk/release/app-release-unsigned.apk"