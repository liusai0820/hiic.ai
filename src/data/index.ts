import {
  Presentation,
  GitBranch,
  Brain,
  FileText,
  BookOpen,
  BarChart3,
  Search,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Megaphone,
  Award,
  Newspaper
} from 'lucide-react';
import type { App, Announcement, Developer, Category, Tutorial, FAQ, ForumCategory, ForumPost } from '../types';

export const categories: Category[] = [
  '全部',
  '办公效率',
  '数据可视化',
  '文档处理',
  '研究分析'
];

export const apps: App[] = [
  {
    id: 'library',
    name: 'AI 智能阅览室',
    description: '聚合全球顶级期刊与内部内参，AI 辅助快速提取核心观点与数据',
    icon: BookOpen,
    url: '/library', // Internal route
    category: '研究分析',
    status: 'online',
    visitCount: 56,
    version: '1.0',
    color: 'indigo',
  },
  {
    id: 'ppt',
    name: 'AI 画 PPT',
    description: '输入主题，一键生成专业演示文稿，支持多种模板风格',
    icon: Presentation,
    url: 'https://ppt.hiic.ai',
    category: '办公效率',
    status: 'online',
    visitCount: 328,
    version: '1.0',
    color: 'blue',
  },
  {
    id: 'chain',
    name: 'AI 产业链图谱',
    description: '智能分析并生成产业链上下游关系图谱，洞察产业全景',
    icon: GitBranch,
    url: 'https://chain.hiic.ai',
    category: '数据可视化',
    status: 'online',
    visitCount: 156,
    version: '2.0',
    color: 'violet',
  },
  {
    id: 'mind',
    name: 'AI 思维导图',
    description: '输入文本自动生成结构化思维导图，理清思路更轻松',
    icon: Brain,
    url: 'https://md2xmind.onrender.com/',
    category: '办公效率',
    status: 'online',
    visitCount: 89,
    version: '1.0',
    color: 'emerald',
  },
  {
    id: 'report',
    name: 'AI 研究报告',
    description: '基于数据自动生成专业研究报告，提升研究效率',
    icon: FileText,
    url: '#',
    category: '研究分析',
    status: 'coming',
    visitCount: 0,
    color: 'amber',
  },
  {
    id: 'chart',
    name: 'AI 数据图表',
    description: '智能分析数据并生成可视化图表，让数据会说话',
    icon: BarChart3,
    url: '#',
    category: '数据可视化',
    status: 'coming',
    visitCount: 0,
    color: 'rose',
  },
  {
    id: 'search',
    name: 'AI 智能检索',
    description: '基于语义理解的智能文档检索，快速定位关键信息',
    icon: Search,
    url: '#',
    category: '研究分析',
    status: 'coming',
    visitCount: 0,
    color: 'indigo',
  },
  {
    id: 'smartscore',
    name: 'AI 智能评审',
    description: '内部项目评审打分系统，支持多维度权重、利益冲突回避、实时大屏展示',
    icon: Award,
    url: 'https://dafen.hiic.ai',
    category: '办公效率',
    status: 'online',
    visitCount: 42,
    version: '1.0',
    color: 'amber',
  },
  {
    id: 'daily-digest',
    name: 'AI 每日简报',
    description: '每日精炼市场情报，覆盖美股、港股、A股、加密货币及大宗商品，5分钟掌握全球市场脉动',
    icon: Newspaper,
    url: 'https://daily.hiic.ai',
    category: '研究分析',
    status: 'online',
    visitCount: 0,
    version: '1.0',
    color: 'blue',
  },
];

export const announcements: Announcement[] = [
  {
    id: '0',
    date: '2026-01-27',
    title: 'AI 每日简报上线',
    content: '全新推出 AI 每日简报，每个交易日自动生成精炼市场情报，覆盖美股、港股、A股、加密货币及大宗商品，5分钟掌握全球市场脉动。',
    type: 'feature',
  },
  {
    id: '1',
    date: '2026-01-21',
    title: 'AI 智能阅览室上线',
    content: '全新推出 AI 智能阅览室，聚合《经济学人》《彭博商业周刊》等国际顶级期刊，AI 自动生成核心摘要，助你快速掌握全球前沿动态。',
    type: 'feature',
  },
  {
    id: '2',
    date: '2026-01-18',
    title: 'HIIC AI Lab 正式上线',
    content: '欢迎使用 HIIC AI Lab，这里汇集了各类 AI 工具，助力高效工作。',
    type: 'notice',
  },
  {
    id: '3',
    date: '2026-01-15',
    title: 'AI 产业链图谱 v2.0 发布',
    content: '新增自动布局功能，支持导出高清PNG，体验更流畅。',
    type: 'feature',
  },
  {
    id: '4',
    date: '2026-01-10',
    title: 'AI 画 PPT 新增模板',
    content: '新增商务、科技、简约等10套专业模板，满足不同场景需求。',
    type: 'update',
  },
];

export const developer: Developer = {
  name: 'lius',
  title: 'IndieHackers',
  organization: '深圳国家高技术产业创新中心',
  avatar: '',
  slogan: '用 AI 赋能每一位同事，让工作更高效',
  email: 'liusai64@gmail.com',
  github: 'https://github.com/liusai0820',
};

export const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'AI 画 PPT 快速入门',
    description: '5分钟学会使用 AI 画 PPT，从输入主题到生成专业演示文稿的完整流程',
    appId: 'ppt',
    readTime: '5 分钟',
    type: 'quickstart',
    author: 'lius',
    publishDate: '2026-01-15',
    content: `# AI 画 PPT 快速入门

欢迎使用 **AI 画 PPT**！本教程将帮助你在 5 分钟内掌握这款工具的核心用法。

## 什么是 AI 画 PPT？

AI 画 PPT 是一款基于人工智能的演示文稿生成工具。只需输入主题，AI 就能自动生成结构完整、设计精美的 PPT。

## 快速开始

### 第一步：访问工具

打开浏览器，访问 [ppt.hiic.ai](https://ppt.hiic.ai)

### 第二步：输入主题

在输入框中输入你想要生成的 PPT 主题，例如：

- "2024年工作总结汇报"
- "人工智能发展趋势分析"
- "新员工入职培训"

### 第三步：选择模板风格

系统提供多种模板风格供选择：

| 风格 | 适用场景 |
|------|----------|
| 商务蓝 | 工作汇报、商业提案 |
| 科技感 | 技术分享、产品发布 |
| 简约白 | 学术报告、培训课件 |
| 政务红 | 党建汇报、政策宣讲 |

### 第四步：生成并下载

点击「生成」按钮，等待 AI 完成创作。生成完成后，你可以：

1. **在线预览** - 直接查看效果
2. **下载 PPTX** - 导出后用 PowerPoint 编辑
3. **继续优化** - 调整内容后重新生成

## 进阶技巧

> **提示**：输入越详细的主题描述，生成的内容越精准。

例如，与其输入"工作总结"，不如输入"2024年市场部Q4工作总结，包含业绩数据、重点项目、团队建设三个方面"。

## 常见问题

### Q: 生成的内容可以编辑吗？

A: 可以！下载 PPTX 文件后，用 PowerPoint 或 WPS 打开即可自由编辑。

### Q: 支持多少页的 PPT？

A: 默认生成 8-12 页，你也可以在生成前指定页数。

---

如有其他问题，欢迎通过页面右上角的「反馈」按钮联系我们！`,
  },
  {
    id: '2',
    title: 'AI 产业链图谱使用指南',
    description: '掌握产业链图谱的核心功能，快速生成清晰的上下游关系图',
    appId: 'chain',
    readTime: '8 分钟',
    type: 'quickstart',
    author: '开发者',
    publishDate: '2026-01-12',
    content: `# AI 产业链图谱使用指南

**AI 产业链图谱** 是一款智能产业分析工具，帮助你快速了解任意产业的上下游关系。

## 核心功能

### 1. 智能图谱生成

输入产业名称，AI 自动分析并生成完整的产业链图谱：

\`\`\`
上游原材料 → 中游制造 → 下游应用
\`\`\`

### 2. 交互式探索

- **点击节点** - 查看详细信息
- **拖拽布局** - 自定义排列方式
- **缩放视图** - 查看全局或细节

### 3. 数据导出

支持多种导出格式：

- PNG 高清图片
- SVG 矢量图
- JSON 数据格式

## 使用步骤

### Step 1: 输入产业关键词

在搜索框输入你想分析的产业，例如：
- 新能源汽车
- 半导体芯片
- 生物医药

### Step 2: 查看生成结果

AI 会自动生成包含以下内容的图谱：

1. **上游企业** - 原材料、零部件供应商
2. **中游企业** - 制造、加工企业
3. **下游企业** - 终端产品、应用场景

### Step 3: 自定义编辑

你可以：
- 添加/删除节点
- 修改连接关系
- 调整布局样式

## 实际案例

以「新能源汽车」产业为例：

| 层级 | 代表企业/产品 |
|------|--------------|
| 上游 | 锂矿、正负极材料、电解液 |
| 中游 | 动力电池、电机、电控系统 |
| 下游 | 整车制造、充电桩、运营服务 |

## 小贴士

> 图谱数据基于公开信息和 AI 分析生成，建议结合实际情况进行补充和验证。

---

更多问题？点击「反馈」告诉我们！`,
  },
  {
    id: '3',
    title: 'PPT 模板选择技巧',
    description: '针对不同场景选择合适的模板风格，让演示更专业',
    appId: 'ppt',
    readTime: '3 分钟',
    type: 'advanced',
    author: '开发者',
    publishDate: '2026-01-10',
    content: `# PPT 模板选择技巧

选对模板，让你的演示事半功倍。

## 模板与场景匹配指南

### 商务汇报类

**推荐模板**：商务蓝、专业灰

适用场景：
- 季度/年度工作汇报
- 项目进展报告
- 商业计划书

**设计特点**：
- 配色稳重专业
- 布局清晰规整
- 图表占比较高

### 技术分享类

**推荐模板**：科技感、极简黑

适用场景：
- 技术方案讲解
- 产品功能介绍
- 系统架构说明

**设计特点**：
- 深色背景突出内容
- 代码块展示友好
- 流程图清晰

### 培训教学类

**推荐模板**：简约白、活力橙

适用场景：
- 新员工培训
- 知识分享会
- 操作指南

**设计特点**：
- 背景简洁不干扰
- 字体大小适中
- 重点突出明显

## 模板选择三原则

1. **匹配受众** - 领导汇报选稳重，团队分享可活泼
2. **突出内容** - 模板是配角，内容才是主角
3. **保持一致** - 全程使用统一风格

## 快速决策表

| 场景 | 推荐模板 | 主色调 |
|------|----------|--------|
| 领导汇报 | 商务蓝 | #2563EB |
| 技术分享 | 科技感 | #1E293B |
| 党建工作 | 政务红 | #DC2626 |
| 日常培训 | 简约白 | #F8FAFC |

---

选对模板，内容更出彩！`,
  },
  {
    id: '4',
    title: 'AI 工具在日常工作中的应用',
    description: '真实案例分享：如何用 AI 工具提升研究报告的编写效率',
    readTime: '10 分钟',
    type: 'usecase',
    author: 'lius',
    publishDate: '2026-01-08',
    content: `# AI 工具在日常工作中的应用

本文分享几个真实的使用案例，展示如何利用 AI 工具提升工作效率。

## 案例一：季度汇报 PPT

### 背景

每个季度末，各部门都需要准备工作汇报 PPT。传统方式往往需要：
- 收集整理数据：2-3 小时
- 设计制作 PPT：4-6 小时
- 修改完善：2-3 小时

### AI 方案

使用 **AI 画 PPT**：

1. 将季度工作要点整理成文字描述
2. 输入 AI 画 PPT 生成初稿
3. 下载后微调细节

### 效果

| 指标 | 传统方式 | AI 辅助 | 提升 |
|------|----------|---------|------|
| 总耗时 | 8-12小时 | 2-3小时 | 75% |
| 设计质量 | 因人而异 | 专业统一 | - |
| 修改次数 | 3-5次 | 1-2次 | 60% |

## 案例二：产业调研报告

### 背景

研究某个产业时，需要了解上下游关系、主要企业、发展趋势等。

### AI 方案

使用 **AI 产业链图谱**：

1. 输入产业名称，生成产业链全景图
2. 点击各节点查看详细信息
3. 导出图片用于报告

### 实际收益

> "以前做产业调研要查阅大量资料，现在用图谱工具，10分钟就能看到产业全貌，效率提升太多了。" —— 某研究员

## 使用建议

### 适合 AI 的任务

- 结构化内容生成（PPT、报告框架）
- 信息整理和可视化
- 重复性文档工作

### 需要人工把关的环节

- 数据准确性核实
- 专业判断和分析
- 最终内容审核

## 总结

AI 工具是效率助手，不是替代者。合理使用，让工作更轻松！

---

有更多使用心得？欢迎在评论区分享！`,
  },
  {
    id: '5',
    title: 'Claude Code 完全指南：让 AI 成为你的编程搭档',
    description: '从安装配置到高级技巧，全面掌握 Claude Code 这款革命性的 AI 编程工具',
    readTime: '15 分钟',
    type: 'quickstart',
    author: '开发者',
    publishDate: '2026-01-17',
    content: `# Claude Code 完全指南

Claude Code 是 Anthropic 推出的**智能编程助手**，它不仅仅是一个聊天窗口——它能直接在你的终端中运行，访问整个代码库，并执行完整的开发工作流。

## 什么是 Claude Code？

与传统 AI 对话工具不同，Claude Code 具备以下核心能力：

- **直接操作文件系统** - 读取、创建、修改代码文件
- **执行终端命令** - 运行构建、测试、部署脚本
- **理解项目上下文** - 分析整个代码库结构
- **自主完成任务** - 从需求到实现的端到端开发

## 快速安装

### 前置要求

- Node.js 18+ 或 Bun
- 一个 Anthropic API 密钥

### 安装步骤

\`\`\`bash
# 使用 npm 全局安装
npm install -g @anthropic-ai/claude-code

# 或使用 Bun
bun install -g @anthropic-ai/claude-code

# 验证安装
claude --version
\`\`\`

### 首次配置

\`\`\`bash
# 启动 Claude Code
claude

# 首次运行会要求输入 API 密钥
# 密钥会安全存储在本地
\`\`\`

## 核心使用方式

### 1. 基础对话

直接在终端输入需求：

\`\`\`
> 帮我创建一个 React 组件，显示用户列表

Claude 会分析需求，创建文件，并解释代码逻辑
\`\`\`

### 2. 项目初始化

\`\`\`bash
# 在项目目录运行
claude

# 使用 /init 命令生成 CLAUDE.md
/init
\`\`\`

### 3. 常用斜杠命令

| 命令 | 功能 |
|------|------|
| \`/init\` | 初始化项目配置 |
| \`/clear\` | 清空对话上下文 |
| \`/compact\` | 压缩上下文（保留关键信息） |
| \`/help\` | 查看帮助文档 |

## CLAUDE.md：项目记忆文件

**CLAUDE.md** 是 Claude Code 的"项目说明书"，放在仓库根目录：

\`\`\`markdown
# 项目概述
这是一个 React + TypeScript 项目，使用 Tailwind CSS 做样式。

## 技术栈
- React 19
- TypeScript 5.x
- Tailwind CSS v4
- Vite 7

## 开发命令
- \`npm run dev\` - 启动开发服务器
- \`npm run build\` - 构建生产版本
- \`npm run test\` - 运行测试

## 代码规范
- 使用函数组件和 Hooks
- 文件名使用 PascalCase
- 组件放在 src/components/ 目录
\`\`\`

### 最佳实践

1. **保持简洁** - CLAUDE.md 会占用上下文空间
2. **版本控制** - 提交到 Git，团队共享
3. **定期更新** - 项目演进时同步更新
4. **分层配置** - 子目录可有独立的 CLAUDE.md

## 高级技巧

### 计划模式（Plan Mode）

让 Claude 先规划再动手：

\`\`\`
> /plan 帮我重构这个模块的认证逻辑

Claude 会先输出完整的重构计划，等你确认后再执行
\`\`\`

### 测试驱动开发

\`\`\`
> 先写测试用例，确认失败后再写实现代码

这种方式能显著提高代码质量
\`\`\`

### 多实例并行

使用 Git worktrees 同时运行多个 Claude 实例：

\`\`\`bash
# 创建工作树
git worktree add ../frontend-feature feature/new-ui

# 在不同目录启动不同任务
# 终端 1: 前端开发
# 终端 2: 后端 API
\`\`\`

## VS Code 集成

推荐使用 VS Code 扩展获得更好体验：

1. 安装 Claude Code 扩展
2. 使用 \`Ctrl+Shift+P\` 调出命令面板
3. 输入 "Claude" 查看可用命令

## 安全提示

> **重要**：Claude Code 可以执行任意命令，请在受信任的项目中使用。

- 建议在 Git 仓库中使用（可随时回滚）
- 定期检查生成的代码
- 敏感操作前手动确认

## 常见问题

### Q: 和 ChatGPT/Copilot 有什么区别？

A: Claude Code 是**自主代理**，能独立完成多步骤任务，而不仅仅是代码补全。

### Q: 收费模式是什么？

A: 按 API 调用计费，Pro 用户有额度包含，Max 用户无限使用。

---

更多资源：
- [官方文档](https://docs.anthropic.com/claude-code)
- [GitHub 仓库](https://github.com/anthropics/claude-code)`,
  },
  {
    id: '6',
    title: 'Claude Skills 入门：创建你的第一个自定义技能',
    description: '学习如何为 Claude 创建可复用的自定义技能，让 AI 按照你的工作流程执行任务',
    readTime: '12 分钟',
    type: 'advanced',
    author: '开发者',
    publishDate: '2026-01-16',
    content: `# Claude Skills 入门指南

**Claude Skills** 是一种让 Claude "学习"特定工作流程的方式。你可以把专业知识封装成技能，Claude 会在合适的时机自动调用。

## 什么是 Skills？

Skills 本质上是一个包含指令的文件夹：

\`\`\`
my-skill/
├── SKILL.md      # 技能说明（必需）
├── templates/    # 模板文件（可选）
└── scripts/      # 脚本文件（可选）
\`\`\`

与 GPTs 或 Gems 不同，Skills **不需要用户手动选择**——Claude 会根据任务自动匹配并加载相关技能。

## 创建第一个 Skill

### 步骤 1：创建目录结构

\`\`\`bash
mkdir -p ~/.claude/skills/code-reviewer
cd ~/.claude/skills/code-reviewer
\`\`\`

### 步骤 2：编写 SKILL.md

\`\`\`markdown
---
name: code-reviewer
description: 当用户要求审查代码或提交 PR 时使用此技能
---

# 代码审查助手

## 审查流程

1. **安全检查**
   - 检查是否有硬编码的密钥或凭证
   - 检查 SQL 注入、XSS 等安全漏洞
   - 验证输入数据的校验

2. **代码质量**
   - 检查函数是否过长（超过 50 行需拆分）
   - 检查重复代码
   - 验证命名是否清晰

3. **性能考量**
   - 检查不必要的循环嵌套
   - 识别 N+1 查询问题
   - 检查大对象的内存使用

## 输出格式

使用以下模板输出审查结果：

### 🔴 严重问题
[列出必须修复的问题]

### 🟡 建议改进
[列出可以优化的地方]

### 🟢 做得好的地方
[列出代码的亮点]
\`\`\`

### 步骤 3：测试技能

在 Claude Code 中输入：

\`\`\`
> 帮我审查这段代码 [粘贴代码]

Claude 会自动加载 code-reviewer 技能并按照定义的流程执行
\`\`\`

## 技能命名规范

| 规则 | 示例 |
|------|------|
| 使用小写字母 | \`pdf-generator\` ✅ |
| 用连字符分隔 | \`api-tester\` ✅ |
| 名称要描述性 | \`react-component-creator\` ✅ |
| 避免通用名称 | \`helper\` ❌ |

## 技能描述的重要性

\`description\` 字段决定 Claude 何时触发技能：

\`\`\`markdown
# 好的描述（具体场景）
description: 当用户需要生成 PDF 报告或将 HTML 转换为 PDF 时使用

# 差的描述（太模糊）
description: 处理文档
\`\`\`

## 进阶：添加模板文件

\`\`\`
my-skill/
├── SKILL.md
└── templates/
    ├── component.tsx.template
    └── test.spec.ts.template
\`\`\`

在 SKILL.md 中引用：

\`\`\`markdown
## 模板

创建组件时，使用 \`templates/component.tsx.template\` 作为基础模板。
\`\`\`

## 上传到 Claude.ai

1. 将技能文件夹压缩为 ZIP
2. 进入 Claude.ai 设置 → Skills
3. 点击上传（需要 Pro/Max/Team 订阅）

## 调试技巧

### 查看推理过程

在 Claude 响应时，点击"查看推理"可以看到：
- 是否加载了技能
- 如何解析技能指令
- 执行步骤

### 测试边界情况

\`\`\`
> 帮我审查这段空代码  # 测试边界
> 审查这个 10000 行的文件  # 测试极限
\`\`\`

## 企业级技能管理

对于团队使用，建议：

1. **建立技能仓库** - 集中管理所有技能
2. **指定技能负责人** - 每个技能有明确的维护者
3. **版本控制** - 使用 Git 追踪变更
4. **定期审查** - 每季度评估技能有效性

## 与 CLAUDE.md 的区别

| 特性 | CLAUDE.md | Skills |
|------|-----------|--------|
| 作用范围 | 单个项目 | 跨项目复用 |
| 触发方式 | 自动加载 | 条件触发 |
| 适用场景 | 项目配置 | 工作流程 |

---

现在就开始创建你的第一个技能吧！`,
  },
  {
    id: '7',
    title: 'MCP 服务器：为 Claude 扩展超能力',
    description: '通过 Model Context Protocol 连接外部工具，让 Claude 能访问文档、数据库和各种 API',
    readTime: '10 分钟',
    type: 'advanced',
    author: '开发者',
    publishDate: '2026-01-14',
    content: `# MCP 服务器入门

**Model Context Protocol (MCP)** 是一个开放标准，允许 Claude 连接外部工具和资源。通过 MCP 服务器，Claude 可以：

- 访问实时文档和 API
- 读写数据库
- 执行网页抓取
- 调用第三方服务

## MCP 工作原理

\`\`\`
用户请求 → Claude → MCP 服务器 → 外部工具/API
                ↑           ↓
                └───── 返回结果
\`\`\`

Claude 通过 MCP 协议与服务器通信，服务器提供工具列表和执行能力。

## 服务器类型

### 远程服务器（HTTP/SSE）

托管在云端，通过网络访问：

\`\`\`bash
# 添加远程 MCP 服务器
claude mcp add --transport http context7 -- https://mcp.context7.com
\`\`\`

### 本地服务器（STDIO）

运行在本机，适合需要系统访问的场景：

\`\`\`bash
# 添加本地文件系统服务器
claude mcp add --transport stdio filesystem -- npx @anthropic/mcp-filesystem /path/to/folder
\`\`\`

## 常用 MCP 服务器

### 1. Context7 - 文档查询

实时获取最新的库文档：

\`\`\`bash
claude mcp add context7 --transport http -- https://mcp.context7.com
\`\`\`

使用示例：
\`\`\`
> 用 Context7 查询 React 19 的新特性

Claude 会调用 Context7 获取最新文档
\`\`\`

### 2. Filesystem - 文件系统

让 Claude 访问指定目录：

\`\`\`bash
claude mcp add filesystem --transport stdio -- \\
  npx @anthropic/mcp-filesystem ~/Documents
\`\`\`

### 3. PostgreSQL - 数据库

连接数据库执行查询：

\`\`\`bash
claude mcp add postgres --transport stdio \\
  -e DATABASE_URL="postgresql://user:pass@localhost/db" -- \\
  npx @anthropic/mcp-postgres
\`\`\`

## 配置作用域

| 作用域 | 命令选项 | 适用场景 |
|--------|----------|----------|
| 本地 | \`--scope local\` | 当前项目独享 |
| 项目 | \`--scope project\` | 团队共享 |
| 全局 | \`--scope user\` | 所有项目可用 |

## 管理已添加的服务器

\`\`\`bash
# 列出所有服务器
claude mcp list

# 移除服务器
claude mcp remove context7

# 查看服务器详情
claude mcp info filesystem
\`\`\`

## 安全注意事项

> ⚠️ MCP 服务器可以访问外部资源，请注意：

1. **只添加受信任的服务器**
2. **限制文件系统访问范围**
3. **数据库使用只读账户**
4. **定期审查服务器权限**

## 自定义 MCP 服务器

如果现有服务器不满足需求，可以自己开发：

\`\`\`typescript
// 使用 TypeScript SDK
import { Server } from '@anthropic/mcp-server';

const server = new Server({
  name: 'my-tool',
  version: '1.0.0',
});

server.addTool({
  name: 'get_weather',
  description: '获取城市天气',
  parameters: {
    city: { type: 'string', description: '城市名称' }
  },
  handler: async ({ city }) => {
    // 调用天气 API
    return { temperature: 25, condition: 'sunny' };
  }
});

server.start();
\`\`\`

## 故障排查

### 服务器无响应

\`\`\`bash
# 检查服务器状态
claude mcp list

# 查看日志
claude --debug
\`\`\`

### 权限错误

确保：
- Node.js 已安装
- 网络可访问远程服务器
- 本地路径有读取权限

---

通过 MCP，Claude 从对话助手变成了真正的**智能代理**，能够与现实世界的工具和数据交互。`,
  },
];

export const faqs: FAQ[] = [
  {
    id: '1',
    question: 'AI 画 PPT 支持哪些输出格式？',
    answer: '目前支持在线预览和 PPTX 格式导出，可直接用 PowerPoint 或 WPS 打开编辑。',
    votes: 24,
  },
  {
    id: '2',
    question: '产业链图谱的数据来源是什么？',
    answer: '基于公开产业数据和 AI 分析生成，支持自定义编辑和补充。',
    votes: 18,
  },
  {
    id: '3',
    question: '如何申请新功能或反馈问题？',
    answer: '点击页面右上角「反馈」按钮，填写反馈表单，我们会认真阅读每一条建议。',
    votes: 15,
  },
  {
    id: '4',
    question: '这些工具只能在单位内网使用吗？',
    answer: '目前所有工具均支持外网访问，但建议在单位网络环境下使用以获得最佳体验。',
    votes: 12,
  },
];

// 论坛板块
export const forumCategories: ForumCategory[] = [
  {
    id: 'qa',
    name: 'AI 工具问答',
    description: '使用问题、技术答疑',
    icon: HelpCircle,
    color: 'blue',
    postCount: 28,
  },
  {
    id: 'tips',
    name: '使用心得',
    description: '技巧分享、案例展示',
    icon: Lightbulb,
    color: 'emerald',
    postCount: 15,
  },
  {
    id: 'talk',
    name: '畅所欲言',
    description: '建议、吐槽、闲聊',
    icon: MessageSquare,
    color: 'amber',
    postCount: 42,
  },
  {
    id: 'activity',
    name: '活动公告',
    description: '公司活动、培训通知',
    icon: Megaphone,
    color: 'violet',
    postCount: 8,
  },
];

// 论坛帖子
export const forumPosts: ForumPost[] = [
  {
    id: '1',
    title: '如何用 AI 画 PPT 生成产业分析报告？',
    content: `最近在做半导体产业调研，需要做一个汇报PPT。试了一下AI画PPT，输入"半导体产业链分析报告"，生成的内容框架还不错，但是数据部分需要自己补充。

想问下大家有没有更好的使用技巧？比如怎么让生成的内容更贴合实际需求？

另外，生成的图表能不能自定义修改？`,
    category: 'qa',
    author: {
      name: '张明',
      avatar: '',
      department: '产业研究部',
    },
    createdAt: '2026-01-18T10:30:00Z',
    likes: 12,
    comments: [
      {
        id: 'c1',
        postId: '1',
        author: { name: '李华', avatar: '', department: '技术部' },
        content: '建议在输入主题时加上具体的大纲要求，比如"半导体产业链分析：上游设备材料、中游制造、下游应用，重点分析国产替代进展"，这样生成的内容会更精准。',
        createdAt: '2026-01-18T11:15:00Z',
        likes: 5,
      },
      {
        id: 'c2',
        postId: '1',
        author: { name: '王芳', avatar: '', department: '战略规划部' },
        content: '下载PPTX后可以用PowerPoint自由编辑图表的，数据都是可改的。',
        createdAt: '2026-01-18T14:20:00Z',
        likes: 3,
      },
    ],
    favorites: 8,
    views: 156,
    isHot: true,
    tags: ['AI画PPT', '使用技巧'],
  },
  {
    id: '2',
    title: '分享：用思维导图整理会议纪要的技巧',
    content: `最近发现AI思维导图特别适合整理会议纪要！

**我的使用流程：**

1. 会议结束后，把会议要点用文字列出来
2. 粘贴到AI思维导图，自动生成结构化导图
3. 导出PNG分享给参会同事

**效果：**
- 以前整理会议纪要要半小时，现在10分钟搞定
- 同事反馈导图比传统纪要更清晰易读

推荐大家试试！`,
    category: 'tips',
    author: {
      name: '陈晓',
      avatar: '',
      department: '综合管理部',
    },
    createdAt: '2026-01-17T16:45:00Z',
    likes: 25,
    comments: [
      {
        id: 'c3',
        postId: '2',
        author: { name: '刘强', avatar: '', department: '财务部' },
        content: '太实用了！我也试试用来整理周报。',
        createdAt: '2026-01-17T17:30:00Z',
        likes: 2,
      },
    ],
    favorites: 18,
    views: 234,
    isHot: true,
    isPinned: true,
    tags: ['思维导图', '效率提升', '会议纪要'],
  },
  {
    id: '3',
    title: '建议：能不能增加深色模式？',
    content: `晚上加班的时候用这些工具，白色背景太刺眼了。

希望能增加深色模式的选项，对眼睛友好一些。

另外，移动端的适配也希望能优化一下，手机上看产业链图谱有点费劲。`,
    category: 'talk',
    author: {
      name: '赵伟',
      avatar: '',
      department: '信息技术部',
    },
    createdAt: '2026-01-16T21:30:00Z',
    likes: 32,
    comments: [
      {
        id: 'c4',
        postId: '3',
        author: { name: '开发者', avatar: '', department: 'AI Lab' },
        content: '感谢建议！深色模式已经在开发计划中了，预计下个月上线。移动端优化也会同步进行。',
        createdAt: '2026-01-17T09:00:00Z',
        likes: 15,
      },
    ],
    favorites: 12,
    views: 198,
    tags: ['建议', '深色模式'],
  },
  {
    id: '4',
    title: '【活动预告】AI 工具培训会 - 1月25日',
    content: `各位同事：

为帮助大家更好地使用HIIC AI Lab的各项工具，我们将举办一次线下培训会。

**活动信息：**
- 时间：2026年1月25日（周六）14:00-17:00
- 地点：A栋3楼会议室
- 主讲：AI Lab 开发团队

**培训内容：**
1. AI画PPT高级技巧
2. 产业链图谱深度使用
3. 即将上线的新功能预览
4. 现场答疑互动

请有意参加的同事在评论区报名，注明姓名和部门。

名额有限，先到先得！`,
    category: 'activity',
    author: {
      name: '人事行政部',
      avatar: '',
      department: '人事行政部',
    },
    createdAt: '2026-01-15T10:00:00Z',
    likes: 45,
    comments: [
      {
        id: 'c5',
        postId: '4',
        author: { name: '周敏', avatar: '', department: '市场部' },
        content: '报名！周敏，市场部',
        createdAt: '2026-01-15T10:30:00Z',
        likes: 0,
      },
      {
        id: 'c6',
        postId: '4',
        author: { name: '孙磊', avatar: '', department: '研发部' },
        content: '报名+1，孙磊，研发部',
        createdAt: '2026-01-15T11:00:00Z',
        likes: 0,
      },
      {
        id: 'c7',
        postId: '4',
        author: { name: '吴婷', avatar: '', department: '产业研究部' },
        content: '报名！吴婷，产业研究部。期待新功能预览！',
        createdAt: '2026-01-15T14:20:00Z',
        likes: 1,
      },
    ],
    favorites: 28,
    views: 312,
    isPinned: true,
    tags: ['活动', '培训'],
  },
  {
    id: '5',
    title: '产业链图谱导出的PNG清晰度问题',
    content: `导出的PNG图片放大后有点模糊，请问有没有办法导出更高清的版本？

我需要把图谱放到研究报告里，对清晰度要求比较高。`,
    category: 'qa',
    author: {
      name: '钱进',
      avatar: '',
      department: '战略规划部',
    },
    createdAt: '2026-01-14T15:20:00Z',
    likes: 8,
    comments: [
      {
        id: 'c8',
        postId: '5',
        author: { name: '开发者', avatar: '', department: 'AI Lab' },
        content: '你好！最新版本已经支持2倍和3倍分辨率导出了，在导出菜单里可以选择。如果还是不够清晰，可以选择导出SVG格式，矢量图放大不会失真。',
        createdAt: '2026-01-14T16:00:00Z',
        likes: 6,
      },
    ],
    favorites: 5,
    views: 87,
    tags: ['产业链图谱', '导出'],
  },
  {
    id: '6',
    title: '吐槽一下食堂...',
    content: `跟AI工具没关系，就是想吐槽一下最近食堂的菜越来越咸了...

有没有同感的？`,
    category: 'talk',
    author: {
      name: '匿名用户',
      avatar: '',
      department: '某部门',
    },
    createdAt: '2026-01-13T12:30:00Z',
    likes: 58,
    comments: [
      {
        id: 'c9',
        postId: '6',
        author: { name: '吃货一号', avatar: '', department: '财务部' },
        content: '+1，而且分量也少了',
        createdAt: '2026-01-13T12:45:00Z',
        likes: 23,
      },
      {
        id: 'c10',
        postId: '6',
        author: { name: '养生达人', avatar: '', department: '人事部' },
        content: '少盐少油才健康（虽然我也觉得太咸了）',
        createdAt: '2026-01-13T13:00:00Z',
        likes: 12,
      },
    ],
    favorites: 3,
    views: 445,
    tags: ['闲聊', '食堂'],
  },
];

// 阅览室 mock 数据
import type { JournalSource, JournalIssue } from '../types';

export const journalSources: JournalSource[] = [
  // 商业财经
  {
    id: 'economist',
    name: 'The Economist',
    description: '全球视野下的经济与政治分析，提供深度的国际时事评论',
    cover: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=400&h=533',
    category: 'business',
    publisher: 'The Economist Group',
    frequency: 'Weekly',
  },
  {
    id: 'hbr',
    name: 'Harvard Business Review',
    description: '专注管理学与商业趋势，为决策者提供前沿的管理理念',
    cover: 'https://images.unsplash.com/photo-1555449372-8d774888e5b4?auto=format&fit=crop&q=80&w=400&h=533',
    category: 'business',
    publisher: 'Harvard Business Publishing',
    frequency: 'Monthly',
  },
  {
    id: 'caixin',
    name: '财新周刊',
    description: '提供财经新闻、商业报道和深度分析，是中国最具影响力的财经媒体之一',
    cover: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=400&h=533',
    category: 'business',
    publisher: 'Caixin Media',
    frequency: 'Weekly',
  },
  {
    id: 'barrons',
    name: "Barron's",
    description: '美国顶级财经周刊，专注金融市场分析和投资建议',
    cover: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400&h=533',
    category: 'business',
    publisher: 'Dow Jones & Company',
    frequency: 'Weekly',
  },
  {
    id: 'businessweek',
    name: 'Bloomberg Businessweek',
    description: '全球商业新闻周刊，提供深入的商业分析和市场洞察',
    cover: 'https://images.unsplash.com/photo-1444653614773-995cb1ef902a?auto=format&fit=crop&q=80&w=400&h=533',
    category: 'business',
    publisher: 'Bloomberg L.P.',
    frequency: 'Weekly',
  },
  {
    id: 'fortune',
    name: 'Fortune',
    description: '美国知名商业杂志，发布世界500强排行榜，关注全球商业领袖与趋势',
    cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400&h=533',
    category: 'business',
    publisher: 'Fortune Media',
    frequency: 'Monthly',
  },
  // 前沿科学
  {
    id: 'nature',
    name: 'Nature',
    description: '国际顶级综合性科学周刊，报道自然科学领域的重要发现',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400&h=533',
    category: 'science',
    publisher: 'Nature Portfolio',
    frequency: 'Weekly',
  },
  // 创新技术
  {
    id: 'mit-tech',
    name: 'MIT Technology Review',
    description: '解读新兴科技及其商业和社会影响，洞察技术未来',
    cover: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=400&h=533',
    category: 'technology',
    publisher: 'MIT',
    frequency: 'Bi-monthly',
  },
  {
    id: 'wired',
    name: 'Wired',
    description: '关注科技如何改变文化、经济和政治，发现未来趋势',
    cover: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400&h=533',
    category: 'technology',
    publisher: 'Condé Nast',
    frequency: 'Monthly',
  },
  // 综合人文
  {
    id: 'newyorker',
    name: 'The New Yorker',
    description: '以其深度报道、政治评论、文化批评和幽默插画而闻名',
    cover: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=400&h=533',
    category: 'general',
    publisher: 'Condé Nast',
    frequency: 'Weekly',
  },
  {
    id: 'time',
    name: 'Time',
    description: '世界知名新闻周刊，报道国际时事、政治、商业和文化',
    cover: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=400&h=533',
    category: 'general',
    publisher: 'Time USA, LLC',
    frequency: 'Weekly',
  },
  {
    id: 'atlantic',
    name: 'The Atlantic',
    description: '深度长篇报道和文化评论，探讨美国社会与全球趋势',
    cover: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=400&h=533',
    category: 'general',
    publisher: 'The Atlantic Monthly Group',
    frequency: 'Monthly',
  },
  // 内部资料
  {
    id: 'hiic',
    name: 'HIIC 内参',
    description: '深圳国家高技术产业创新中心政策研究与产业洞察报告',
    cover: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&q=80&w=400&h=533',
    category: 'internal',
    publisher: 'HIIC',
    frequency: 'Monthly',
  },
];

export const journalIssues: JournalIssue[] = [
  {
    id: 'eco-2024-01-20',
    sourceId: 'economist',
    title: 'The World in 2026',
    issueNumber: 'Issue 9382',
    publishDate: '2026-01-17',
    cover: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=400&h=533',
    pdfUrl: 'https://arxiv.org/pdf/2312.11805.pdf', // 示例 PDF (来自 Arxiv 关于 AI 的论文)
    summary: '本期封面文章探讨了2026年全球地缘政治格局的新变化，以及AI技术在各国产业政策中的核心地位。重点分析了新兴市场国家的经济韧性与供应链重构。',
    keyTakeaways: [
      '全球供应链区域化趋势加速，"近岸外包"成为主流',
      'AI 治理成为各国立法重点，欧盟与美国路径分歧明显',
      '绿色能源转型进入深水区，储能技术突破是关键',
      '新兴市场中，东南亚与印度经济增长预期领跑全球',
    ],
  },
  {
    id: 'nat-2024-01-18',
    sourceId: 'nature',
    title: 'Quantum Leap',
    issueNumber: 'Vol. 625 No. 7995',
    publishDate: '2026-01-15',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400&h=533',
    pdfUrl: 'https://arxiv.org/pdf/2310.16802.pdf', // 示例 PDF
    summary: '本期重点介绍了一项量子计算纠错技术的重大突破，该技术将量子比特的相干时间延长了10倍，为实用化量子计算机铺平了道路。此外，还探讨了CRISPR疗法在罕见病治疗中的最新临床数据。',
    keyTakeaways: [
      '新型量子纠错码方案通过实验验证，容错率提升显著',
      'CRISPR 2.0 疗法在血液病治疗中展现出长期安全性',
      '深海采矿对生物多样性的潜在影响评估报告发布',
      'AI 辅助材料发现：新发现一种超高导热系数的聚合物',
    ],
  },
  {
    id: 'hbr-2024-01',
    sourceId: 'hbr',
    title: 'Leadership in the AI Era',
    issueNumber: 'Jan-Feb 2026',
    publishDate: '2026-01-01',
    cover: 'https://images.unsplash.com/photo-1555449372-8d774888e5b4?auto=format&fit=crop&q=80&w=400&h=533',
    pdfUrl: 'https://arxiv.org/pdf/2401.03462.pdf', // 示例 PDF
    summary: '随着生成式 AI 的普及，管理者的核心职能正在发生转变。本期哈佛商业评论聚焦"人机协作型组织"的构建，探讨如何重新设计工作流程以最大化 AI 效能。',
    keyTakeaways: [
      '管理者需从"监督者"转型为"AI 协调者"与"教练"',
      '构建内部数据护城河是企业应用 AI 的关键差异化优势',
      '软技能（同理心、谈判、战略思维）在 AI 时代溢价提升',
      '案例研究：一家传统制造企业如何通过 AI 实现柔性生产',
    ],
  },
  {
    id: 'internal-2024-03',
    sourceId: 'internal',
    title: '第3期：低空经济产业调研',
    issueNumber: 'No. 2026-03',
    publishDate: '2026-01-19',
    cover: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=400&h=533',
    pdfUrl: 'https://arxiv.org/pdf/2309.13809.pdf', // 示例 PDF
    summary: '本期内参汇总了产业研究部关于深圳市低空经济发展的最新调研成果。报告分析了 eVTOL 技术路径、空域管理政策难点及商业化应用场景。',
    keyTakeaways: [
      '深圳低空经济产业规模预计2026年突破1000亿元',
      '电池能量密度与噪音控制是 eVTOL 商业化落地的两大技术瓶颈',
      '建议加快低空数字底座建设，实现空域精细化管理',
      '物流配送与应急救援是目前最成熟的商业应用场景',
    ],
  },
];
