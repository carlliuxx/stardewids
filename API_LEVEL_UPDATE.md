# Android API 级别更新说明

## 更新内容

为了符合 Google Play 的最新要求，已将应用的目标 API 级别从 33 更新到 35。

### 更新的文件

1. **android/app/build.gradle**
   - `compileSdkVersion`: 33 → 35
   - `targetSdkVersion`: 33 → 35
   - `buildToolsVersion`: "33.0.2" → "35.0.0"

2. **android-webview/app/build.gradle**
   - `compileSdk`: 34 → 35
   - `targetSdk`: 34 → 35

3. **GitHub Actions 工作流**
   - `.github/workflows/build-aab-release.yml`: BUILD_TOOLS_VERSION "34.0.0" → "35.0.0"
   - `.github/workflows/build-signed-apk.yml`: BUILD_TOOLS_VERSION "34.0.0" → "35.0.0"

## API 级别说明

- **API 35** = Android 15
- **API 33** = Android 13
- **minSdkVersion 21** = Android 5.0 (Lollipop) - 仍然支持旧设备

## 下一步操作

1. **推送更改到 GitHub**
   ```bash
   git add .
   git commit -m "Update target API level to 35 for Google Play requirements"
   git push
   ```

2. **重新构建 AAB**
   - 在 GitHub Actions 中运行 "Build Release AAB for Google Play" 工作流
   - 下载新生成的 AAB 文件

3. **测试应用**
   - 在 Android 15 设备或模拟器上测试
   - 确保所有功能正常工作

## 注意事项

- 这次更新不影响应用的最低支持版本（仍然是 Android 5.0）
- 应用将使用最新的 Android API 构建，提供更好的安全性和性能
- 如果使用了任何已弃用的 API，可能需要进行相应调整

## 兼容性

更新后的应用仍然兼容：
- 最低支持：Android 5.0 (API 21)
- 目标版本：Android 15 (API 35)
- 覆盖 99%+ 的 Android 设备