# Android APK 签名配置指南

本文档说明如何为 GitHub Actions 配置 Android APK 签名。

## 生成签名密钥

如果您还没有签名密钥，请按照以下步骤创建：

```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

在执行过程中，您需要设置：
- Keystore 密码
- Key 密码
- 您的姓名、组织单位、组织、城市、省份、国家代码等信息

## 配置 GitHub Secrets

1. 将生成的 keystore 文件转换为 base64 格式：
```bash
base64 -i my-release-key.keystore -o keystore.base64.txt
```

2. 在 GitHub 仓库中，进入 Settings → Secrets and variables → Actions

3. 添加以下 secrets：
   - `ANDROID_KEYSTORE`: 将 keystore.base64.txt 的内容粘贴到这里
   - `ANDROID_KEY_ALIAS`: 您在生成密钥时使用的别名（例如：my-key-alias）
   - `ANDROID_KEYSTORE_PASSWORD`: Keystore 密码
   - `ANDROID_KEY_PASSWORD`: Key 密码

## 触发签名构建

配置完成后，您可以通过以下方式触发签名构建：

1. 手动触发：在 GitHub Actions 页面点击 "Build Signed APK" workflow，然后点击 "Run workflow"
2. 创建 Release：当您创建新的 GitHub Release 时，会自动触发签名构建

## 注意事项

- 请妥善保管您的 keystore 文件和密码
- 不要将 keystore 文件提交到版本控制系统
- 定期备份您的 keystore 文件，丢失后无法恢复