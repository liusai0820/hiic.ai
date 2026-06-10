# HIIC AI Lab 内容维护说明

`content/portal.json` 是门户内容的主入口。以后新增应用、Skill、教程、资讯、报告或专题集合，优先改这里，不需要先改页面代码。

## 内容类型

- `app`: AI 应用与工具
- `skill`: 可复用 AI Skill 或方法
- `tutorial`: 教程与操作指南
- `insight`: 资讯、观察、报道解读
- `report`: 研究报告
- `collection`: 专题集合或计划成果页

## Agent 维护流程

1. 在 `items` 中新增一条内容，保证 `kind + slug` 唯一。
2. 补齐 `title`、`summary`、`description`、`category`、`tags`、`date`、`updatedAt`、`sections`、`seo`。
3. 如果内容希望被首页优先展示，把 `featured` 设为 `true`。
4. `related` 只引用已经存在的 `kind + slug`。
5. 本地运行 `npm run generate:seo`，生成 `public/ai-index.json`、`public/llms.txt`、`public/sitemap.xml`、`public/feed.json` 和 `public/data/*.json`。

## SEO / GEO 约定

- 每条内容都应该有独立 URL，例如 `/apps/ppt`、`/skills/rag-knowledge-base`。
- `seo.title` 建议控制在 30 个中文字符左右。
- `seo.description` 建议说明对象、用途和核心价值。
- `agent` 字段用于给 AI agent 读取：说明目的、输入、输出和访问方式。
- 外部报道或事实性内容应保留来源说明；如果没有来源，不写成“最新事实”，写成“观察”或“方法”。
