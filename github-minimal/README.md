# Stardew IDs APK Builder

这是一个最小化的仓库，专门用于通过 GitHub Actions 自动构建 Android APK。

## 功能

- 自动构建 Debug APK
- 自动构建 Release APK（未签名）
- 支持签名版本构建（需配置 Secrets）

## 如何使用

### 1. Fork 或上传此仓库到 GitHub

### 2. 触发构建

#### 方式一：手动触发
1. 进入 Actions 页面
2. 选择 "Build Android APK"
3. 点击 "Run workflow"

#### 方式二：推送代码
- 修改 `android-apk` 目录中的任何文件并推送

### 3. 下载 APK
- 构建完成后，在 Actions 页面下载 Artifacts

## 签名版本配置

如需构建签名版本，请在仓库的 Settings → Secrets 中配置：
- `ANDROID_KEYSTORE`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_PASSWORD`

详细说明见 `android-apk/SIGNING_SETUP.md`