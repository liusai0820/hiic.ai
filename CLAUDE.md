# HIIC AI Lab - Claude 开发指南

> 深圳国家高技术产业创新中心 AI 工具集网站

## 项目概述

HIIC AI Lab 是一个面向政府智库的 AI 工具集合平台，汇集了 PPT 生成、产业链图谱、思维导图等多款 AI 应用，帮助同事们提升工作效率。

### 技术栈

- **框架**: React 19 + TypeScript 5.x
- **构建工具**: Vite 7
- **样式**: Tailwind CSS v4 + @tailwindcss/typography
- **路由**: React Router DOM v7
- **图标**: Lucide React (严禁使用 emoji)
- **Markdown**: react-markdown + remark-gfm

### 开发命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览构建结果
```

---

## 设计哲学: Institutional Precision

### 核心原则

| 原则 | 说明 |
|------|------|
| **Clarity** | 信息层级通过视觉权重传达 |
| **Restraint** | 有目的的极简，无装饰 |
| **Precision** | 像素级对齐和间距 |
| **Consistency** | 所有元素系统化应用 |

### 视觉语言

1. **纯色设计** - 禁止使用渐变色，所有颜色使用纯色
2. **瑞士设计风格** - 强调网格、对齐、负空间
3. **政府智库调性** - 专业、可信、稳重
4. **简约不简单** - 每个元素都有存在的理由

---

## 色彩系统

### 主色

```css
--color-primary-600: #2563EB;  /* 科技蓝 - 主要操作、链接、强调 */
--color-primary-500: #3B82F6;  /* 悬停状态 */
--color-primary-700: #1D4ED8;  /* 按下状态 */
--color-primary-50:  #EFF6FF;  /* 浅背景 */
```

### 辅助色

```css
--color-violet-600:  #7C3AED;  /* 数据可视化类应用 */
--color-emerald-600: #059669;  /* 成功状态、办公效率类 */
--color-amber-600:   #D97706;  /* 警告、研究分析类 */
--color-rose-600:    #E11D48;  /* 错误状态 */
```

### 中性色 (Slate)

```css
--slate-900: #0F172A;  /* 主要文字 */
--slate-700: #334155;  /* 次要文字 */
--slate-500: #64748B;  /* 辅助文字 */
--slate-200: #E2E8F0;  /* 边框 */
--slate-100: #F1F5F9;  /* 浅背景 */
--slate-50:  #F8FAFC;  /* 页面背景 */
```

### 应用颜色映射

| 应用 | 颜色标识 | 用途 |
|------|----------|------|
| AI 画 PPT | `blue` | bg-primary-600 |
| AI 产业链图谱 | `violet` | bg-violet-600 |
| AI 思维导图 | `emerald` | bg-emerald-600 |
| AI 研究报告 | `amber` | bg-amber-600 |
| AI 数据图表 | `rose` | bg-rose-600 |
| AI 智能检索 | `indigo` | bg-indigo-600 |

---

## 字体规范

### 英文字体

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-serif: 'DM Serif Display', Georgia, serif;  /* 用于大标题 */
```

### 中文字体

```css
font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
```

### 代码字体

```css
font-family: 'Geist Mono', 'JetBrains Mono', monospace;
```

### 字号规范

| 用途 | Tailwind 类 | 备注 |
|------|-------------|------|
| 页面大标题 | `text-4xl sm:text-5xl lg:text-6xl` | 使用 font-serif |
| 区块标题 | `text-2xl sm:text-3xl` | font-bold |
| 卡片标题 | `text-lg` | font-semibold |
| 正文 | `text-base` 或 `text-sm` | - |
| 标签/说明 | `text-xs` | 通常配合 text-slate-500 |

---

## 间距系统

基于 4px 网格:

```
4px  → p-1, m-1
8px  → p-2, m-2
12px → p-3, m-3
16px → p-4, m-4
24px → p-6, m-6
32px → p-8, m-8
48px → p-12, m-12
64px → p-16, m-16
```

### 常用间距

- 组件内部 padding: `p-6` (24px)
- 卡片间距: `gap-6` (24px)
- 区块间距: `py-20` (80px)
- 页面边距: `px-4 sm:px-6 lg:px-8`

---

## 组件规范

### 圆角

```css
rounded-md   → 6px   /* 小按钮、标签 */
rounded-lg   → 8px   /* 输入框 */
rounded-xl   → 12px  /* 按钮、图标容器 */
rounded-2xl  → 16px  /* 卡片、弹窗 */
```

### 阴影

```css
shadow-card:     0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06);
shadow-elevated: 0 10px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
shadow-floating: 0 25px 80px rgba(0,0,0,0.12), 0 10px 30px rgba(0,0,0,0.08);
```

### 图标

- **库**: Lucide React
- **尺寸**:
  - 小图标: `w-4 h-4`
  - 中图标: `w-5 h-5`
  - 大图标: `w-6 h-6`
  - 特大图标: `w-8 h-8`
- **描边**: 2px (默认)
- **禁止**: 使用 emoji 替代图标

### 按钮样式

```jsx
// 主要按钮
className="btn-primary"  // bg-primary-600 text-white

// 次要按钮
className="btn-secondary"  // bg-slate-100 text-slate-700

// 幽灵按钮
className="btn-ghost"  // transparent, hover:bg-slate-100
```

### 卡片样式

```jsx
className="card"  // bg-white rounded-2xl border shadow-card hover:shadow-elevated
```

---

## 动画规范

### 入场动画

```css
animate-fade-in   /* 淡入 */
animate-slide-up  /* 从下方滑入 */
animate-scale-in  /* 缩放进入 */
```

### 延迟类

```css
delay-100, delay-200, delay-300...  /* 100ms 递增 */
```

### 过渡

```css
transition-all duration-200  /* 快速交互 */
transition-all duration-300  /* 标准过渡 */
transition-all duration-500  /* 慢速强调 */
```

---

## 文件结构

```
src/
├── components/          # 可复用组件
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── AppCard.tsx
│   ├── AppDetailModal.tsx
│   ├── AnnouncementBanner.tsx
│   ├── CategoryFilter.tsx
│   ├── FeaturedApp.tsx
│   ├── TutorialSection.tsx
│   ├── CommunitySection.tsx
│   ├── Changelog.tsx
│   ├── DeveloperSection.tsx
│   ├── FeedbackModal.tsx
│   ├── MobileFeedbackButton.tsx
│   ├── Footer.tsx
│   └── index.ts         # 统一导出
├── pages/
│   └── TutorialPage.tsx # 教程详情页
├── data/
│   └── index.ts         # 应用、公告、教程等数据
├── types/
│   └── index.ts         # TypeScript 类型定义
├── App.tsx              # 路由配置
├── main.tsx             # 入口文件
└── index.css            # 全局样式 + Tailwind 配置
```

---

## 开发约定

### 组件开发

1. 使用函数组件 + Hooks
2. 文件名使用 PascalCase
3. 导出时在 `components/index.ts` 统一管理
4. Props 接口放在组件文件内，以 `XxxProps` 命名

### 样式约定

1. 优先使用 Tailwind 类，避免自定义 CSS
2. 复杂样式抽取到 `index.css` 作为工具类
3. 响应式断点: `sm:640px` `md:768px` `lg:1024px` `xl:1280px`
4. 移动优先 (Mobile First) 设计

### 状态管理

1. 简单状态用 `useState`
2. 复杂计算用 `useMemo`
3. 持久化数据用 `localStorage`
4. 无需全局状态管理库

### 代码风格

1. 使用 ESLint + Prettier 格式化
2. 避免 `any` 类型，定义明确的接口
3. 注释使用中文
4. 组件内部按功能分块，用注释标记

---

## 特殊注意事项

### 禁止事项

- ❌ 使用渐变色
- ❌ 使用 emoji
- ❌ 使用 Inter 以外的通用字体 (如 Roboto, Arial)
- ❌ 添加过度装饰
- ❌ 忽视移动端适配

### 推荐做法

- ✅ 使用 Lucide 图标
- ✅ 保持纯色设计
- ✅ 注重负空间
- ✅ 动画要克制
- ✅ 移动端优先测试

---

## 品牌资产

品牌指南文件位于 `/brand/` 目录:

- `HIIC-AI-Lab-Design-Philosophy.md` - 设计哲学文档
- `HIIC-AI-Lab-Brand-Guidelines.png` - 品牌指南海报
- `create_brand_poster.py` - 海报生成脚本

---

## 联系方式

- **开发者**: Lius
- **GitHub**: https://github.com/liusai0820
- **邮箱**: ai@hiic.org.cn
- **组织**: 深圳国家高技术产业创新中心
