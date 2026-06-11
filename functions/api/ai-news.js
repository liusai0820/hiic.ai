const DEFAULT_FEED_URL = 'https://www.latent.space/feed';
const DEFAULT_SECTION_URL = 'https://www.latent.space/s/ainews?utm_source=hiic.ai&utm_medium=portal';
const DEFAULT_TAKE = 18;
const MAX_TAKE = 50;
const MAX_ISSUES = 8;
const MAX_HIGHLIGHTS_PER_ISSUE = 6;
const CACHE_SECONDS = 43200;

const ENTITY_MAP = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '-',
  mdash: '-',
  lsquo: "'",
  rsquo: "'",
  ldquo: '"',
  rdquo: '"',
  hellip: '...',
};

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': `public, max-age=300, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400`,
      ...init.headers,
    },
  });
}

function normalizeTake(value) {
  const parsed = Number.parseInt(value ?? '', 10);
  if (Number.isNaN(parsed)) return DEFAULT_TAKE;
  return Math.min(Math.max(parsed, 1), MAX_TAKE);
}

function stripCdata(value) {
  return value.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '');
}

function decodeEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (entity, name) => ENTITY_MAP[name] ?? entity);
}

function htmlToText(html = '') {
  return decodeEntities(stripCdata(html))
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(p|li|h1|h2|h3|blockquote|div)>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTag(block, tagName) {
  const escapedName = tagName.replace(':', '\\:');
  const match = block.match(new RegExp(`<${escapedName}[^>]*>([\\s\\S]*?)<\\/${escapedName}>`, 'i'));
  return match ? stripCdata(match[1]).trim() : '';
}

function makeId(value) {
  return value
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

function truncateText(value, maxLength) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trim()}...`;
}

function normalizeIssueTitle(title) {
  return htmlToText(title).replace(/^\[AINews\]\s*/i, '').trim();
}

function classifyCategory(rawCategory, title) {
  const combined = `${rawCategory} ${title}`.toLowerCase();
  if (combined.includes('reddit') || combined.includes('community')) return '社区观察';
  if (combined.includes('agent') || combined.includes('harness')) return 'Agent 与工具';
  if (combined.includes('model') || combined.includes('gemma') || combined.includes('claude')) return '模型动态';
  if (combined.includes('infra') || combined.includes('benchmark') || combined.includes('eval')) return '技术基础设施';
  if (combined.includes('open') || combined.includes('local')) return '开源与本地化';
  return rawCategory.includes('Twitter') ? '技术社区' : 'AI 动态';
}

function currentRecapCategory(html, offset) {
  const prefix = html.slice(0, offset);
  const headings = [...prefix.matchAll(/<h1><strong>([\s\S]*?)<\/strong><\/h1>/gi)];
  const latest = headings.at(-1)?.[1] ?? 'AI 动态';
  return htmlToText(latest);
}

function extractFirstListSummary(listHtml) {
  const firstItem = listHtml.match(/<li[^>]*>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/li>/i)
    ?? listHtml.match(/<li[^>]*>([\s\S]*?)<\/li>/i);
  return htmlToText(firstItem?.[1] ?? listHtml);
}

function extractHighlights(issue) {
  const highlights = [];
  const html = issue.contentHtml;
  const sectionRegex = /<p><strong>([\s\S]*?)<\/strong><\/p>\s*<ul>([\s\S]*?)<\/ul>/gi;
  let match;

  while ((match = sectionRegex.exec(html)) !== null) {
    const rawTitle = htmlToText(match[1]);
    const rawSummary = extractFirstListSummary(match[2]);
    if (!rawTitle || !rawSummary) continue;
    if (/^top tweets/i.test(rawTitle)) continue;
    if (rawTitle.length > 180) continue;

    const recapCategory = currentRecapCategory(html, match.index);
    const id = `${issue.id}-${makeId(rawTitle)}`;
    highlights.push({
      id,
      issueId: issue.id,
      issueTitle: issue.title,
      title: rawTitle,
      summary: truncateText(rawSummary, 420),
      url: issue.url,
      source: 'Latent.Space AINews',
      publishedAt: issue.publishedAt,
      category: classifyCategory(recapCategory, rawTitle),
      tags: [recapCategory].filter(Boolean).slice(0, 2),
      rawLanguage: 'en',
    });

    if (highlights.length >= MAX_HIGHLIGHTS_PER_ISSUE) break;
  }

  if (highlights.length > 0) return highlights;

  return [{
    id: issue.id,
    issueId: issue.id,
    issueTitle: issue.title,
    title: issue.title,
    summary: truncateText(issue.description, 420),
    url: issue.url,
    source: 'Latent.Space AINews',
    publishedAt: issue.publishedAt,
    category: 'AI 动态',
    tags: ['AINews'],
    rawLanguage: 'en',
  }];
}

function parseRss(xml) {
  const itemBlocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];

  return itemBlocks
    .map((block) => {
      const rawTitle = getTag(block, 'title');
      const sourceTitle = htmlToText(rawTitle);
      const title = normalizeIssueTitle(rawTitle);
      const url = htmlToText(getTag(block, 'link'));
      const publishedAt = htmlToText(getTag(block, 'pubDate'));
      const description = htmlToText(getTag(block, 'description'));
      const contentHtml = stripCdata(getTag(block, 'content:encoded'));

      return {
        id: makeId(url || title),
        isAinews: sourceTitle.toLowerCase().includes('[ainews]'),
        title,
        url,
        publishedAt,
        description,
        contentHtml,
      };
    })
    .filter((issue) => issue.title && issue.url && issue.publishedAt)
    .filter((issue) => issue.isAinews)
    .slice(0, MAX_ISSUES);
}

function sortByDateDesc(items) {
  return [...items].sort((left, right) => {
    return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
  });
}

function getDeepSeekEndpoint(env) {
  const baseUrl = env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
  return baseUrl.endsWith('/chat/completions') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/chat/completions`;
}

function parseModelJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
  }
}

async function rewriteWithDeepSeek(items, env) {
  if (!env.DEEPSEEK_API_KEY) {
    return { mode: 'fallback', model: null, items };
  }

  const model = env.DEEPSEEK_MODEL || 'deepseek-v4-flash';
  const payloadItems = items.slice(0, DEFAULT_TAKE).map((item) => ({
    id: item.id,
    title: item.title,
    summary: truncateText(item.summary, 520),
    category: item.category,
    tags: item.tags,
  }));

  const response = await fetch(getDeepSeekEndpoint(env), {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 5200,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: [
            '你是深圳国家高技术产业创新中心 HIIC AI Lab 的资讯编辑。',
            '任务：把英文 AI News 条目精翻并改写成中文智库门户时间轴内容。',
            '要求：只基于给定事实，不新增事实；标题不超过 32 个汉字；摘要 70-120 个汉字；语气专业、克制、可读；category 保持中文分类；tags 每条 1-3 个中文短标签。',
            '只返回 JSON，结构为 {"items":[{"id":"","title":"","summary":"","category":"","tags":[""]}]}。',
          ].join('\n'),
        },
        {
          role: 'user',
          content: JSON.stringify({ items: payloadItems }),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek processing returned ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new Error('DeepSeek response did not include message content');
  }

  const parsed = parseModelJson(content);
  if (!parsed || !Array.isArray(parsed.items)) {
    throw new Error('DeepSeek response was not valid item JSON');
  }

  const rewrittenById = new Map(parsed.items.map((item) => [item.id, item]));
  const rewrittenItems = items.map((item) => {
    const rewritten = rewrittenById.get(item.id);
    if (!rewritten) return item;

    return {
      ...item,
      title: typeof rewritten.title === 'string' && rewritten.title.trim() ? rewritten.title.trim() : item.title,
      summary: typeof rewritten.summary === 'string' && rewritten.summary.trim()
        ? rewritten.summary.trim()
        : item.summary,
      category: typeof rewritten.category === 'string' && rewritten.category.trim()
        ? rewritten.category.trim()
        : item.category,
      tags: Array.isArray(rewritten.tags)
        ? rewritten.tags.filter((tag) => typeof tag === 'string' && tag.trim()).slice(0, 3)
        : item.tags,
      processedLanguage: 'zh-CN',
    };
  });

  return { mode: 'deepseek', model, items: rewrittenItems };
}

function buildDailySections(items) {
  const grouped = new Map();
  for (const item of items.slice(0, 18)) {
    const group = grouped.get(item.category) ?? [];
    group.push({
      title: item.title,
      summary: item.summary,
      url: item.url,
      source: item.source,
    });
    grouped.set(item.category, group);
  }

  return [...grouped.entries()].map(([label, groupItems]) => ({
    label,
    items: groupItems.slice(0, 4),
  }));
}

export async function onRequestGet(context) {
  const requestUrl = new URL(context.request.url);
  const take = normalizeTake(requestUrl.searchParams.get('take'));
  const processor = requestUrl.searchParams.get('processor') === 'fallback' ? 'fallback' : 'auto';
  const feedUrl = context.env.AI_NEWS_FEED_URL || DEFAULT_FEED_URL;
  const cacheKey = new Request(`${requestUrl.origin}${requestUrl.pathname}?take=${take}&processor=${processor}`);

  if (typeof caches !== 'undefined') {
    const cachedResponse = await caches.default.match(cacheKey);
    if (cachedResponse) return cachedResponse;
  }

  try {
    const feedResponse = await fetch(feedUrl, {
      headers: {
        accept: 'application/rss+xml, application/xml;q=0.9, text/xml;q=0.8',
        'user-agent': 'HIIC-AI-Lab/1.0 (+https://hiic.ai)',
      },
    });

    if (!feedResponse.ok) {
      throw new Error(`AINews feed returned ${feedResponse.status}`);
    }

    const xml = await feedResponse.text();
    const issues = parseRss(xml);
    const rawItems = sortByDateDesc(issues.flatMap(extractHighlights)).slice(0, take);
    const processed = processor === 'fallback'
      ? { mode: 'fallback', model: null, items: rawItems }
      : await rewriteWithDeepSeek(rawItems, context.env).catch(() => ({
          mode: 'fallback',
          model: null,
          items: rawItems,
        }));

    const response = jsonResponse({
      source: {
        name: 'Latent.Space AINews',
        homepage: DEFAULT_SECTION_URL,
        feed: feedUrl,
      },
      processing: {
        mode: processed.mode,
        model: processed.model,
        language: processed.mode === 'deepseek' ? 'zh-CN' : 'source',
        style: 'HIIC daily AI brief',
      },
      generatedAt: new Date().toISOString(),
      items: processed.items,
      count: processed.items.length,
      issues: issues.map((issue) => ({
        id: issue.id,
        title: issue.title,
        url: issue.url,
        publishedAt: issue.publishedAt,
      })),
      daily: {
        date: new Date().toISOString().slice(0, 10),
        generatedAt: new Date().toISOString(),
        sections: buildDailySections(processed.items),
      },
    });

    if (typeof caches !== 'undefined') {
      context.waitUntil(caches.default.put(cacheKey, response.clone()));
    }

    return response;
  } catch (error) {
    return jsonResponse(
      {
        source: {
          name: 'Latent.Space AINews',
          homepage: DEFAULT_SECTION_URL,
          feed: feedUrl,
        },
        processing: {
          mode: 'unavailable',
          model: null,
          language: 'source',
          style: 'HIIC daily AI brief',
        },
        generatedAt: new Date().toISOString(),
        items: [],
        daily: { sections: [] },
        error: error instanceof Error ? error.message : 'AINews feed fetch failed',
      },
      { status: 502, headers: { 'cache-control': 'public, max-age=60, s-maxage=120' } },
    );
  }
}
