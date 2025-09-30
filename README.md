# 星露谷物语物品ID查询工具

这是一个用于查询《星露谷物语》游戏中所有物品ID的工具，支持最新版本1.6.15。

## 功能特点

- 📦 支持2446个游戏物品，覆盖13个分类
- 🔍 强大的搜索和筛选功能
- 📱 响应式设计，支持移动设备
- 🌐 完全离线使用
- 🌍 支持12种语言

## 项目结构

```
├── stardew-item-ids.html    # 独立的网页版文件
├── assets/                  # 游戏资源文件（需要自行提取）
├── dist/                    # 处理后的物品数据文件
├── src/                     # 源代码
│   ├── root.jade           # 主页面模板
│   ├── styles.css          # 样式文件
│   ├── utils.js            # 工具函数
│   └── strings.js          # 多语言字符串
├── scripts/                 # 脚本工具
│   ├── patchItems.js       # 物品数据处理
│   └── generateStatic.js   # 生成静态页面
├── android-webview/         # Android WebView应用
└── .github/workflows/       # GitHub Actions配置
    └── build-apk.yml       # 自动构建Android APK
```

## 使用方法

### 网页版
- 直接打开 `stardew-item-ids.html` 文件即可使用
- 无需服务器，完全离线运行
- 可部署到 GitHub Pages 或任何静态网站服务器

### Android版
- 通过 GitHub Actions 自动构建 APK 文件
- 源代码在 `android-webview/` 目录
- 构建完成后可在 GitHub Actions Artifacts 下载 APK

## 开发说明

### 更新物品数据
```bash
npm install
npm run update-item-list
```

### 本地开发
```bash
npm run dev
```

### 构建静态页面
```bash
npm run build
```

## 许可证

MIT License