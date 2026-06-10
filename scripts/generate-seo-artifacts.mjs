import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const contentPath = path.join(rootDir, 'content', 'portal.json');
const publicDir = path.join(rootDir, 'public');
const dataDir = path.join(publicDir, 'data');

const kindRoutes = {
  app: '/apps',
  skill: '/skills',
  tutorial: '/tutorials',
  insight: '/insights',
  report: '/reports',
  collection: '/collections',
};

const kindPlural = {
  app: 'apps',
  skill: 'skills',
  tutorial: 'tutorials',
  insight: 'insights',
  report: 'reports',
  collection: 'collections',
};

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function getItemPath(item) {
  return `${kindRoutes[item.kind]}/${item.slug}`;
}

function absoluteUrl(site, route) {
  return `${site.baseUrl}${route}`;
}

function compactItem(item, site) {
  return {
    id: `${item.kind}:${item.slug}`,
    kind: item.kind,
    slug: item.slug,
    url: absoluteUrl(site, getItemPath(item)),
    title: item.title,
    summary: item.summary,
    description: item.description,
    category: item.category,
    tags: item.tags,
    author: item.author,
    date: item.date,
    updatedAt: item.updatedAt,
    status: item.status,
    ctaUrl: item.ctaUrl,
    agent: item.agent,
    related: item.related,
  };
}

function toJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

const raw = await readFile(contentPath, 'utf8');
const portal = JSON.parse(raw);
const { site, items } = portal;
const latestUpdatedAt = items
  .map((item) => item.updatedAt)
  .sort()
  .at(-1);

await mkdir(dataDir, { recursive: true });

const aiIndex = {
  site,
  generatedAt: latestUpdatedAt,
  access: {
    sitemap: absoluteUrl(site, '/sitemap.xml'),
    feed: absoluteUrl(site, '/feed.json'),
    llms: absoluteUrl(site, '/llms.txt'),
    data: absoluteUrl(site, '/data/'),
  },
  contentKinds: Object.entries(kindRoutes).map(([kind, route]) => ({
    kind,
    route: absoluteUrl(site, route),
    data: absoluteUrl(site, `/data/${kindPlural[kind]}.json`),
  })),
  items: items.map((item) => compactItem(item, site)),
};

await writeFile(path.join(publicDir, 'ai-index.json'), toJson(aiIndex));

for (const [kind, plural] of Object.entries(kindPlural)) {
  const kindItems = items
    .filter((item) => item.kind === kind)
    .map((item) => compactItem(item, site));
  await writeFile(path.join(dataDir, `${plural}.json`), toJson({ site, kind, items: kindItems }));
}

const sitemapEntries = [
  { loc: absoluteUrl(site, '/'), lastmod: latestUpdatedAt, priority: '1.0' },
  ...Object.values(kindRoutes).map((route) => ({
    loc: absoluteUrl(site, route),
    lastmod: latestUpdatedAt,
    priority: '0.8',
  })),
  ...items.map((item) => ({
    loc: absoluteUrl(site, getItemPath(item)),
    lastmod: item.updatedAt,
    priority: item.featured ? '0.8' : '0.6',
  })),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map((entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <priority>${entry.priority}</priority>
  </url>`)
  .join('\n')}
</urlset>
`;

await writeFile(path.join(publicDir, 'sitemap.xml'), sitemap);

const feedItems = items
  .filter((item) => ['insight', 'report', 'tutorial'].includes(item.kind))
  .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
  .slice(0, 20)
  .map((item) => ({
    id: `${item.kind}:${item.slug}`,
    url: absoluteUrl(site, getItemPath(item)),
    title: item.title,
    summary: item.summary,
    content_text: `${item.description}\n\n${item.sections.map((section) => `${section.heading}: ${section.body}`).join('\n')}`,
    date_published: item.date,
    date_modified: item.updatedAt,
    authors: [{ name: item.author }],
    tags: item.tags,
  }));

const feed = {
  version: 'https://jsonfeed.org/version/1.1',
  title: site.name,
  home_page_url: site.baseUrl,
  feed_url: absoluteUrl(site, '/feed.json'),
  description: site.description,
  language: site.language,
  items: feedItems,
};

await writeFile(path.join(publicDir, 'feed.json'), toJson(feed));

const llmsSections = Object.entries(kindRoutes)
  .map(([kind, route]) => {
    const kindItems = items.filter((item) => item.kind === kind);
    const lines = kindItems.map((item) => `- [${item.title}](${absoluteUrl(site, getItemPath(item))}): ${item.summary}`);
    return `## ${kindPlural[kind]}\n\n- [Index](${absoluteUrl(site, route)})\n- [Data](${absoluteUrl(site, `/data/${kindPlural[kind]}.json`)})\n${lines.join('\n')}`;
  })
  .join('\n\n');

const llmsText = `# ${site.name}

${site.description}

## Agent entry points

- [AI Index](${absoluteUrl(site, '/ai-index.json')})
- [Sitemap](${absoluteUrl(site, '/sitemap.xml')})
- [JSON Feed](${absoluteUrl(site, '/feed.json')})

${llmsSections}
`;

await writeFile(path.join(publicDir, 'llms.txt'), llmsText);

const robots = `User-agent: *
Allow: /

Sitemap: ${absoluteUrl(site, '/sitemap.xml')}
`;

await writeFile(path.join(publicDir, 'robots.txt'), robots);
