#!/bin/bash

# 本地签名 AAB/APK 脚本

echo "Android AAB/APK 签名工具"
echo "========================"

# 检查参数
if [ $# -lt 1 ]; then
    echo "用法: $0 <aab或apk文件路径>"
    echo "示例: $0 android/app/build/outputs/bundle/release/app-release.aab"
    exit 1
fi

INPUT_FILE=$1
OUTPUT_DIR=$(dirname "$INPUT_FILE")
FILENAME=$(basename "$INPUT_FILE")
EXTENSION="${FILENAME##*.}"
BASENAME="${FILENAME%.*}"

# 检查文件是否存在
if [ ! -f "$INPUT_FILE" ]; then
    echo "错误: 文件不存在 - $INPUT_FILE"
    exit 1
fi

# 读取签名信息
echo ""
read -p "请输入 keystore 文件路径: " KEYSTORE_PATH
read -sp "请输入 keystore 密码: " KEYSTORE_PASSWORD
echo ""
read -p "请输入密钥别名 (key alias): " KEY_ALIAS
read -sp "请输入密钥密码: " KEY_PASSWORD
echo ""

# 检查 keystore 文件
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "错误: Keystore 文件不存在 - $KEYSTORE_PATH"
    exit 1
fi

# 签名文件
echo ""
echo "正在签名 $EXTENSION 文件..."

if [ "$EXTENSION" == "aab" ]; then
    # 签名 AAB
    OUTPUT_FILE="$OUTPUT_DIR/${BASENAME}-signed.aab"

    jarsigner -verbose \
        -sigalg SHA256withRSA \
        -digestalg SHA-256 \
        -keystore "$KEYSTORE_PATH" \
        -storepass "$KEYSTORE_PASSWORD" \
        -keypass "$KEY_PASSWORD" \
        -signedjar "$OUTPUT_FILE" \
        "$INPUT_FILE" \
        "$KEY_ALIAS"

    if [ $? -eq 0 ]; then
        echo "AAB 签名成功！"
        echo "输出文件: $OUTPUT_FILE"

        # 验证签名
        echo ""
        echo "验证签名..."
        jarsigner -verify -verbose "$OUTPUT_FILE"
    else
        echo "AAB 签名失败！"
        exit 1
    fi

elif [ "$EXTENSION" == "apk" ]; then
    # 签名 APK
    OUTPUT_FILE="$OUTPUT_DIR/${BASENAME}-signed.apk"

    # 查找 apksigner
    if command -v apksigner &> /dev/null; then
        APKSIGNER="apksigner"
    elif [ -n "$ANDROID_HOME" ]; then
        # 查找最新的 build-tools
        BUILD_TOOLS_DIR="$ANDROID_HOME/build-tools"
        LATEST_BUILD_TOOLS=$(ls -1 "$BUILD_TOOLS_DIR" | sort -V | tail -n 1)
        APKSIGNER="$BUILD_TOOLS_DIR/$LATEST_BUILD_TOOLS/apksigner"
    else
        echo "错误: 找不到 apksigner。请确保已安装 Android SDK Build Tools。"
        exit 1
    fi

    "$APKSIGNER" sign \
        --ks "$KEYSTORE_PATH" \
        --ks-pass "pass:$KEYSTORE_PASSWORD" \
        --ks-key-alias "$KEY_ALIAS" \
        --key-pass "pass:$KEY_PASSWORD" \
        --out "$OUTPUT_FILE" \
        "$INPUT_FILE"

    if [ $? -eq 0 ]; then
        echo "APK 签名成功！"
        echo "输出文件: $OUTPUT_FILE"

        # 验证签名
        echo ""
        echo "验证签名..."
        "$APKSIGNER" verify --verbose "$OUTPUT_FILE"
    else
        echo "APK 签名失败！"
        exit 1
    fi

else
    echo "错误: 不支持的文件类型 - $EXTENSION"
    echo "仅支持 .aab 和 .apk 文件"
    exit 1
fi

echo ""
echo "签名完成！"