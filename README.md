# Stardew IDs APK Builder

这是一个精简的仓库，专门用于通过 GitHub Actions 自动构建 Android APK。

## 快速开始

1. 将此文件夹内容上传到 GitHub
2. 在 Actions 页面手动触发构建
3. 下载生成的 APK

## 已修复的问题

- ✅ 修复了 gradlew 文件的 JVM 参数错误
- ✅ 包含了必需的 gradle-wrapper.jar

## 构建触发方式

- 手动：Actions → Build Android APK → Run workflow
- 自动：推送代码到 main 分支

## 签名版本

如需签名版本，请参考 `android-apk/SIGNING_SETUP.md` 配置 GitHub Secrets。

详细使用说明请查看 `UPLOAD_GUIDE.md`。