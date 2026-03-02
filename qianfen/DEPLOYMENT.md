# 部署指南 - 潜江千分游戏

## 📋 部署前检查清单

- ✅ 所有代码文件已生成
- ✅ 规则文档已保存
- ✅ README.md 已创建
- ✅ 可以开始部署

## 🚀 方法一：GitHub Pages（推荐，完全免费）

### 步骤1：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建新仓库：`qianfen-game`
3. 设置为 Public 或 Private（推荐 Public）
4. 不要初始化 README（我们已经有了）
5. 点击 "Create repository"

### 步骤2：推送代码到 GitHub

在你的本地终端执行：

```bash
# 初始化 git
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: 潜江千分游戏完整版"

# 重命名分支为 main
git branch -M main

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/qianfen-game.git

# 推送到 GitHub
git push -u origin main
```

### 步骤3：启用 GitHub Pages

1. 进入你的仓库页面
2. 点击 **Settings** 标签页
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 部分：
   - 选择 **Deploy from a branch**
   - Branch 选择：`main`
   - Folder 选择：`/ (root)`
5. 点击 **Save**

### 步骤4：等待部署完成

- GitHub 会自动构建和部署
- 通常需要 2-5 分钟
- 刷新 Pages 页面，会显示你的网站地址

### 步骤5：访问你的游戏

地址格式：`https://YOUR_USERNAME.github.io/qianfen-game/`

示例：`https://zhangsan.github.io/qianfen-game/`

## 🌐 方法二：Vercel（超快部署，完全免费）

### 步骤1：安装 Vercel CLI

```bash
npm install -g vercel
```

### 步骤2：部署

```bash
# 在项目根目录执行
vercel
```

按照提示操作：
- ? Set up and deploy “~/qianfen-game”? [Y/n] → 按 Y
- ? Which scope do you want to deploy to? → 选择你的账号
- ? Link to existing project? → 选择 No
- ? What's your project's name? → 输入 qianfen-game
- ? In which directory is your code located? → 按 Enter（默认 ./）
- ? Want to override the settings? → 选择 No

### 步骤3：访问你的游戏

部署完成后，Vercel 会给你一个类似这样的地址：
`https://qianfen-game.vercel.app`

## 🎯 方法三：Netlify（拖拽部署，最简单）

### 步骤1：构建项目

```bash
npm run build
```

这会在 `dist` 目录生成生产版本的文件。

### 步骤2：拖拽上传

1. 访问 https://www.netlify.com/
2. 注册/登录账号
3. 在 Dashboard 点击 "Add new site" → "Deploy manually"
4. 将 `dist` 文件夹直接拖到上传区域
5. 等待上传完成

### 步骤3：修改设置（可选）

- 点击 "Site configuration"
- 修改 "Site name" 为你喜欢的名字
- 网站地址会变成：`https://your-name.netlify.app`

## 📱 方法四：本地运行（离线使用）

### 步骤1：安装依赖

```bash
npm install
```

### 步骤2：启动开发服务器

```bash
npm run dev
```

### 步骤3：访问本地地址

浏览器打开：`http://localhost:5173`

### 步骤4：打包为可执行文件（可选）

使用 Electron 打包为桌面应用：

```bash
# 安装 Electron
npm install -D electron

# 配置 Electron（需要额外配置）
# 参考：https://www.electronjs.org/docs/latest/
```

## 🔧 常见问题

### 问题1：GitHub Pages 部署后样式丢失

**原因**：可能是路径配置问题

**解决**：
1. 检查 `vite.config.ts` 中的 `base: './'` 配置
2. 确认 `vite.config.ts` 已正确配置

### 问题2：推送代码时出现错误

**错误信息**：`fatal: remote origin already exists`

**解决**：
```bash
# 移除远程仓库
git remote remove origin

# 重新添加
git remote add origin https://github.com/YOUR_USERNAME/qianfen-game.git

# 重新推送
git push -u origin main
```

### 问题3：npm install 失败

**解决**：
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 问题4：Vercel 部署失败

**原因**：可能是依赖版本问题

**解决**：
1. 检查 `package.json` 中的依赖版本
2. 确保所有依赖都是最新稳定版
3. 删除 `package-lock.json` 重新安装

## 📊 部署方式对比

| 方式 | 成本 | 速度 | 难度 | 推荐度 |
|------|------|------|------|--------|
| GitHub Pages | 免费 | 5分钟 | 简单 | ⭐⭐⭐⭐⭐ |
| Vercel | 免费 | 2分钟 | 简单 | ⭐⭐⭐⭐⭐ |
| Netlify | 免费 | 3分钟 | 最简单 | ⭐⭐⭐⭐⭐ |
| 本地运行 | 免费 | 即时 | 简单 | ⭐⭐⭐⭐ |

## 🎉 部署成功后

分享给你的朋友吧！

- GitHub Pages：`https://YOUR_USERNAME.github.io/qianfen-game/`
- Vercel：`https://qianfen-game.vercel.app/`
- Netlify：`https://your-name.netlify.app/`

## 🔄 更新游戏

修改代码后，重新部署：

**GitHub Pages**：
```bash
git add .
git commit -m "Update: 描述你的修改"
git push
# 自动部署，等待几分钟
```

**Vercel**：
```bash
vercel --prod
```

**Netlify**：
重新拖拽 `dist` 文件夹到上传区域

## 📞 需要帮助？

如果遇到问题：
1. 检查错误信息
2. 查看官方文档
3. 尝试另一种部署方式

祝你部署顺利！🎮
