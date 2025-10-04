#!/bin/bash
# 测试 AAB 文件的脚本

# 安装 bundletool（如果还没有）
if ! command -v bundletool &> /dev/null; then
    echo "下载 bundletool..."
    curl -L -o bundletool.jar https://github.com/google/bundletool/releases/latest/download/bundletool-all.jar
fi

# 从 AAB 生成 APK Set
echo "从 AAB 生成 APK..."
java -jar bundletool.jar build-apks \
    --bundle=app-release.aab \
    --output=app.apks \
    --mode=universal

# 提取通用 APK
echo "提取 APK..."
unzip -o app.apks universal.apk

# 安装到设备（如果连接了设备）
if adb devices | grep -q "device$"; then
    echo "安装到设备..."
    adb install universal.apk
else
    echo "没有检测到连接的设备"
fi

echo "完成！"