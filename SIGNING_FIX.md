# GitHub Actions 签名修复说明

## 问题描述

原本使用的 `r0adkll/sign-android-release@v1` action 由于权限限制无法在非作者仓库中使用。

## 解决方案

已更新为使用原生工具进行签名：

### 1. AAB 签名（用于 Google Play）

使用 `jarsigner` 进行签名：
```bash
jarsigner -verbose \
    -sigalg SHA256withRSA \
    -digestalg SHA-256 \
    -keystore keystore.jks \
    -storepass $KEYSTORE_PASSWORD \
    -keypass $KEY_PASSWORD \
    app-release.aab \
    $KEY_ALIAS
```

### 2. APK 签名

使用 `apksigner` 进行签名：
```bash
apksigner sign \
    --ks keystore.jks \
    --ks-pass pass:$KEYSTORE_PASSWORD \
    --ks-key-alias $KEY_ALIAS \
    --key-pass pass:$KEY_PASSWORD \
    --out app-signed.apk \
    app-release.apk
```

## 设置签名

### GitHub Secrets 配置

在仓库的 Settings > Secrets and variables > Actions 中添加以下 secrets：

1. **ANDROID_KEYSTORE**
   - 你的 keystore 文件的 base64 编码内容
   - 生成方式：`base64 -i your-keystore.jks` (macOS/Linux)
   - 或：`base64 your-keystore.jks > keystore.txt` (Windows)

2. **ANDROID_KEY_ALIAS**
   - keystore 中的密钥别名

3. **ANDROID_KEYSTORE_PASSWORD**
   - keystore 密码

4. **ANDROID_KEY_PASSWORD**
   - 密钥密码（通常与 keystore 密码相同）

### 本地签名

如果需要在本地签名，可以使用提供的脚本：
```bash
./sign-android.sh path/to/your/app.aab
```

脚本会提示输入签名信息，并自动完成签名过程。

## 生成签名密钥

如果还没有签名密钥，可以创建一个：

```bash
keytool -genkey -v \
    -keystore my-release-key.jks \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -alias my-key-alias
```

## 验证签名

### 验证 AAB：
```bash
jarsigner -verify -verbose app-signed.aab
```

### 验证 APK：
```bash
apksigner verify --verbose app-signed.apk
```

## 注意事项

1. 签名密钥非常重要，一定要妥善保管
2. 不要将密钥文件提交到版本控制系统
3. 建议使用 Google Play App Signing 服务进行额外保护
4. 定期备份密钥文件