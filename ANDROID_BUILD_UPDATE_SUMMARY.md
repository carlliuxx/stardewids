# Android 构建配置更新总结

## 更新目的
- 满足 Google Play 对目标 API 级别 35 的要求
- 修复构建错误和兼容性问题

## 所有更改

### 1. API 级别更新 (两个项目)

**android/app/build.gradle**
```gradle
compileSdkVersion 35  // 从 33
targetSdkVersion 35   // 从 33
buildToolsVersion "35.0.0"  // 从 "33.0.2"
```

**android-webview/app/build.gradle**
```gradle
compileSdk 35  // 从 34
targetSdk 35    // 从 34
```

### 2. Gradle 插件更新

**android/build.gradle**
```gradle
classpath 'com.android.tools.build:gradle:8.1.1'  // 从 7.4.2
```

### 3. Gradle Wrapper 更新

**android/gradle/wrapper/gradle-wrapper.properties**
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.0-bin.zip  // 从 7.5.1
```

### 4. Java 版本更新 (两个项目)

**android/app/build.gradle** 和 **android-webview/app/build.gradle**
```gradle
compileOptions {
    sourceCompatibility JavaVersion.VERSION_17  // 从 VERSION_1_8
    targetCompatibility JavaVersion.VERSION_17  // 从 VERSION_1_8
}
```

### 5. 构建配置更新 (两个项目)

**android/gradle.properties** 和 **android-webview/gradle.properties**
```properties
# 添加以抑制 compileSdk 35 警告
android.suppressUnsupportedCompileSdk=35
```

### 6. GitHub Actions 更新

**.github/workflows/build-aab-release.yml** 和 **.github/workflows/build-signed-apk.yml**
```yaml
BUILD_TOOLS_VERSION: "35.0.0"  // 从 "34.0.0"
```

## 版本对照表

| 组件 | 旧版本 | 新版本 |
|------|--------|--------|
| Target SDK | 33 | 35 |
| Compile SDK | 33 | 35 |
| Build Tools | 33.0.2 | 35.0.0 |
| Android Gradle Plugin | 7.4.2 | 8.1.1 |
| Gradle | 7.5.1 | 8.0 |
| Java | 8 | 17 |

## 测试命令

```bash
# 清理旧构建
cd android
./gradlew clean

# 构建调试版
./gradlew assembleDebug

# 构建发布版 AAB
./gradlew bundleRelease
```

## 注意事项

1. 这些更改不影响应用的最低支持版本（仍为 API 21）
2. Java 17 是 Gradle 8.0 的最低要求
3. 虽然 AGP 8.1.1 官方支持到 SDK 34，但通过配置可以支持 SDK 35
4. GitHub Actions 环境已包含所需的 Java 17 和 Android SDK

## 下一步

1. 提交所有更改
2. 推送到 GitHub
3. 运行 GitHub Actions 构建
4. 下载新的 AAB 文件
5. 上传到 Google Play Console