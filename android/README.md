# Android APK 构建说明

本项目已配置 GitHub Actions 自动构建 Android APK。

## 自动构建

每次推送到 `main` 分支时，GitHub Actions 会自动构建 APK 文件。

## 手动构建

1. 进入 android 目录：
   ```bash
   cd android
   ```

2. 构建 Debug 版本：
   ```bash
   ./gradlew assembleDebug
   ```

3. 构建 Release 版本：
   ```bash
   ./gradlew assembleRelease
   ```

## 签名配置（可选）

如果需要签名的 APK，请在 GitHub 仓库设置中添加以下 Secrets：

- `SIGNING_KEY`: Base64 编码的 keystore 文件
- `ALIAS`: 密钥别名
- `KEY_STORE_PASSWORD`: Keystore 密码
- `KEY_PASSWORD`: 密钥密码

### 生成签名密钥

1. 生成 keystore：
   ```bash
   keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. 将 keystore 转换为 Base64：
   ```bash
   base64 my-release-key.keystore > keystore.txt
   ```

3. 将 keystore.txt 的内容作为 `SIGNING_KEY` Secret。

## 下载 APK

构建完成后，可以在 GitHub Actions 的 Artifacts 中下载 APK 文件。