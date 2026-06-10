import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter, Search } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { PortalFooter, PortalTopBar } from '../components/PortalPageChrome';
import {
  getCanonicalUrl,
  getItemPath,
  getItemsByKind,
  kindPluralLabels,
  kindRoutes,
  siteConfig,
  statusLabels,
  type PortalContentKind,
} from '../content/portal';

const listIntros: Record<PortalContentKind, string> = {
  app: '集中展示同事们已经上线或正在筹备的 AI 应用，让外部看到能力，让内部更容易复用。',
  skill: '沉淀可复制的方法、提示词和工作流，把一次性经验变成组织能力。',
  tutorial: '用步骤化教程帮助同事快速上手工具，并把最佳实践稳定传递下去。',
  insight: '记录 AI 相关资讯、产业观察和应用判断，形成可持续更新的外部窗口。',
  report: '展示 HIIC AI Lab 的研究报告、方法论和对产业趋势的判断。',
  collection: '把阶段性计划、专题成果和能力地图组织成可以连续追踪的展示页。',
};

interface ContentListPageProps {
  kind: PortalContentKind;
}

export function ContentListPage({ kind }: ContentListPageProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  const items = getItemsByKind(kind);
  const categories = ['全部', ...Array.from(new Set(items.map((item) => item.category)))];

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory = category === '全部' || item.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.summary.toLowerCase().includes(normalizedQuery) ||
        item.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));

      return matchesCategory && matchesQuery;
    });
  }, [category, items, query]);

  const pageTitle = `${kindPluralLabels[kind]} - ${siteConfig.name}`;
  const canonicalPath = kindRoutes[kind];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: kindPluralLabels[kind],
    description: listIntros[kind],
    url: getCanonicalUrl(canonicalPath),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: getCanonicalUrl(getItemPath(item)),
    })),
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <PageMeta
        title={pageTitle}
        description={listIntros[kind]}
        canonicalPath={canonicalPath}
        image="/reports/ai-industry-outlook-2026.jpg"
        jsonLd={jsonLd}
      />
      <PortalTopBar />

      <main>
        <section className="border-b border-slate-200">
          <div className="mx-auto max-w-[1344px] px-6 py-10 lg:px-10 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
              <div>
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950">
                  HIIC AI Lab <ArrowRight className="h-4 w-4" />
                </Link>
                <h1 className="mt-5 font-serif text-5xl font-semibold leading-none tracking-tight text-slate-950 sm:text-6xl">
                  {kindPluralLabels[kind]}
                </h1>
                <p className="mt-5 max-w-[620px] text-base leading-7 text-slate-600">
                  {listIntros[kind]}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <label className="relative block">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="搜索标题、标签或摘要"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </label>
                <div className="flex items-center gap-2 overflow-x-auto">
                  <Filter className="hidden h-4 w-4 text-slate-400 sm:block" />
                  {categories.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={`h-11 shrink-0 rounded-lg border px-4 text-sm font-semibold transition ${
                        item === category
                          ? 'border-slate-950 bg-slate-950 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1344px] px-6 py-8 lg:px-10 lg:py-10">
          <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
            <p className="text-sm font-semibold text-slate-600">
              共 {filteredItems.length} 项内容
            </p>
            <a href="/ai-index.json" className="text-sm font-semibold text-slate-950 hover:text-blue-700">
              Agent 索引
            </a>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <Link
                  key={`${item.kind}-${item.slug}`}
                  to={getItemPath(item)}
                  className="group flex min-h-[260px] flex-col rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm"
                >
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <span className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-bold text-slate-600">
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {statusLabels[item.status]}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-950">
                    {item.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {item.summary}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto border-t border-slate-100 pt-5">
                    <div className="grid grid-cols-3 divide-x divide-slate-100">
                      {item.metrics.slice(0, 3).map((metric) => (
                        <div key={metric.label} className="px-3 first:pl-0 last:pr-0">
                          <p className="truncate text-xs text-slate-500">{metric.label}</p>
                          <p className="mt-1 truncate text-sm font-bold text-slate-950">{metric.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-950">
                      查看详情 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 py-16 text-center text-sm text-slate-500">
              暂时没有匹配内容，换个关键词试试。
            </div>
          )}
        </section>
      </main>

      <PortalFooter />
    </div>
  );
}
