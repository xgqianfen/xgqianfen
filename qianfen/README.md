# 潜江千分 - 团队对抗版

一款基于 React + TypeScript 开发的单机版潜江千分卡牌游戏，支持人机对战，AI具有正常人打牌水平。

## 🎮 游戏特点

- ✅ **完全免费**：纯前端实现，无需服务器成本
- ✅ **智能AI**：3个AI对手，具有策略性决策能力
- ✅ **团队对抗**：双人对战模式，强调团队配合
- ✅ **完整规则**：实现潜江千分的所有核心玩法
- ✅ **响应式设计**：适配桌面端浏览器

## 🚀 快速开始

### 本地运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 打开浏览器访问：`http://localhost:5173`

### 部署到 GitHub Pages

1. 创建 GitHub 仓库并推送代码：
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/qianfen-game.git
git push -u origin main
```

2. 在 GitHub 仓库设置中启用 Pages：
   - 进入仓库 → Settings → Pages
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "main" 和 "/ (root)"
   - 点击 Save

3. 等待几分钟后，访问 `https://YOUR_USERNAME.github.io/qianfen-game/`

### 构建生产版本

```bash
npm run build
```

构建后的文件在 `dist` 目录。

## 🎯 游戏规则

### 基本规则

- **4人游戏**：你 + 3个AI
- **组队方式**：队伍A（你+AI上） vs 队伍B（AI左+AI右）
- **牌数**：两副牌108张，每人27张
- **分值牌**：5（5分）、10（10分）、K（10分），总分200分

### 牌型大小（从大到小）

1. **至尊**：8张相同点数
2. **四大天王**：4张王
3. **炸弹**：4-7张相同点数
4. **真五十K**：同花色5-10-K
5. **假五十K**：任意花色5-10-K
6. **飞机**：连续三条（如333444）
7. **连对**：连续对子（如3344）
8. **三条**：3张相同
9. **对子**：2张相同
10. **单张**：任意单牌

### 特殊机制

- **吹风**：上游或二游的对家获得自由出牌权
- **团队奖励**：
  - 上游+二游：+60分
  - 上游+三游：+30分
- **策略性放弃**：可以选择不要，保留大牌

## 🛠️ 技术栈

- **前端框架**：React 18 + TypeScript
- **状态管理**：Zustand
- **样式框架**：Tailwind CSS
- **构建工具**：Vite

## 📁 项目结构

```
qianfen-team-game/
├── src/
│   ├── components/          # React组件
│   │   ├── Card.tsx         # 卡牌组件
│   │   ├── CardHand.tsx     # 手牌选择
│   │   ├── GameBoard.tsx    # 游戏主界面
│   │   └── PlayerSeat.tsx   # 玩家区域
│   ├── services/            # 游戏逻辑
│   │   ├── aiPlayer.ts      # AI决策
│   │   ├── cardRecognizer.ts # 牌型识别
│   │   └── gameController.ts # 游戏控制器
│   ├── stores/              # 状态管理
│   │   └── gameStore.ts
│   ├── types/               # 类型定义
│   │   └── card.ts
│   ├── App.tsx              # 主应用
│   ├── main.tsx             # 入口文件
│   └── index.css            # 样式
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## 🤖 AI 策略说明

AI 采用多层次决策系统：

1. **抢分评估**：优先出5、10、K等分数牌
2. **团队协作**：对家快出完时主动让牌
3. **牌力保留**：避免过早出完大牌
4. **动态调整**：根据局势调整激进/保守策略

## 📝 开发说明

### 修改AI难度

编辑 `src/services/aiPlayer.ts` 中的 `evaluatePlay` 方法，调整评分权重。

### 添加新牌型

在 `src/services/cardRecognizer.ts` 的 `identify` 方法中添加识别逻辑。

### 自定义UI样式

修改 `src/index.css` 和 Tailwind 配置。

## 🐛 已知问题

- AI 在复杂局面下可能做出次优决策
- 暂不支持撤销操作
- 移动端适配有待优化

## 🎯 后续计划

- [ ] 添加更多AI难度等级
- [ ] 支持自定义规则设置
- [ ] 添加游戏回放功能
- [ ] 优化移动端体验
- [ ] 添加音效和动画

## 📄 许可证

MIT License

## 🙏 致谢

- 基于潜江千分团队对抗版规则文档开发
- 使用 React、TypeScript、Tailwind CSS 开发
- Vite 构建工具

---

享受游戏！如有问题，欢迎提 Issue。
