# GitHub Pages 部署超详细教程
## 潜江千分游戏 - 从零到上线

---

## 📋 准备工作清单

在开始之前，请确保你已经：
- [ ] 有一个 GitHub 账号（如果没有，先注册：https://github.com/signup）
- [ ] 已安装 Git（https://git-scm.com/downloads）
- [ ] 已安装 Node.js（https://nodejs.org/，推荐 LTS 版本）
- [ ] 代码文件已经完整生成

---

## 🚀 第一步：创建 GitHub 仓库

### 1.1 访问 GitHub

打开浏览器，访问：https://github.com/new

### 1.2 填写仓库信息

你会看到一个创建新仓库的页面，填写以下信息：

| 字段 | 填写内容 | 说明 |
|------|----------|------|
| **Repository name** | `qianfen-game` | 仓库名称，建议用英文 |
| **Description** | `潜江千分团队对抗版 - 网页游戏` | 仓库描述，可选 |
| **Public/Private** | 选择 **Public**（公开） | Public 免费且可被访问 |
| **Initialize this repository** | ❌ **不要勾选** | 我们已经有代码了 |

**注意**：
- 仓库名称不能用中文（会有URL编码问题）
- 选择 Public 免费且能被任何人访问
- 不要勾选"Initialize this repository with a README"等选项

### 1.3 创建仓库

点击页面底部的绿色按钮：
```
Create repository
```

创建成功后，会跳转到新创建的仓库页面。

---

## 📤 第二步：推送代码到 GitHub

### 2.1 打开终端/命令行

**Windows 用户**：
- 按 `Win + R`
- 输入 `cmd` 或 `powershell`
- 按回车

**Mac 用户**：
- 按 `Cmd + Space`
- 输入 `Terminal`
- 按回车

### 2.2 进入项目目录

在终端中执行：

```bash
# 进入你的项目目录（根据你的实际路径修改）
cd C:\Users\你的用户名\Desktop\qianfen-game

# 或者 Mac/Linux
cd ~/Desktop/qianfen-game
```

**验证是否进入正确目录**：
```bash
# 查看当前目录的文件
ls
# 或 Windows
dir
```

你应该能看到：
- `package.json`
- `vite.config.ts`
- `src/` 文件夹
- 等等...

### 2.3 初始化 Git 仓库

```bash
git init
```

**输出示例**：
```
Initialized empty Git repository in C:/Users/你的用户名/Desktop/qianfen-game/.git/
```

### 2.4 配置 Git 用户信息（仅第一次需要）

如果这是你第一次使用 Git，需要配置用户信息：

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"
```

**示例**：
```bash
git config --global user.name "zhangsan"
git config --global user.email "zhangsan@example.com"
```

### 2.5 添加所有文件到 Git

```bash
git add .
```

**解释**：
- `git add`：将文件添加到暂存区
- `.`：表示所有文件
- 这一步会将项目中的所有文件添加到 Git

### 2.6 提交代码

```bash
git commit -m "Initial commit: 潜江千分游戏完整版"
```

**解释**：
- `git commit`：提交暂存区的文件
- `-m`：指定提交信息
- 提交信息建议用英文或中文都可以，简洁明了

**输出示例**：
```
[main (root-commit) 1234567] Initial commit: 潜江千分游戏完整版
 23 files changed, 5000 insertions(+)
 create mode 100644 package.json
 create mode 100644 vite.config.ts
 ...
```

### 2.7 重命名分支为 main

```bash
git branch -M main
```

**解释**：
- 将分支重命名为 `main`（GitHub 默认分支）
- 新版本的 GitHub 仓库默认使用 `main` 分支

### 2.8 关联远程仓库

```bash
git remote add origin https://github.com/YOUR_USERNAME/qianfen-game.git
```

**重要**：
- 将 `YOUR_USERNAME` 替换为你的 GitHub 用户名
- 例如：如果你的用户名是 `zhangsan`，命令就是：
  ```bash
  git remote add origin https://github.com/zhangsan/qianfen-game.git
  ```

**验证远程仓库**：
```bash
git remote -v
```

**输出示例**：
```
origin  https://github.com/zhangsan/qianfen-game.git (fetch)
origin  https://github.com/zhangsan/qianfen-game.git (push)
```

### 2.9 推送代码到 GitHub

```bash
git push -u origin main
```

**解释**：
- `git push`：推送代码到远程仓库
- `-u origin main`：设置上游分支，下次直接 `git push` 即可

**首次推送可能需要登录**：
- 如果提示需要认证，按提示输入 GitHub 用户名和密码
- 注意：GitHub 已不再支持密码登录，需要使用 Personal Access Token（PAT）

**生成 Personal Access Token**：
1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 设置过期时间（推荐 90 days）
5. 点击 "Generate token"
6. **重要**：复制 token（只显示一次！）
7. 在终端输入密码时，粘贴这个 token

**推送成功输出示例**：
```
Enumerating objects: 30, done.
Counting objects: 100% (30/30), done.
Delta compression using up to 8 threads
Compressing objects: 100% (25/25), done.
Writing objects: 100% (30/30), 10.00 KiB | 2.00 MiB/s, done.
Total 30 (delta 5), reused 0 (delta 0)
remote: Resolving deltas: 100% (5/5), done.
To https://github.com/zhangsan/qianfen-game.git
 * [new branch]      main -> main
```

### 2.10 刷新 GitHub 仓库页面

推送成功后，刷新你的 GitHub 仓库页面，你应该能看到：
- 代码文件
- 文件夹结构
- 提交记录

---

## ⚙️ 第三步：配置 GitHub Pages

### 3.1 进入仓库设置

在你的 GitHub 仓库页面：
1. 点击顶部的 **Settings** 标签
2. 在左侧菜单中找到 **Pages**
3. 点击进入

**URL 示例**：
```
https://github.com/YOUR_USERNAME/qianfen-game/settings/pages
```

### 3.2 配置部署设置

在 Pages 设置页面，找到 **Source** 部分：

#### 3.2.1 选择部署方式

点击下拉菜单，选择：
```
Deploy from a branch
```

#### 3.2.2 选择分支

选择以下选项：

| 字段 | 选择 | 说明 |
|------|------|------|
| **Branch** | `main` | 主分支 |
| **Folder** | `/ (root)` | 根目录 |

**确保选择的是 `/ (root)`**，不是 `/docs`！

#### 3.2.3 保存设置

点击 **Save** 按钮

**保存后页面会显示**：
```
Your site is live at https://YOUR_USERNAME.github.io/qianfen-game/
```

### 3.3 等待部署完成

GitHub 会自动构建和部署你的网站，这个过程需要 2-5 分钟。

#### 查看部署状态

在 Pages 设置页面，你会看到部署状态：

**状态1：构建中**（1-2分钟）
```
Build in progress...
```

**状态2：部署中**（1-3分钟）
```
Deployment in progress...
```

**状态3：部署成功**
```
Your site is live at https://YOUR_USERNAME.github.io/qianfen-game/
```

**状态4：部署失败**（如果有问题）
```
Deployment failed
```

如果部署失败，查看错误信息：
- 点击最近的部署记录
- 查看构建日志
- 根据错误信息调整代码

### 3.4 验证部署成功

部署成功后，点击显示的链接访问你的游戏：

```
https://YOUR_USERNAME.github.io/qianfen-game/
```

**示例**：
如果你的用户名是 `zhangsan`，地址就是：
```
https://zhangsan.github.io/qianfen-game/
```

### 3.5 检查游戏是否正常运行

访问后，你应该能看到：
- 游戏主界面
- 4个玩家位置
- 你的手牌（27张）
- 分数板显示

点击"重新开始"按钮，游戏应该能正常运行。

---

## 🎮 第四步：测试游戏

### 4.1 本地测试（推荐先测试）

在部署到 GitHub 之前，建议先本地测试：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问：`http://localhost:5173`

### 4.2 在线测试

GitHub Pages 部署成功后，访问你的游戏链接：
```
https://YOUR_USERNAME.github.io/qianfen-game/
```

**测试功能**：
- [ ] 游戏界面正常显示
- [ ] 能看到4个玩家位置
- [ ] 能看到自己的手牌
- [ ] 能选择手牌并出牌
- [ ] AI 能正常出牌
- [ ] 分数能正常计算
- [ ] 游戏结束后能重新开始

---

## 🔄 第五步：更新游戏

### 5.1 修改代码

修改任何文件后，更新代码到 GitHub：

```bash
# 查看修改了哪些文件
git status

# 添加修改的文件
git add .

# 提交修改
git commit -m "Update: 修改描述"

# 推送到 GitHub
git push
```

### 5.2 自动重新部署

推送代码后，GitHub 会自动重新部署，无需手动操作。

**查看部署状态**：
1. 访问仓库的 Pages 设置页面
2. 查看最新的部署状态
3. 等待部署完成（2-5分钟）

---

## 🐛 常见问题解决

### 问题1：推送代码时提示认证失败

**错误信息**：
```
remote: Support for password authentication was removed on August 13, 2021.
```

**解决方法**：
使用 Personal Access Token 而不是密码：

1. 生成 PAT（参考 2.9 步骤）
2. 在终端输入用户名后，粘贴 token 作为密码

### 问题2：部署后样式丢失

**原因**：路径配置问题

**解决方法**：
确保 `vite.config.ts` 中的配置是：
```typescript
export default defineConfig({
  plugins: [react()],
  base: './',  // 必须是 './'
})
```

修改后重新提交和推送：
```bash
git add vite.config.ts
git commit -m "Fix: 修复 base 路径配置"
git push
```

### 问题3：部署后页面空白

**可能原因**：
- 构建失败
- 路径配置错误
- 浏览器缓存

**解决方法**：
1. 查看 Pages 部署日志，确认构建是否成功
2. 清除浏览器缓存（Ctrl + Shift + Delete）
3. 检查浏览器控制台（F12）的错误信息

### 问题4：npm install 失败

**错误信息**：
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**解决方法**：
```bash
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 问题5：git 命令不识别

**错误信息**：
```
'git' is not recognized as an internal or external command
```

**解决方法**：
安装 Git：https://git-scm.com/downloads
下载安装包，安装完成后重启终端。

---

## 📊 部署流程总结

### 完整流程图

```
创建 GitHub 仓库
    ↓
初始化 Git 仓库
    ↓
提交代码
    ↓
推送到 GitHub
    ↓
配置 GitHub Pages
    ↓
等待自动部署
    ↓
访问在线游戏
```

### 时间估算

| 步骤 | 预计时间 |
|------|----------|
| 创建 GitHub 仓库 | 2 分钟 |
| 配置 Git | 3 分钟 |
| 推送代码 | 2 分钟 |
| 配置 Pages | 1 分钟 |
| 等待部署 | 3-5 分钟 |
| **总计** | **11-13 分钟** |

---

## 🎉 成功标志

当你看到以下内容时，说明部署成功：

1. ✅ GitHub 仓库页面显示所有代码文件
2. ✅ Pages 设置显示 "Your site is live"
3. ✅ 访问游戏链接能看到完整界面
4. ✅ 游戏功能正常，能正常游玩

---

## 📞 需要帮助？

如果遇到问题：

1. **查看部署日志**：
   - 进入仓库 → Actions
   - 查看最新的 workflow run
   - 查看错误信息

2. **查看浏览器控制台**：
   - 按 F12 打开开发者工具
   - 查看 Console 标签的错误信息

3. **查看 GitHub 文档**：
   - https://docs.github.com/pages

4. **重新部署**：
   - 删除 Pages 设置中的部署记录
   - 重新配置 Pages

---

## 🚀 进阶技巧

### 自定义域名

如果你有自己的域名，可以配置自定义域名：

1. 在 Pages 设置中，找到 "Custom domain"
2. 输入你的域名，例如：`game.example.com`
3. 配置 DNS 记录：
   - CNAME 记录：`YOUR_USERNAME.github.io`
4. 保存后等待 DNS 生效（几分钟到几小时）

### 启用 HTTPS

GitHub Pages 默认启用 HTTPS，无需额外配置。

### 添加自定义图标

在 `public/` 文件夹添加：
- `favicon.ico`：网站图标
- `logo.png`：网站 Logo

---

## 📝 维护建议

### 定期更新依赖

```bash
# 查看过期的依赖
npm outdated

# 更新依赖
npm update
```

### 备份代码

定期备份代码到 GitHub 或其他位置。

### 监控访问

GitHub Pages 提供访问统计，可以在 Pages 设置中查看。

---

## 🎊 恭喜！

你已经成功将潜江千分游戏部署到 GitHub Pages！

**你的游戏地址**：
```
https://YOUR_USERNAME.github.io/qianfen-game/
```

现在可以：
- 📮 分享给朋友
- 📱 在任何设备上访问
- 🌐 分享到社交媒体
- 🎮 随时随地玩游戏

---

## 📚 附录：常用 Git 命令

```bash
# 初始化仓库
git init

# 添加文件
git add .
git add 文件名

# 提交
git commit -m "提交信息"

# 推送
git push
git push origin main

# 拉取最新代码
git pull

# 查看状态
git status

# 查看历史
git log

# 查看分支
git branch

# 切换分支
git checkout 分支名

# 创建并切换分支
git checkout -b 新分支名

# 合并分支
git merge 分支名
```

---

**祝游戏愉快！** 🎮✨
