# 修复 GitHub Actions 构建错误

## 错误信息
```
Error: Could not find or load main class "-Xmx64m"
Caused by: java.lang.ClassNotFoundException: "-Xmx64m"
```

## 问题原因
`gradlew` 文件中的 `DEFAULT_JVM_OPTS` 变量引号使用不正确。

## 修复方法

### 方法一：直接编辑 gradlew 文件

1. 找到 `android-apk/gradlew` 文件的第 14 行
2. 将：
   ```bash
   DEFAULT_JVM_OPTS='"-Xmx64m" "-Xms64m"'
   ```
   修改为：
   ```bash
   DEFAULT_JVM_OPTS='-Xmx64m -Xms64m'
   ```

### 方法二：使用标准的 gradlew 文件

如果修改后仍有问题，可以下载标准的 gradlew 文件：

1. 下载官方 gradlew：
   ```bash
   curl -o android-apk/gradlew https://raw.githubusercontent.com/gradle/gradle/master/gradlew
   chmod +x android-apk/gradlew
   ```

2. 或者创建一个新的简化版 gradlew：
   ```bash
   #!/bin/sh
   DIRNAME=$(dirname "$0")
   APP_HOME=$(cd "$DIRNAME" && pwd)
   DEFAULT_JVM_OPTS="-Xmx64m -Xms64m"
   CLASSPATH=$APP_HOME/gradle/wrapper/gradle-wrapper.jar
   exec java $DEFAULT_JVM_OPTS -jar "$CLASSPATH" "$@"
   ```

## 验证修复

修复后，重新触发 GitHub Actions 构建，应该能够正常执行。

## 其他注意事项

1. 确保 `gradle/wrapper/gradle-wrapper.jar` 文件存在
2. 确保 gradlew 文件有执行权限（GitHub Actions 中会自动设置）
3. 如果仍有问题，检查 Java 版本是否正确（应使用 JDK 17）