# 上传到 GitHub 的详细步骤

## 文件夹内容说明

`github-minimal` 文件夹包含了编译 APK 所需的最小文件集：

```
github-minimal/
├── .github/
│   └── workflows/
│       ├── build-apk.yml          # 构建未签名 APK 的工作流
│       └── build-signed-apk.yml   # 构建签名 APK 的工作流
├── android-apk/                   # Android 项目文件
│   ├── app/                       # 应用源代码
│   ├── gradle/                    # Gradle 配置
│   │   └── wrapper/
│   │       ├── gradle-wrapper.jar # Gradle Wrapper（必需）
│   │       └── gradle-wrapper.properties
│   ├── build.gradle              # 项目构建配置
│   ├── settings.gradle           # 项目设置
│   ├── gradle.properties         # Gradle 属性
│   ├── gradlew                   # Gradle 脚本（Unix）
│   └── SIGNING_SETUP.md          # 签名配置说明
├── .gitignore                    # Git 忽略文件
└── README.md                     # 项目说明
```

## 上传步骤

### 方法一：通过 Git 命令行

1. **初始化 Git 仓库**
   ```bash
   cd github-minimal
   git init
   ```

2. **添加所有文件**
   ```bash
   git add .
   git commit -m "Initial commit for APK builder"
   ```

3. **在 GitHub 创建新仓库**
   - 登录 GitHub
   - 点击右上角的 "+" → "New repository"
   - 输入仓库名称（如：stardew-ids-apk-builder）
   - 选择 Public 或 Private
   - 不要初始化 README（我们已有）
   - 点击 "Create repository"

4. **连接远程仓库并推送**
   ```bash
   git remote add origin https://github.com/您的用户名/仓库名.git
   git branch -M main
   git push -u origin main
   ```

### 方法二：通过 GitHub 网页上传

1. **在 GitHub 创建新仓库**
   - 登录 GitHub
   - 点击 "+" → "New repository"
   - 输入仓库名称
   - 初始化时选择 "Add a README file"
   - 创建仓库

2. **上传文件**
   - 在仓库页面点击 "Add file" → "Upload files"
   - 将 `github-minimal` 文件夹内的所有内容拖拽到上传区域
   - 注意：要上传文件夹内的内容，不是文件夹本身
   - 填写 commit 信息
   - 点击 "Commit changes"

### 方法三：使用 GitHub Desktop

1. **创建新仓库**
   - 在 GitHub Desktop 中选择 "File" → "New Repository"
   - 设置仓库名称和本地路径

2. **复制文件**
   - 将 `github-minimal` 内的所有文件复制到新仓库目录

3. **提交并推送**
   - 在 GitHub Desktop 中提交更改
   - 点击 "Publish repository" 推送到 GitHub

## 验证上传

上传完成后，检查以下内容：

1. **文件结构**
   - 确保 `.github/workflows/` 目录存在
   - 确保 `android-apk/gradle/wrapper/gradle-wrapper.jar` 文件存在

2. **Actions 页面**
   - 进入仓库的 Actions 页面
   - 应该能看到两个工作流：
     - Build Android APK
     - Build Signed APK

3. **测试构建**
   - 在 Actions 页面手动触发一次构建
   - 等待构建完成
   - 下载生成的 APK 文件

## 常见问题

### Q: 上传后 Actions 没有显示工作流
A: 检查 `.github/workflows/` 目录是否正确，文件名是否为 `.yml` 结尾

### Q: 构建失败提示找不到 gradle-wrapper.jar
A: 确保 `android-apk/gradle/wrapper/gradle-wrapper.jar` 文件已上传

### Q: 想要更小的仓库
A: 可以删除 `android-apk/app/` 中的示例代码，只保留您的实际应用代码

## 后续维护

- 更新应用代码：修改 `android-apk/app/` 中的文件
- 更新构建配置：修改 `android-apk/build.gradle`
- 更新工作流：修改 `.github/workflows/` 中的 yml 文件