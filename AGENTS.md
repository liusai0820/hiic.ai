# HIIC AI Lab Agent Guide

本仓库是 `hiic.ai` 官网与 AI 门户。所有 agent 维护时，默认使用简体中文沟通，并优先交付可运行、可上线、可验证的结果。

## 项目目标

`hiic.ai` 是深国创中心对外展示 AI 综合能力的集中门户：

- 展示内部同事开发的 AI 应用。
- 沉淀可复用 AI Skill、教程和方法论。
- 发布 AI 资讯观察、最新报道解读和研究报告。
- 给搜索引擎和 AI agent 提供结构化索引。

## 关键文件

- `DESIGN.md`: 项目视觉、品牌色、小七 IP 使用规范。
- `content/portal.json`: 门户内容主数据源。
- `content/README.md`: 内容维护说明。
- `scripts/generate-seo-artifacts.mjs`: 生成 SEO/GEO 公开文件。
- `functions/api/ai-news.js`: 拉取每日 AI News RSS，拆分为议题级动态，并按配置调用 DeepSeek 做中文精编。
- `functions/api/ai-consulting.js`: 旧入口兼容跳转到 `/api/ai-news`，不要再接入新页面。
- `src/content/portal.ts`: 前端内容类型和查询方法。
- `src/pages/ContentListPage.tsx`: 栏目页模板。
- `src/pages/ContentDetailPage.tsx`: 详情页模板。
- `src/App.tsx`: 首页与全站路由入口。
- `public/brand/`: 小七 IP 与品牌资产。
  - `hiic-logo-mark-white.png`: Header 当前使用的 HIIC 左侧标识。用户提供新 logo 时优先替换这个文件。
  - `hiic-official-lockup-white.png`: 正式机构 logo 锁定组合。
  - `xiaoqi-*.png`: 小七官方 IP 素材。
  - `xiaoqi-boy-standing-3d.png` / `xiaoqi-girl-standing-3d.png`: 七哥、七妹单人站姿透明素材。

## 开发命令

- `npm run generate:seo`: 从 `content/portal.json` 生成公开索引。
- `npm run build`: 生成索引、类型检查并构建生产包。
- `npm run lint`: 全量 lint。当前旧模块仍有历史 lint 问题，新增文件应单独保持通过。
- `npm run preview -- --host 127.0.0.1 --port 4173`: 本地预览生产包。

## 内容维护流程

新增应用、Skill、教程、资讯、报告或专题时：

1. 修改 `content/portal.json`，保证 `kind + slug` 唯一。
2. 补齐 `title`、`summary`、`description`、`category`、`tags`、`date`、`updatedAt`、`sections`、`seo`、`agent`。
3. 需要首页展示时，设置 `featured: true`。
4. `related` 只能引用已经存在的 `kind + slug`。
5. 运行 `npm run generate:seo`。
6. 运行 `npm run build`。

职场办公 Skill 维护口径：

- 优先覆盖真实办公场景：职场办公、PPT 制作、数据处理、数据分析、咨询研究、研究报告、财务分析、行政协同、营销设计、人力资源。
- 每条 Skill 必须有独立详情页、可执行输入输出、验收标准和 agent metadata。
- 新增 Skill 后必须确认 `related` 引用存在，避免详情页断链。

每日 AI 动态内容：

- 首页和资讯页的动态来自 `/api/ai-news`，旧 `/api/ai-consulting` 只保留为兼容跳转。
- 默认上游源是 Latent.Space AINews RSS：`https://www.latent.space/feed`，后续如要换成 Gmail/RSS 内部源，配置 `AI_NEWS_FEED_URL` 即可。
- DeepSeek 精编通过环境变量配置：`DEEPSEEK_API_KEY`、`DEEPSEEK_BASE_URL`、`DEEPSEEK_MODEL`。不要把 key 写入代码、文档或聊天输出。
- 实时动态不写死进 `content/portal.json`；如果外部源失败，前端会回退到本地资讯。
- 资讯页必须把动态并入主时间轴，默认拉取 50 条议题级内容，不要再做右侧实时资讯卡。
- 用户界面不展示“来源 / RSS / REST API”等维护入口；这些只保留在代码和维护文档里。

Skill 详情页：

- Skill 页面必须像 `SKILL.md` 文档，不是普通介绍页。
- 每条 Skill 至少展示什么时候用、输入资料、输出结果、执行流程、验收标准、示例输入和可复制 Prompt。
- 不要只展示摘要、标签和三段简介；用户点进 Skill 后要能直接复制使用。

## 设计维护规则

- 修改页面前先读 `DESIGN.md`。
- 必须使用深国创品牌蓝和科技辅助色，不能退回纯黑白灰。
- Header 必须使用正式 HIIC 机构 logo，不要使用临时星星图标或单独 AI 方块替代。
- 资讯/观察栏目使用时间轴或列表流，不做普通卡片网格。
- 小七素材必须来自 `public/brand/` 或官方规范，不得用 CSS 手绘、emoji、占位图替代。
- 不得修改小七比例、颜色、服装、发型、呆毛方向、五官比例。
- 小七动效只允许轻微漂浮、呼吸、淡入、hover，不做夸张弹跳或低龄化效果。
- 小七露出必须按页面语境变化素材和文案，不要全站复制同一张图、同一句导览话术、同一种侧边色条卡片。
- 小七模块应像页面里的自然插画旁注，不应写成“AI 助手”“导览机器人”、固定客服组件或悬浮广告。

## SEO / GEO 规则

每次内容变更后，必须同步公开索引：

- `public/sitemap.xml`
- `public/feed.json`
- `public/llms.txt`
- `public/ai-index.json`
- `public/data/*.json`

如果新增路由，确认 `_redirects` 仍保留 SPA fallback：

```text
/* /index.html 200
```

## 部署

生产部署目标是 Cloudflare Pages 项目 `hiic-ai`。不要向用户索取或回显 secret。

当前本机可用方式：

- 优先使用 shell 中已经存在的 `CLOUDFLARE_API_TOKEN` 登录态。
- 旧的 `/Users/lius/.codex/bin/cloudflare-token` 可能失效；若使用它，必须先通过 Cloudflare verify 接口确认有效，且不能打印 token。

常用部署流程：

```bash
npm run build
npx wrangler@latest pages deploy dist --project-name hiic-ai --branch main
```

部署后至少验证：

- `https://hiic.ai/`
- `https://hiic.ai/apps`
- `https://hiic.ai/reports/ai-industry-outlook-2026`
- `https://hiic.ai/llms.txt`
- `https://hiic.ai/ai-index.json`
- `https://hiic.ai/sitemap.xml`

## Git 规则

- 提交前运行 `git status` 和必要的 `git diff`。
- 不使用 `git add .`，只加入本次相关文件。
- 不回滚用户未要求回滚的改动。
- 不使用 `--force push`。

## 当前已知情况

全量 `npm run lint` 仍会被旧文件历史问题阻断，主要在 `AnnouncementBanner`、`FeedbackModal`、`JournalReader`、`AuthContext`、旧 `TutorialPage` 和 `workers/library-api`。新增或本次修改文件必须单独 lint 通过。
