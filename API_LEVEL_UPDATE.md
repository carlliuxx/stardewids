# Android API 级别更新说明

## 已完成的更新

为了满足 Google Play 的最新要求，已将应用的目标 API 级别从 33 更新到 35。

### 1. 更新的文件

#### `/android/app/build.gradle`
- `compileSdkVersion`: 33 → 35
- `buildToolsVersion`: "33.0.2" → "35.0.0"
- `targetSdkVersion`: 33 → 35

#### `/android-webview/app/build.gradle`
- `compileSdk`: 34 → 35
- `targetSdk`: 34 → 35

#### `/.github/workflows/build-aab-release.yml`
- `BUILD_TOOLS_VERSION`: "34.0.0" → "35.0.0"

#### `/.github/workflows/build-signed-apk.yml`
- `BUILD_TOOLS_VERSION`: "34.0.0" → "35.0.0"

### 2. API 级别说明

- **API 35** 对应 Android 15
- **最低支持版本** (minSdkVersion) 保持为 21 (Android 5.0)
- **编译版本** (compileSdkVersion) 更新为 35
- **目标版本** (targetSdkVersion) 更新为 35

### 3. 重新构建应用

更新完成后，需要重新构建应用：

```bash
# 清理旧的构建文件
cd android
./gradlew clean

# 构建新的 AAB 文件
./gradlew bundleRelease
```

或者通过 GitHub Actions 运行 "Build Release AAB for Google Play" workflow。

### 4. 注意事项

1. **测试兼容性**：虽然目标 API 提升到 35，但最低支持版本仍是 21，确保在不同版本的设备上测试。

2. **新特性**：API 35 (Android 15) 可能引入了新的权限要求或行为变更，请查看 [Android 15 行为变更](https://developer.android.com/about/versions/15/behavior-changes-all)。

3. **依赖库**：当前使用的依赖库版本应该兼容 API 35：
   - `androidx.appcompat:appcompat:1.6.1`
   - `androidx.webkit:webkit:1.6.1`

### 5. Google Play 要求

根据 Google Play 政策：
- 2024 年 8 月 31 日起，新应用必须以 API 级别 34 或更高版本为目标
- 2024 年 11 月 1 日起，应用更新必须以 API 级别 34 或更高版本为目标
- 我们直接更新到 API 35，确保满足未来的要求

### 6. 后续步骤

1. 推送这些更改到 GitHub
2. 运行 GitHub Actions 构建新的 AAB
3. 在 Google Play Console 上传新的 AAB
4. 确保应用通过 Google Play 的审核

## 验证命令

构建完成后，可以使用以下命令验证 AAB 的目标 API 级别：

```bash
# 使用 aapt2 工具
aapt2 dump badging app-release.aab | grep targetSdkVersion
```

应该显示：`targetSdkVersion:'35'`