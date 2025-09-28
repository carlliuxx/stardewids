# Stardew Items Clone

基于 neocities 网站的星露谷物品ID查询工具克隆版本。

## 功能特点

### 🔍 搜索和过滤
- 实时搜索物品名称和ID
- 按分类浏览物品
- 支持多语言显示

### 📋 复制功能
- 宠物名称格式复制 🐔
- 玩家名称格式复制 👤  
- 聊天命令格式复制 💬
- 自定义数量和品质设置 ⚙️

### 📦 批量操作
- 多选物品
- 批量复制代码
- 全选/清除选择
- 导出选中物品

### 🎨 用户界面
- 响应式设计，支持移动端
- 现代化 Bootstrap 界面
- 平滑动画效果
- Toast 提示反馈

## 支持的物品分类

- Objects (物品)
- Big Craftables (大型手工制品)
- Tools (工具)
- Weapons (武器)
- Furniture (家具)
- Boots (靴子)
- Pants (裤子)
- Shirts (衬衫)
- Hats (帽子)
- Trinkets (饰品)
- Mannequins (模特)
- Flooring (地板)
- Wallpapers (壁纸)

## 技术栈

- **前端**: HTML5, CSS3, JavaScript (ES6+)
- **UI框架**: Bootstrap 5
- **数据源**: 来自父项目的 JSON 文件
- **图标**: Unicode Emoji

## 项目结构

```
neocities-clone/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── app.js          # 主要逻辑
└── README.md           # 说明文档
```

## 使用方法

1. 打开 `index.html` 文件
2. 选择想要查看的物品分类
3. 使用搜索框查找特定物品
4. 点击复制按钮获取物品代码
5. 使用批量功能处理多个物品

## 代码格式说明

### 宠物名称格式 🐔
```
[O123]  # 普通物品
#$action AddItem O123 5 2 0  # 带数量和品质
```

### 玩家名称格式 👤
```
[O123]  # 适用于角色重命名
```

### 聊天命令格式 💬
```
/item O123 5 2  # 聊天命令格式
```

## 分类前缀对照

| 分类 | 前缀 | 说明 |
|------|------|------|
| Objects | (O) | 普通物品 |
| Big Craftables | (BC) | 大型手工制品 |
| Tools | (T) | 工具 |
| Weapons | (W) | 武器 |
| Furniture | (F) | 家具 |
| Boots | (B) | 靴子 |
| Pants | (P) | 裤子 |
| Shirts | (S) | 衬衫 |
| Hats | (H) | 帽子 |
| Trinkets | (TR) | 饰品 |

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 开发说明

本项目是 https://stardew-items.neocities.org/ 的克隆版本，保持了原网站的核心功能和用户体验，同时进行了以下改进：

1. 更现代的UI设计
2. 更好的响应式支持
3. 增强的批量操作功能
4. 更流畅的动画效果
5. 更完善的错误处理

## 许可证

本项目仅供学习和研究使用。