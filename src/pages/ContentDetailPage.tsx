import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight, CalendarDays, Database, ExternalLink, FileText, UserRound } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { PortalFooter, PortalTopBar } from '../components/PortalPageChrome';
import { SkillDocument } from '../components/SkillDocument';
import { XiaoqiGuide } from '../components/XiaoqiGuide';
import {
  getCanonicalUrl,
  getItemPath,
  getPortalItem,
  getRelatedItems,
  kindLabels,
  kindRoutes,
  siteConfig,
  statusLabels,
  type PortalContentItem,
  type PortalContentKind,
} from '../content/portal';

const schemaTypes: Record<PortalContentKind, string> = {
  app: 'SoftwareApplication',
  skill: 'TechArticle',
  tutorial: 'HowTo',
  insight: 'Article',
  report: 'Report',
  collection: 'CollectionPage',
};

interface ContentDetailPageProps {
  kind: PortalContentKind;
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
}

function DetailCta({ item }: { item: PortalContentItem }) {
  if (item.kind === 'skill') {
    return (
      <a
        href="#skill-document"
        className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#0A04AE] px-5 text-sm font-semibold text-white transition hover:bg-[#08038f]"
      >
        查看文档
        <ArrowRight className="h-4 w-4" />
      </a>
    );
  }

  if (item.ctaUrl.startsWith('/')) {
    return (
      <Link
        to={item.ctaUrl}
        className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#0A04AE] px-5 text-sm font-semibold text-white transition hover:bg-[#08038f]"
      >
        {item.ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    );
  }

  return (
    <a
      href={item.ctaUrl}
      target={item.ctaUrl.startsWith('#') ? undefined : '_blank'}
      rel={item.ctaUrl.startsWith('#') ? undefined : 'noreferrer'}
      className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#0A04AE] px-5 text-sm font-semibold text-white transition hover:bg-[#08038f]"
    >
      {item.ctaLabel}
      {!item.ctaUrl.startsWith('#') && <ExternalLink className="h-4 w-4" />}
    </a>
  );
}

function NotFoundPage({ kind }: { kind: PortalContentKind }) {
  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-950">
      <PageMeta
        title={`内容不存在 - ${siteConfig.name}`}
        description="未找到对应内容。"
        canonicalPath={kindRoutes[kind]}
      />
      <PortalTopBar />
      <main className="mx-auto flex min-h-[520px] max-w-[900px] flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-5xl font-semibold tracking-tight">内容不存在</h1>
        <p className="mt-4 max-w-[520px] text-sm leading-6 text-slate-600">
          这条内容可能还没有发布，或链接已经更新。
        </p>
        <Link to={kindRoutes[kind]} className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#0A04AE] px-5 py-3 text-sm font-semibold text-white">
          返回{kindLabels[kind]}列表 <ArrowRight className="h-4 w-4" />
        </Link>
      </main>
      <PortalFooter />
    </div>
  );
}

export function ContentDetailPage({ kind }: ContentDetailPageProps) {
  const params = useParams<{ slug?: string; id?: string }>();
  const activeSlug = params.slug ?? params.id;
  const item = activeSlug ? getPortalItem(kind, activeSlug) : undefined;

  if (!item) {
    return <NotFoundPage kind={kind} />;
  }

  const relatedItems = getRelatedItems(item);
  const canonicalPath = getItemPath(item);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': schemaTypes[item.kind],
    name: item.title,
    headline: item.title,
    description: item.seo.description,
    url: getCanonicalUrl(canonicalPath),
    image: getCanonicalUrl(item.cover),
    datePublished: item.date,
    dateModified: item.updatedAt,
    author: {
      '@type': 'Organization',
      name: item.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.organization,
    },
    keywords: item.tags.join(', '),
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] text-slate-950">
      <PageMeta
        title={item.seo.title}
        description={item.seo.description}
        canonicalPath={canonicalPath}
        image={item.cover}
        jsonLd={jsonLd}
      />
      <PortalTopBar />

      <main>
        <section className="border-b border-[#d8e4ff] bg-[#f5f8ff]">
          <div className="mx-auto grid max-w-[1344px] gap-8 px-6 py-8 lg:grid-cols-[0.9fr_1.15fr] lg:px-10 lg:py-12">
            <div>
              <Link to={kindRoutes[item.kind]} className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A04AE] hover:text-[#08038f]">
                <ArrowLeft className="h-4 w-4" />
                返回{kindLabels[item.kind]}
              </Link>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-[#c9d8ff] bg-white px-2.5 py-1 text-xs font-bold text-[#0A04AE]">
                  {kindLabels[item.kind]}
                </span>
                <span className="rounded-md bg-[#0A04AE] px-2.5 py-1 text-xs font-bold text-white">
                  {statusLabels[item.status]}
                </span>
              </div>
              <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.98] tracking-tight text-slate-950 sm:text-6xl">
                {item.title}
              </h1>
              <p className="mt-5 max-w-[720px] text-lg leading-8 text-[#52637A]">
                {item.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-[#52637A] shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <DetailCta item={item} />
                <a
                  href="/ai-index.json"
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#c9d8ff] bg-white px-5 text-sm font-semibold text-[#0A04AE] transition hover:border-[#0A04AE]"
                >
                  Agent 索引 <Database className="h-4 w-4" />
                </a>
              </div>
            </div>

            <aside className="rounded-lg border border-[#c9d8ff] bg-white p-5 shadow-sm shadow-[#0A04AE]/5">
              <div className="grid gap-5 sm:grid-cols-[180px_1fr]">
                <img
                  src={item.cover}
                  alt={`${item.title}封面`}
                  className="h-[250px] w-full rounded-sm bg-slate-950 object-contain shadow-lg sm:h-full"
                />
                <div className="flex flex-col">
                  <div className="grid grid-cols-3 divide-x divide-[#edf2ff] border-b border-[#edf2ff] pb-5">
                    {item.metrics.slice(0, 3).map((metric) => (
                      <div key={metric.label} className="px-3 first:pl-0 last:pr-0">
                        <p className="text-xs text-slate-500">{metric.label}</p>
                        <p className="mt-1 text-lg font-bold text-slate-950">{metric.value}</p>
                      </div>
                    ))}
                  </div>

                  <dl className="mt-5 grid gap-3 text-sm">
                    <div className="flex items-center gap-3">
                      <UserRound className="h-4 w-4 text-[#0A04AE]" />
                      <dt className="w-16 shrink-0 text-slate-500">作者</dt>
                      <dd className="font-semibold text-slate-900">{item.author}</dd>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-4 w-4 text-[#0A04AE]" />
                      <dt className="w-16 shrink-0 text-slate-500">更新</dt>
                      <dd className="font-semibold text-slate-900">{formatDate(item.updatedAt)}</dd>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-[#0A04AE]" />
                      <dt className="w-16 shrink-0 text-slate-500">分类</dt>
                      <dd className="font-semibold text-slate-900">{item.category}</dd>
                    </div>
                  </dl>

                  <div className="mt-auto pt-6">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#52637A]">Agent Metadata</p>
                    <p className="mt-2 text-sm leading-6 text-[#52637A]">{item.agent.purpose}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1344px] gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-10 lg:py-10">
          <article className="min-w-0">
            {item.kind === 'skill' ? (
              <SkillDocument item={item} />
            ) : (
              <>
                <div className="border-b border-[#d8e4ff] pb-6">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-950">内容概览</h2>
                  <p className="mt-3 max-w-[760px] text-base leading-7 text-[#52637A]">
                    {item.description}
                  </p>
                </div>

                <div className="mt-7 space-y-8">
                  {item.sections.map((section) => (
                    <section key={section.heading} className="border-b border-[#edf2ff] pb-8 last:border-b-0">
                      <h2 className="text-xl font-bold text-slate-950">{section.heading}</h2>
                      <div className="prose prose-slate mt-3 max-w-none text-slate-700 prose-p:leading-7 prose-a:font-semibold prose-a:text-blue-700">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.body}</ReactMarkdown>
                      </div>
                    </section>
                  ))}
                </div>
              </>
            )}
          </article>

          <aside className="space-y-5">
            <XiaoqiGuide scene={item.kind} compact />

            <div className="rounded-lg border border-[#c9d8ff] bg-white p-5">
              <h2 className="text-sm font-bold text-slate-950">Agent 可读信息</h2>
              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Inputs</p>
                  <ul className="space-y-1 text-slate-700">
                    {item.agent.inputs.map((input) => (
                      <li key={input}>- {input}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Outputs</p>
                  <ul className="space-y-1 text-slate-700">
                    {item.agent.outputs.map((output) => (
                      <li key={output}>- {output}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg bg-[#f5f8ff] p-3 text-xs font-semibold text-[#52637A]">
                  access: {item.agent.access}
                </div>
              </div>
            </div>

            {relatedItems.length > 0 && (
              <div className="rounded-lg border border-[#c9d8ff] bg-white p-5">
                <h2 className="text-sm font-bold text-slate-950">相关内容</h2>
                <div className="mt-4 divide-y divide-[#edf2ff]">
                  {relatedItems.map((relatedItem) => (
                    <Link
                      key={`${relatedItem.kind}-${relatedItem.slug}`}
                      to={getItemPath(relatedItem)}
                      className="group block py-3 first:pt-0 last:pb-0"
                    >
                      <p className="text-xs font-semibold text-slate-500">{kindLabels[relatedItem.kind]}</p>
                      <p className="mt-1 text-sm font-bold leading-5 text-slate-950 group-hover:text-[#0A04AE]">
                        {relatedItem.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </section>
      </main>

      <PortalFooter />
    </div>
  );
}
