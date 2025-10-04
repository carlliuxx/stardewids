# 修复 Android 构建错误

## 问题描述

在将目标 API 级别更新到 35 后，构建失败并出现以下错误：
- Android Gradle Plugin 7.4.2 不支持 compileSdk 35
- aapt2 无法加载 android-35 资源

## 解决方案

### 1. 更新 Android Gradle Plugin 版本

**文件**: `android/build.gradle`
```gradle
dependencies {
    classpath 'com.android.tools.build:gradle:8.1.1'  // 从 7.4.2 更新
}
```

### 2. 更新 Gradle Wrapper 版本

**文件**: `android/gradle/wrapper/gradle-wrapper.properties`
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.0-bin.zip  // 从 7.5.1 更新
```

### 3. 更新 Java 版本配置

**文件**: `android/app/build.gradle`
```gradle
compileOptions {
    sourceCompatibility JavaVersion.VERSION_17  // 从 VERSION_1_8 更新
    targetCompatibility JavaVersion.VERSION_17  // 从 VERSION_1_8 更新
}
```

### 4. 添加构建配置以抑制警告

**文件**: `android/gradle.properties`
```properties
# 添加此行以抑制 compileSdk 35 的警告
android.suppressUnsupportedCompileSdk=35
```

## 版本兼容性说明

- **Android Gradle Plugin 8.1.1** 支持 compileSdk 33-34，但可以通过配置支持 35
- **Gradle 8.0** 是 AGP 8.1.1 的最低要求版本
- **Java 17** 是 Gradle 8.0+ 的最低要求版本

## 后续步骤

1. 清理并重新构建：
   ```bash
   cd android
   ./gradlew clean
   ./gradlew assembleDebug
   ```

2. 如果仍有问题，可能需要：
   - 更新 Android SDK Build-tools 到 35.0.0
   - 确保 GitHub Actions 环境中有正确的 SDK 版本

## GitHub Actions 注意事项

GitHub Actions 环境中已经配置了：
- Java 17 (`JAVA_HOME: /opt/hostedtoolcache/Java_Temurin-Hotspot_jdk/17.0.16-8/x64`)
- Android SDK (`ANDROID_HOME: /usr/local/lib/android/sdk`)

构建应该能够成功完成。