# 星露谷物语物品代码修改器 Android APK 项目

## 已完成的功能

### 1. Android项目结构创建 ✅
- 创建了基于WebView的Android应用
- 配置了AndroidManifest.xml
- 设置了MainActivity与WebView集成
- 添加了Android原生剪贴板接口支持

### 2. 功能修改 ✅
- **物品代码格式**: 已经使用 `[74]` 格式（原代码已经是这种格式）
- **多选功能**: 保留现有的多选checkbox
- **生成总代码按钮**: 已实现，位于页面顶部
- **清空设置按钮**: 已实现，位于页面顶部
- **物品数量提示**: 当生成超过3个物品时会显示警告提示
- **操作栏修改**: 右侧已使用齿轮图标（⚙️）作为设置按钮
- **物品设置弹窗**: 包含数量输入、品质选择和堆叠信息显示
- **堆叠规则判断**: 已实现canItemStack函数判断物品是否可堆叠
- **手指滑动效果**: 原项目未包含滑动效果，无需移除

### 3. GitHub Actions配置 ✅
- 配置了自动构建工作流（.github/workflows/build-apk.yml）
- 每次推送到main分支时自动构建APK
- 支持Debug和Release版本构建
- 构建产物可在GitHub Actions的Artifacts中下载

### 4. 剪贴板兼容性优化 ✅
- 优先使用Android原生接口
- 降级支持Web Clipboard API
- 最后使用传统的document.execCommand方法

## 使用说明

### 本地构建
```bash
cd android
./gradlew assembleDebug    # 构建Debug版本
./gradlew assembleRelease   # 构建Release版本
```

### GitHub Actions自动构建
1. 推送代码到main分支
2. GitHub Actions会自动构建APK
3. 在Actions页面的Artifacts中下载APK文件

### 签名配置（可选）
如需签名APK，请在GitHub仓库设置中添加以下Secrets：
- SIGNING_KEY
- ALIAS
- KEY_STORE_PASSWORD
- KEY_PASSWORD

## 项目结构
```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/stardewids/app/
│   │   │   └── MainActivity.java
│   │   ├── res/
│   │   │   ├── values/
│   │   │   │   ├── strings.xml
│   │   │   │   └── styles.xml
│   │   │   └── drawable/
│   │   │       └── icon.png
│   │   ├── assets/www/
│   │   │   ├── index.html
│   │   │   └── public/
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── build.gradle
├── settings.gradle
├── gradle.properties
├── gradlew
└── README.md
```

## 注意事项
- APK需要Android 5.0（API 21）或更高版本
- 首次构建需要下载Gradle依赖，可能需要较长时间
- 剪贴板功能已优化为Android原生实现