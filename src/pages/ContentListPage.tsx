import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Filter, Search } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { PortalFooter, PortalTopBar } from '../components/PortalPageChrome';
import { XiaoqiGuide } from '../components/XiaoqiGuide';
import {
  getCanonicalUrl,
  getItemPath,
  getItemsByKind,
  kindPluralLabels,
  kindRoutes,
  siteConfig,
  statusLabels,
  type PortalContentItem,
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

function formatTimelineDate(dateString: string): { monthDay: string; year: string } {
  const date = new Date(dateString);
  return {
    monthDay: new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit' }).format(date),
    year: new Intl.DateTimeFormat('zh-CN', { year: 'numeric' }).format(date),
  };
}

function InsightTimeline({ items }: { items: PortalContentItem[] }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-[#c9d8ff] bg-white">
      <div className="border-b border-[#d8e4ff] bg-[#f5f8ff] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A04AE] text-white">
            <CalendarDays className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-950">AI 资讯时间轴</h2>
            <p className="text-sm text-[#52637A]">按发布时间持续更新，保留趋势观察和应用判断。</p>
          </div>
        </div>
      </div>

      <div className="relative divide-y divide-[#edf2ff]">
        <div className="absolute bottom-8 left-[108px] top-8 hidden w-px bg-[#c9d8ff] sm:block" />
        {items.map((item) => {
          const date = formatTimelineDate(item.date);

          return (
            <Link
              key={`${item.kind}-${item.slug}`}
              to={getItemPath(item)}
              className="group relative grid gap-4 px-5 py-5 transition hover:bg-[#f8fbff] sm:grid-cols-[130px_1fr]"
            >
              <div className="flex items-start gap-3 sm:block">
                <time className="block font-serif text-3xl font-semibold leading-none text-[#0A04AE]">
                  {date.monthDay}
                </time>
                <span className="mt-1 block text-xs font-bold uppercase tracking-[0.16em] text-[#52637A]">
                  {date.year}
                </span>
              </div>

              <div className="relative">
                <span className="absolute -left-[31px] top-1 hidden h-3 w-3 rounded-full border-2 border-white bg-[#31B7F0] shadow-sm shadow-[#0A04AE]/25 sm:block" />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#eef5ff] px-2 py-1 text-xs font-bold text-[#0A04AE]">
                    {item.category}
                  </span>
                  {item.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-[#52637A]">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="mt-3 text-xl font-bold leading-tight tracking-tight text-slate-950 group-hover:text-[#0A04AE]">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[760px] text-sm leading-6 text-[#52637A]">
                  {item.summary}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#0A04AE]">
                  阅读观察 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
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
    <div className="min-h-screen bg-[#f8fbff] text-slate-950">
      <PageMeta
        title={pageTitle}
        description={listIntros[kind]}
        canonicalPath={canonicalPath}
        image="/reports/ai-industry-outlook-2026.jpg"
        jsonLd={jsonLd}
      />
      <PortalTopBar />

      <main>
        <section className="border-b border-[#d8e4ff] bg-[#f5f8ff]">
          <div className="mx-auto max-w-[1344px] px-6 py-10 lg:px-10 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
              <div>
                <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A04AE] hover:text-[#08038f]">
                  HIIC AI Lab <ArrowRight className="h-4 w-4" />
                </Link>
                <h1 className="mt-5 font-serif text-5xl font-semibold leading-none tracking-tight text-slate-950 sm:text-6xl">
                  {kindPluralLabels[kind]}
                </h1>
                <p className="mt-5 max-w-[620px] text-base leading-7 text-[#52637A]">
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
                    className="h-11 w-full rounded-lg border border-[#c9d8ff] bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0A04AE] focus:ring-4 focus:ring-[#0A04AE]/10"
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
                          ? 'border-[#0A04AE] bg-[#0A04AE] text-white'
                          : 'border-[#c9d8ff] bg-white text-slate-700 hover:border-[#0A04AE]'
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
          <div className="mb-4 flex items-center justify-between border-b border-[#d8e4ff] pb-3">
            <p className="text-sm font-semibold text-[#52637A]">
              共 {filteredItems.length} 项内容
            </p>
            <a href="/ai-index.json" className="text-sm font-semibold text-[#0A04AE] hover:text-[#08038f]">
              Agent 索引
            </a>
          </div>

          {filteredItems.length > 0 ? (
            kind === 'insight' ? (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <InsightTimeline items={filteredItems} />
                <div className="space-y-4">
                  <XiaoqiGuide scene="insights" compact />
                  <div className="rounded-lg border border-[#c9d8ff] bg-white p-5">
                    <h2 className="text-sm font-bold text-slate-950">资讯维护提示</h2>
                    <p className="mt-2 text-sm leading-6 text-[#52637A]">
                      新增资讯时请保留日期、分类、来源判断和摘要，避免把未经核实的信息写成确定性事实。
                    </p>
                  </div>
                </div>
              </div>
            ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <Link
                  key={`${item.kind}-${item.slug}`}
                  to={getItemPath(item)}
                  className="group flex min-h-[260px] flex-col rounded-lg border border-[#d8e4ff] bg-white p-5 transition hover:border-[#0A04AE] hover:shadow-sm hover:shadow-[#0A04AE]/10"
                >
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <span className="rounded-md border border-[#c9d8ff] bg-[#f5f8ff] px-2.5 py-1 text-xs font-bold text-[#0A04AE]">
                      {item.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {statusLabels[item.status]}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-950 group-hover:text-[#0A04AE]">
                    {item.title}
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#52637A]">
                    {item.summary}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-md bg-[#eef5ff] px-2 py-1 text-xs font-semibold text-[#52637A]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto border-t border-[#edf2ff] pt-5">
                    <div className="grid grid-cols-3 divide-x divide-[#edf2ff]">
                      {item.metrics.slice(0, 3).map((metric) => (
                        <div key={metric.label} className="px-3 first:pl-0 last:pr-0">
                          <p className="truncate text-xs text-slate-500">{metric.label}</p>
                          <p className="mt-1 truncate text-sm font-bold text-slate-950">{metric.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0A04AE]">
                      查看详情 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            )
          ) : (
            <div className="rounded-lg border border-[#d8e4ff] bg-white py-16 text-center text-sm text-slate-500">
              暂时没有匹配内容，换个关键词试试。
            </div>
          )}
        </section>
      </main>

      <PortalFooter />
    </div>
  );
}
