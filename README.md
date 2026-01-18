# HIIC AI Lab

> 深圳国家高技术产业创新中心 AI 工具集平台

面向政府智库的 AI 工具集合平台，汇集了 PPT 生成、产业链图谱、思维导图、智能评审等多款 AI 应用，帮助同事们提升工作效率。

## 在线访问

- **主站**: https://hiic-ai.vercel.app
- **AI 画 PPT**: https://ppt.gwy.life
- **AI 产业链图谱**: https://diki.gwy.life
- **AI 智能评审**: https://dafen.gwy.life

## 功能特性

### AI 应用集合

| 应用 | 状态 | 描述 |
|------|------|------|
| AI 画 PPT | 在线 | 输入主题，一键生成专业演示文稿 |
| AI 产业链图谱 | 在线 | 智能分析并生成产业链上下游关系图谱 |
| AI 思维导图 | 在线 | 输入文本自动生成结构化思维导图 |
| AI 智能评审 | 在线 | 内部项目评审打分系统，支持多维度权重 |
| AI 研究报告 | 开发中 | 基于数据自动生成专业研究报告 |
| AI 数据图表 | 开发中 | 智能分析数据并生成可视化图表 |
| AI 智能检索 | 开发中 | 基于语义理解的智能文档检索 |

### 内部社区

- 支持多板块分类（问答、心得、闲聊、活动）
- 邮箱魔法链接登录
- 匿名发帖功能
- 标签系统
- 点赞、收藏、评论互动
- Supabase 实时数据库

### 其他功能

- 教程文档中心
- 更新日志
- 反馈系统

## 技术栈

- **框架**: React 19 + TypeScript 5.x
- **构建工具**: Vite 7
- **样式**: Tailwind CSS v4
- **路由**: React Router DOM v7
- **图标**: Lucide React
- **数据库**: Supabase (PostgreSQL)
- **状态管理**: TanStack React Query
- **部署**: Vercel

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 安装

```bash
# 克隆仓库
git clone https://github.com/liusai0820/hiic.ai.git
cd hiic.ai

# 安装依赖
npm install
```

### 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入 Supabase 配置
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 开发

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 项目结构

```
src/
├── components/          # 可复用组件
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── AppCard.tsx
│   ├── PostCard.tsx
│   ├── LoginModal.tsx
│   └── ...
├── pages/
│   ├── TutorialPage.tsx
│   └── ForumPage.tsx
├── contexts/
│   └── AuthContext.tsx  # 认证上下文
├── hooks/
│   ├── usePosts.ts      # 帖子数据 Hook
│   ├── useComments.ts   # 评论数据 Hook
│   └── useReactions.ts  # 互动数据 Hook
├── lib/
│   └── supabase.ts      # Supabase 客户端
├── data/
│   └── index.ts         # 应用数据
├── types/
│   ├── index.ts         # 类型定义
│   └── database.ts      # 数据库类型
├── App.tsx
├── main.tsx
└── index.css
```

## 数据库设计

社区功能使用 Supabase 作为后端，包含以下数据表：

| 表名 | 描述 |
|------|------|
| profiles | 用户资料 |
| posts | 帖子 |
| comments | 评论 |
| reactions | 点赞/收藏 |
| tags | 标签 |
| post_tags | 帖子-标签关联 |

详细的数据库 Schema 见 [supabase/init.sql](./supabase/init.sql)。

## 设计规范

本项目遵循 **Institutional Precision** 设计哲学：

- **纯色设计** - 禁止使用渐变色
- **瑞士设计风格** - 强调网格、对齐、负空间
- **政府智库调性** - 专业、可信、稳重
- **简约不简单** - 每个元素都有存在的理由

详细设计规范见 [CLAUDE.md](./CLAUDE.md)。

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

MIT License

## 联系方式

- **开发者**: Lius
- **邮箱**: ai@hiic.org.cn
- **组织**: 深圳国家高技术产业创新中心
