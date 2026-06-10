const AIHOT_BASE_URL = 'https://aihot.virxact.com';
const DEFAULT_TAKE = 8;
const MAX_TAKE = 20;

const categoryLabels = {
  'ai-products': 'AI 产品',
  'ai-models': '模型动态',
  paper: '论文研究',
  tip: '技巧观点',
};

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=120, s-maxage=300, stale-while-revalidate=1800',
      ...init.headers,
    },
  });
}

function normalizeTake(value) {
  const parsed = Number.parseInt(value ?? '', 10);
  if (Number.isNaN(parsed)) return DEFAULT_TAKE;
  return Math.min(Math.max(parsed, 1), MAX_TAKE);
}

async function fetchJson(pathname, searchParams = {}) {
  const url = new URL(pathname, AIHOT_BASE_URL);
  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'HIIC-AI-Lab/1.0 (+https://hiic.ai)',
    },
  });

  if (!response.ok) {
    throw new Error(`AI HOT ${pathname} returned ${response.status}`);
  }

  return response.json();
}

function normalizeItem(item) {
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    url: item.url,
    source: item.source,
    publishedAt: item.publishedAt,
    category: categoryLabels[item.category] ?? item.category ?? 'AI 动态',
    score: item.score,
  };
}

function normalizeDailySection(section) {
  return {
    label: section.label,
    items: Array.isArray(section.items)
      ? section.items.slice(0, 4).map((item) => ({
          title: item.title,
          summary: item.summary,
          url: item.sourceUrl,
          source: item.sourceName,
        }))
      : [],
  };
}

export async function onRequestGet(context) {
  const requestUrl = new URL(context.request.url);
  const take = normalizeTake(requestUrl.searchParams.get('take'));

  try {
    const [itemsPayload, dailyPayload] = await Promise.all([
      fetchJson('/api/public/items', { mode: 'selected', take }),
      fetchJson('/api/public/daily'),
    ]);

    return jsonResponse({
      source: {
        name: 'AI HOT',
        homepage: AIHOT_BASE_URL,
        agent: `${AIHOT_BASE_URL}/agent`,
        api: `${AIHOT_BASE_URL}/api/public/items?mode=selected&take=${take}`,
        rss: `${AIHOT_BASE_URL}/feed.xml`,
      },
      generatedAt: new Date().toISOString(),
      items: Array.isArray(itemsPayload.items) ? itemsPayload.items.map(normalizeItem) : [],
      daily: {
        date: dailyPayload.date,
        generatedAt: dailyPayload.generatedAt,
        sections: Array.isArray(dailyPayload.sections)
          ? dailyPayload.sections.map(normalizeDailySection).filter((section) => section.items.length > 0)
          : [],
      },
    });
  } catch (error) {
    return jsonResponse(
      {
        source: {
          name: 'AI HOT',
          agent: `${AIHOT_BASE_URL}/agent`,
          rss: `${AIHOT_BASE_URL}/feed.xml`,
        },
        generatedAt: new Date().toISOString(),
        items: [],
        daily: { sections: [] },
        error: error instanceof Error ? error.message : 'AI HOT fetch failed',
      },
      { status: 502, headers: { 'cache-control': 'public, max-age=30, s-maxage=60' } },
    );
  }
}
