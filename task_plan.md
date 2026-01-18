# HIIC AI Lab 网站优化计划

## 目标
优化网站体验，解决三个核心问题：
1. 英文字体显示问题
2. 新增教程板块
3. 新增轻量化社区交流版块

---

## Phase 1: 修复英文字体问题 `in_progress`

### 问题分析
当前使用 `Instrument Serif` + `Plus Jakarta Sans`，在中文环境下英文显示不协调。

### 解决方案
更换为更适合中英混排的字体组合：
- **标题字体**: DM Serif Display (优雅英文衬线)
- **正文字体**: Inter (清晰英文无衬线)
- **中文回退**: system-ui, PingFang SC, Microsoft YaHei

### 任务
- [ ] 更新 index.html 字体引用
- [ ] 更新 index.css 字体变量
- [ ] 测试中英混排效果

---

## Phase 2: 新增教程板块 `pending`

### 设计思路
- 卡片式布局，与应用展示风格统一
- 每张卡片：标题、简述、预计阅读时间、关联应用图标
- 点击跳转到详情页或展开模态框

### 任务
- [ ] 创建 Tutorial 类型定义
- [ ] 创建教程数据
- [ ] 创建 TutorialCard 组件
- [ ] 创建 TutorialSection 板块
- [ ] 集成到 App.tsx

---

## Phase 3: 轻量化社区交流版块 `pending`

### 推荐方案: 精选Q&A + 交流群入口
- 上半部分：精选 Q&A 卡片 (3-4 个)
- 下半部分：加入交流群入口 + 提问按钮

### 任务
- [ ] 创建 FAQ 类型定义
- [ ] 创建精选问答数据
- [ ] 创建 CommunitySection 组件
- [ ] 集成到 App.tsx

---

## 设计原则
- 保持纯色设计，不使用渐变
- 科技蓝 #2563EB 为主色调
- 使用 Lucide 图标，不使用 emoji
- 简约专业风格，适合政府智库
