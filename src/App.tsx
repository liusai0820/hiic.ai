import { useMemo, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Layers,
  Menu,
  PlayCircle,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { FeedbackModal } from './components';
import { DailyAINewsFeed } from './components/DailyAINewsFeed';
import { ContentDetailPage, ContentListPage, TutorialPage, LibraryPage } from './pages';
import Create2026Page from './pages/Create2026Page';
import { PageMeta } from './components/PageMeta';
import { XiaoqiGuide } from './components/XiaoqiGuide';
import { OfficialLogo } from './components/OfficialLogo';
import { apps } from './data';
import {
  getFeaturedItems,
  getItemPath,
  getPortalItem,
  portalStats,
} from './content/portal';
import type { App as AppType, AppColor } from './types';

const appIconBg: Record<AppColor, string> = {
  blue: 'bg-blue-600',
  violet: 'bg-violet-600',
  emerald: 'bg-emerald-600',
  amber: 'bg-amber-600',
  rose: 'bg-rose-600',
  indigo: 'bg-indigo-700',
};

const toneStyles = [
  'bg-blue-50 text-blue-700 border-blue-100',
  'bg-emerald-50 text-emerald-700 border-emerald-100',
  'bg-amber-50 text-amber-700 border-amber-100',
  'bg-indigo-50 text-indigo-700 border-indigo-100',
  'bg-rose-50 text-rose-700 border-rose-100',
];

function toneForIndex(index: number): string {
  return toneStyles[index % toneStyles.length];
}

const milestoneItems = [
  { title: '试点启动', date: '2024 Q3', note: '确定 3 个试点场景' },
  { title: '能力建设', date: '2024 Q4', note: '共建 20+ Skill' },
  { title: '规模化落地', date: '2025 Q1-Q2', note: '覆盖 10+ 业务场景' },
  { title: '价值显现', date: '2025 Q3-Q4', note: '效率提升 40%+' },
];

const assetStats = [
  { icon: FileText, value: '80+', label: '研究报告' },
  { icon: Sparkles, value: '120+', label: '可复用 Skill' },
  { icon: BookOpen, value: '20+', label: '方法论文档' },
  { icon: Layers, value: '10+', label: '工具与应用' },
];

interface PortalHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

function PortalHeader({ searchQuery, onSearchChange }: PortalHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { label: '应用', to: '/apps' },
    { label: 'Skill', to: '/skills' },
    { label: '教程', to: '/tutorials' },
    { label: '资讯', to: '/insights' },
    { label: '研究报告', to: '/reports' },
    { label: '专题', to: '/collections' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8e4ff] bg-[#f8fbff]/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1344px] items-center justify-between gap-6 px-6 lg:px-10">
        <OfficialLogo />

        <nav className="hidden shrink-0 items-center gap-5 text-[15px] font-semibold text-slate-900 lg:flex xl:gap-7">
          {navItems.map((item) => (
            <Link key={item.label} to={item.to} className="shrink-0 whitespace-nowrap transition-colors hover:text-blue-700">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <label className="relative block w-[280px] xl:w-[320px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="搜索应用、Skill、报告、资讯..."
              className="h-11 w-full rounded-lg border border-[#c9d8ff] bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#0A04AE] focus:ring-4 focus:ring-[#0A04AE]/10"
            />
          </label>
          <Link
            to="/collections/super-opc"
            className="inline-flex h-11 shrink-0 items-center rounded-lg bg-[#0A04AE] px-5 text-sm font-semibold whitespace-nowrap text-white transition hover:bg-[#08038f]"
          >
            能力成果
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
          aria-label="打开导航"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#d8e4ff] bg-[#f8fbff] px-6 py-4 lg:hidden">
          <label className="relative mb-4 block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="搜索应用、Skill、报告、资讯..."
              className="h-11 w-full rounded-lg border border-[#c9d8ff] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#0A04AE]"
            />
          </label>
          <nav className="grid grid-cols-2 gap-2 text-sm font-semibold text-slate-800">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg border border-[#d8e4ff] bg-white px-3 py-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

interface AppShelfCardProps {
  app: AppType;
  onVisit: (app: AppType) => void;
}

function AppShelfCard({ app, onVisit }: AppShelfCardProps) {
  const Icon = app.icon;
  const isOnline = app.status === 'online';

  return (
    <Link
      to={`/apps/${app.id}`}
      className="group flex min-h-[76px] cursor-pointer items-center gap-4 rounded-lg border border-[#d8e4ff] bg-white px-4 py-3 transition hover:border-[#0A04AE] hover:shadow-sm hover:shadow-[#0A04AE]/10"
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${appIconBg[app.color]} text-white`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-slate-950 group-hover:text-[#0A04AE]">{app.name}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-slate-600">{app.description}</p>
        <button
          type="button"
          disabled={!isOnline}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onVisit(app);
          }}
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#0A04AE] disabled:text-slate-400"
        >
          {isOnline ? '打开' : '筹备中'}
          {isOnline && <ArrowRight className="h-3 w-3" />}
        </button>
      </div>
    </Link>
  );
}

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackAppId, setFeedbackAppId] = useState<string | undefined>();
  const navigate = useNavigate();

  const visibleApps = useMemo(() => {
    return apps.filter((app) => {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      return (
        normalizedQuery === '' ||
        app.name.toLowerCase().includes(normalizedQuery) ||
        app.description.toLowerCase().includes(normalizedQuery) ||
        app.category.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [searchQuery]);

  const onlineAppsCount = apps.filter((app) => app.status === 'online').length;
  const featuredApps = visibleApps.slice(0, 5);
  const newsItems = getFeaturedItems('insight', 5);
  const reportItems = getFeaturedItems('report', 4);
  const spotlightReport = getPortalItem('report', 'ai-industry-outlook-2026') ?? reportItems[0];
  const learningItems = [...getFeaturedItems('skill', 3), ...getFeaturedItems('tutorial', 2)].slice(0, 5);

  const handleVisit = (app: AppType) => {
    if (app.status !== 'online') return;

    try {
      const saved = localStorage.getItem('hiic-ai-visits');
      const visits = saved ? (JSON.parse(saved) as Record<string, number>) : {};
      const newVisits = { ...visits, [app.id]: (visits[app.id] || app.visitCount) + 1 };
      localStorage.setItem('hiic-ai-visits', JSON.stringify(newVisits));
    } catch {
      localStorage.removeItem('hiic-ai-visits');
    }

    if (app.url.startsWith('/')) {
      navigate(app.url);
    } else {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFeedback = (appId?: string) => {
    setFeedbackAppId(appId);
    setFeedbackModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <PageMeta
        title="HIIC AI Lab - AI Research & Capability Hub"
        description="HIIC AI Lab 集中展示 AI 应用、Skill、教程、资讯观察与研究报告，是 HIIC 对外展示 AI 综合能力的门户。"
        canonicalPath="/"
        image="/reports/ai-industry-outlook-2026.jpg"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'HIIC AI Lab',
          url: 'https://hiic.ai',
          description: 'HIIC AI Lab 集中展示 AI 应用、Skill、教程、资讯观察与研究报告。',
          publisher: {
            '@type': 'Organization',
            name: '深圳国家高技术产业创新中心',
          },
        }}
      />
      <PortalHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main>
        <section className="border-b border-[#d8e4ff] bg-[#f5f8ff]">
          <div className="mx-auto grid max-w-[1344px] gap-8 px-6 py-6 lg:grid-cols-[0.74fr_1fr] lg:px-10 lg:py-7">
            <div className="flex flex-col pt-2">
              <h1 className="font-serif text-[52px] font-semibold leading-[0.98] tracking-tight text-slate-950 sm:text-[72px] lg:text-[78px]">
                AI Research &
                <br />
                Capability Hub
              </h1>
              <p className="mt-5 text-2xl font-semibold text-[#0A04AE]">
                以研究驱动应用，以能力创造价值
              </p>
              <p className="mt-3 max-w-[520px] text-base leading-7 text-slate-600">
                汇聚前沿洞察、研究方法与实践工具，展示 HIIC 在 AI 领域的持续探索与产业赋能成果。
              </p>

              <div className="mt-7 grid max-w-[560px] grid-cols-4 divide-x divide-[#c9d8ff] border-y border-[#c9d8ff] bg-white/60 py-3">
                {[
                  { value: `${onlineAppsCount}+`, label: 'AI 应用' },
                  { value: `${portalStats.skills}+`, label: '结构化 Skill' },
                  { value: `${portalStats.reports}+`, label: '研究报告' },
                  { value: `${portalStats.collections}+`, label: '专题成果' },
                ].map((item) => (
                  <div key={item.label} className="px-4 first:pl-0">
                    <div className="text-2xl font-bold tracking-tight text-slate-950">{item.value}</div>
                    <div className="mt-1 text-sm text-slate-600">{item.label}</div>
                  </div>
                ))}
              </div>

              <Link to="/collections/super-opc" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0A04AE]">
                了解 HIIC AI Lab <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
            <article className="rounded-lg border border-[#c9d8ff] bg-white p-4 shadow-sm shadow-[#0A04AE]/5 lg:p-5">
              <div className="grid gap-7 lg:grid-cols-[220px_1fr]">
                <div className="h-[310px] self-start overflow-hidden rounded-sm bg-slate-950 shadow-xl">
                  <img
                    src={spotlightReport?.cover ?? '/reports/ai-industry-outlook-2026.jpg'}
                    alt={`${spotlightReport?.title ?? '重点研究报告'}封面`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex min-h-[310px] flex-col">
                  <div>
                    <span className="inline-flex items-center rounded-md bg-[#0A04AE] px-3 py-1 text-xs font-bold text-white">
                      重点研究
                    </span>
                    <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-slate-950">
                      {spotlightReport?.title ?? '2026 人工智能产业趋势与应用展望'}
                    </h2>
                    <p className="mt-2 line-clamp-2 max-w-[640px] text-sm leading-6 text-slate-600">
                      {spotlightReport?.summary ?? '聚焦 AI 产业趋势、应用落地与组织能力建设。'}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <div className="flex -space-x-2">
                      {['A', 'I', 'R'].map((letter) => (
                        <span key={letter} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-bold text-slate-700">
                          {letter}
                        </span>
                      ))}
                    </div>
                    <span className="font-medium text-slate-900">{spotlightReport?.author ?? 'HIIC AI Research Team'}</span>
                    <span>{spotlightReport?.date ?? '2026-05-28'}</span>
                    <span>{spotlightReport?.metrics[0]?.value ?? '报告'}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3">
                    <Link to={spotlightReport ? getItemPath(spotlightReport) : '/reports'} className="inline-flex h-10 items-center rounded-md bg-[#0A04AE] px-5 text-sm font-semibold text-white transition hover:bg-[#08038f]">
                      阅读全文
                    </Link>
                    <a href="/ai-index.json" className="inline-flex h-10 items-center gap-2 rounded-md border border-[#c9d8ff] px-5 text-sm font-semibold text-[#0A04AE] transition hover:border-[#0A04AE]">
                      Agent 索引 <FileText className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="mt-3 border-t border-slate-200 pt-2">
                    <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">核心洞察</div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-900">大模型能力加速分化</p>
                        <p className="mt-1 text-xs text-slate-500">推理成本下降 60%+</p>
                        <div className="mt-2 flex h-7 items-end gap-1">
                          {[8, 12, 11, 15, 18, 24, 21, 26].map((height, index) => (
                            <span key={index} className="w-full rounded-sm bg-blue-600/80" style={{ height }} />
                          ))}
                        </div>
                      </div>
                      <div className="border-l border-slate-200 pl-5">
                        <p className="text-xs font-semibold text-slate-900">Agent 渗透率提升</p>
                        <p className="mt-1 text-xs text-slate-500">企业采用率 45%</p>
                        <div className="mt-2 flex h-7 items-end gap-2">
                          {[6, 10, 13, 18, 24].map((height, index) => (
                            <span key={index} className="w-5 rounded-sm bg-blue-700" style={{ height }} />
                          ))}
                        </div>
                      </div>
                      <div className="border-l border-slate-200 pl-5">
                        <p className="text-xs font-semibold text-slate-900">应用价值回归业务</p>
                        <p className="mt-1 text-xs text-slate-500">ROI 提升 2.3 倍</p>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full" style={{ background: 'conic-gradient(#2563eb 0 46%, #10b981 46% 74%, #f59e0b 74% 100%)' }} />
                          <div className="space-y-1 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />增长</div>
                            <div className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-blue-600" />效率</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            <XiaoqiGuide scene="home" compact />
            </div>
          </div>
        </section>

        <section className="border-b border-[#d8e4ff] bg-white" id="news">
          <div className="mx-auto grid max-w-[1344px] gap-0 px-6 py-5 lg:grid-cols-3 lg:px-10">
            <div className="border-[#d8e4ff] pb-6 lg:border-r lg:pb-0 lg:pr-8">
              <DailyAINewsFeed fallbackItems={newsItems} />
            </div>

            <div className="border-[#d8e4ff] py-6 lg:border-r lg:px-8 lg:py-0" id="reports">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-950">最新研究报告</h2>
                <Link to="/reports" className="inline-flex items-center gap-1 text-sm font-semibold text-[#0A04AE]">
                  更多 <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {reportItems.map((report) => (
                  <Link key={report.slug} to={getItemPath(report)} className="grid grid-cols-[42px_1fr_auto] items-center gap-3 py-2 transition hover:bg-[#f5f8ff]">
                    <img src={report.cover} alt="" className="h-12 w-9 rounded-sm object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">{report.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {report.date} · {report.category} · {report.metrics[0]?.value ?? '报告'}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#0A04AE]" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 lg:pl-8 lg:pt-0" id="skills">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-950">Skill / 教程</h2>
                <Link to="/skills" className="inline-flex items-center gap-1 text-sm font-semibold text-[#0A04AE]">
                  更多 <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {learningItems.map((item, index) => (
                  <Link key={`${item.kind}-${item.slug}`} to={getItemPath(item)} className="grid grid-cols-[30px_1fr_auto] items-center gap-3 py-2 transition hover:bg-[#f5f8ff]">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[#c9d8ff] text-[#0A04AE]">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-950">{item.title}</p>
                        <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[11px] font-semibold ${toneForIndex(index + 1)}`}>
                          {item.category}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{item.author} · {item.metrics[0]?.value ?? '可复用内容'}</p>
                    </div>
                    <PlayCircle className="h-4 w-4 text-[#0A04AE]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#d8e4ff] bg-[#f8fbff] py-6" id="apps">
          <div className="mx-auto max-w-[1344px] px-6 lg:px-10">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-xl font-bold text-slate-950">AI 应用精选</h2>
                <p className="mt-1 text-sm text-slate-600">由同事们构建的实用工具，持续迭代中</p>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackModalOpen(true)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A04AE]"
              >
                推荐新应用 <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {featuredApps.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                {featuredApps.map((app) => (
                  <AppShelfCard key={app.id} app={app} onVisit={handleVisit} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-[#d8e4ff] bg-white py-12 text-center text-sm text-slate-500">
                未找到相关应用，换个关键词试试。
              </div>
            )}
          </div>
        </section>

        <section className="bg-white py-8" id="opc">
          <div className="mx-auto grid max-w-[1344px] gap-7 px-6 lg:grid-cols-[0.9fr_1.4fr_0.9fr] lg:px-10">
            <div>
              <h2 className="text-xl font-bold text-slate-950">AI 能力共创：从试点到组织能力</h2>
              <p className="mt-2 max-w-[360px] text-sm leading-6 text-slate-600">
                以实际项目与成果，沉淀可复用的方法与资产。
              </p>
              <Link to="/collections/super-opc" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0A04AE]">
                查看专题成果 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3 rounded-lg border border-[#d8e4ff] bg-[#f8fbff] p-4 sm:grid-cols-4">
              {milestoneItems.map((item, index) => (
                <div key={item.title}>
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-bold text-slate-950">
                      {String(index + 1).padStart(2, '0')} {item.title}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500">{item.date}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{item.note}</p>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-[#d8e4ff] bg-white p-5" id="about">
              <h3 className="text-sm font-bold text-slate-950">OPC 产出资产</h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {assetStats.map((asset) => (
                  <div key={asset.label}>
                    <asset.icon className="h-5 w-5 text-slate-700" />
                    <div className="mt-2 text-xl font-bold text-slate-950">{asset.value}</div>
                    <div className="text-xs text-slate-500">{asset.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#d8e4ff] bg-[#f8fbff]">
          <div className="mx-auto flex max-w-[1344px] flex-col gap-4 px-6 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <p>© 2026 深圳国家高技术产业创新中心（HIIC） AI Lab。保留所有权利。</p>
            <div className="flex items-center gap-6">
              <Link to="/apps" className="hover:text-slate-900">应用</Link>
              <Link to="/reports" className="hover:text-slate-900">报告</Link>
              <a href="/llms.txt" className="hover:text-slate-900">llms.txt</a>
              <a href="/ai-index.json" className="hover:text-slate-900">AI Index</a>
              <button type="button" onClick={() => handleFeedback()} className="hover:text-slate-900">联系我们</button>
            </div>
          </div>
        </footer>
      </main>

      <button
        type="button"
        onClick={() => handleFeedback()}
        className="fixed bottom-5 right-5 z-40 hidden h-11 items-center gap-2 rounded-full bg-[#0A04AE] px-4 text-sm font-semibold text-white shadow-lg shadow-[#0A04AE]/25 transition hover:bg-[#08038f] md:inline-flex"
      >
        <Clock3 className="h-4 w-4" />
        反馈
      </button>

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          setFeedbackAppId(undefined);
        }}
        apps={apps}
        preselectedAppId={feedbackAppId}
      />
    </div>
  );
}

function TutorialRoute() {
  const { id } = useParams<{ id: string }>();

  if (id && getPortalItem('tutorial', id)) {
    return <ContentDetailPage kind="tutorial" />;
  }

  return <TutorialPage />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/apps" element={<ContentListPage kind="app" />} />
      <Route path="/apps/:slug" element={<ContentDetailPage kind="app" />} />
      <Route path="/skills" element={<ContentListPage kind="skill" />} />
      <Route path="/skills/:slug" element={<ContentDetailPage kind="skill" />} />
      <Route path="/tutorials" element={<ContentListPage kind="tutorial" />} />
      <Route path="/tutorials/:id" element={<TutorialRoute />} />
      <Route path="/insights" element={<ContentListPage kind="insight" />} />
      <Route path="/insights/:slug" element={<ContentDetailPage kind="insight" />} />
      <Route path="/reports" element={<ContentListPage kind="report" />} />
      <Route path="/reports/:slug" element={<ContentDetailPage kind="report" />} />
      <Route path="/collections" element={<ContentListPage kind="collection" />} />
      <Route path="/collections/:slug" element={<ContentDetailPage kind="collection" />} />
      <Route path="/create2026" element={<Create2026Page />} />
      <Route path="/library" element={<LibraryPage />} />
    </Routes>
  );
}

export default App;
