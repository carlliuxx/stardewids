# Google Play 发布指南

## 生成 AAB 文件

1. 在 GitHub Actions 中运行 "Build Release AAB for Google Play" workflow
2. 输入版本号和版本代码
3. 下载生成的签名 AAB 文件

## 设置签名密钥

### 生成上传密钥（用于 Play App Signing）
```bash
# 生成上传密钥
keytool -genkey -v -keystore upload.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000

# 转换为 Base64（用于 GitHub Secrets）
base64 -i upload.keystore -o upload-keystore.base64
```

### GitHub Secrets 配置
在仓库设置中添加以下 Secrets：
- `ANDROID_KEYSTORE`: base64 编码的 keystore 内容
- `ANDROID_KEY_ALIAS`: upload
- `ANDROID_KEYSTORE_PASSWORD`: 你的 keystore 密码
- `ANDROID_KEY_PASSWORD`: 你的密钥密码

## Google Play Console 设置

1. **创建应用**
   - 登录 [Google Play Console](https://play.google.com/console)
   - 创建新应用
   - 填写应用详情

2. **启用 Play App Signing**
   - 在"设置" > "应用完整性" > "应用签名"
   - 选择"使用 Google 生成的应用签名密钥"
   - 下载 PEPK 工具（如果需要迁移现有密钥）

3. **上传 AAB**
   - 进入"版本管理" > "生产"
   - 创建新版本
   - 上传 AAB 文件
   - 填写版本说明

4. **必需的应用信息**
   - 应用图标（512x512）
   - 功能图形（1024x500）
   - 手机截图（至少 2 张）
   - 平板截图（建议提供）
   - 应用说明（简短和详细）
   - 隐私政策 URL

## 版本管理建议

- **versionCode**: 每次发布递增（整数）
- **versionName**: 用户可见的版本号（如 "1.0.0"）

## 发布前检查清单

- [ ] 更新 versionCode 和 versionName
- [ ] 测试 AAB 文件
- [ ] 准备发布说明
- [ ] 检查应用权限
- [ ] 更新隐私政策（如需要）
- [ ] 准备营销材料