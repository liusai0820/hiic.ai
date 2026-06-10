import { useMemo, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  FileText,
  Layers,
  Menu,
  PlayCircle,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { AppDetailModal, FeedbackModal } from './components';
import { TutorialPage, LibraryPage } from './pages';
import Create2026Page from './pages/Create2026Page';
import { apps, tutorials } from './data';
import type { App as AppType, AppColor } from './types';

const appIconBg: Record<AppColor, string> = {
  blue: 'bg-blue-600',
  violet: 'bg-violet-600',
  emerald: 'bg-emerald-600',
  amber: 'bg-amber-600',
  rose: 'bg-rose-600',
  indigo: 'bg-indigo-700',
};

const newsItems = [
  { time: '09:42', title: 'OpenAI 发布 04-mini：更强的推理与工具调用能力', tag: '模型', tone: 'bg-blue-50 text-blue-700 border-blue-100' },
  { time: '08:15', title: '谷歌发布 Veo 3：视频生成进入音画同步新阶段', tag: '多模态', tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { time: '07:30', title: '英伟达财报：数据中心收入同比增长 427%', tag: '产业', tone: 'bg-amber-50 text-amber-700 border-amber-100' },
  { time: '07:12', title: '全球首个 AI 安全认证体系发布（ISO/IEC 42001）', tag: '标准', tone: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  { time: '06:45', title: '特斯拉 Optimus 进入小批量试生产阶段', tag: '机器人', tone: 'bg-orange-50 text-orange-700 border-orange-100' },
];

const reportItems = [
  { title: 'AI 赋能产业链分析方法论 2.0', date: '2026-05-27', type: '产业研究', pages: '28 页' },
  { title: '生成式 AI 在评审场景的应用与实践', date: '2026-05-24', type: '应用研究', pages: '24 页' },
  { title: 'AI Agent 在企业流程中的落地路径', date: '2026-05-20', type: '方法论', pages: '31 页' },
  { title: '深圳智能制造产业图谱（2026 版）', date: '2026-05-18', type: '产业图谱', pages: '45 页' },
];

const skillItems = [
  { title: '提示词工程实战指南', meta: '12 分钟 · 1.2k 学习', level: '入门', tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { title: 'RAG 检索增强生成实战', meta: '18 分钟 · 856 学习', level: '进阶', tone: 'bg-amber-50 text-amber-700 border-amber-100' },
  { title: '用 LangChain 快速构建 Agent', meta: '22 分钟 · 673 学习', level: '进阶', tone: 'bg-amber-50 text-amber-700 border-amber-100' },
  { title: '企业知识库搭建方法论', meta: '15 分钟 · 531 学习', level: '实战', tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { title: '数据可视化：从洞察到表达', meta: '14 分钟 · 482 学习', level: '实战', tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
];

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

function LogoMark() {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="min-w-0 leading-tight">
        <div className="truncate font-serif text-2xl font-semibold tracking-tight text-slate-950">
          HIIC AI Lab
        </div>
        <div className="truncate text-xs font-medium text-slate-600">
          深圳国家高技术产业创新中心
        </div>
      </div>
    </Link>
  );
}

interface PortalHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

function PortalHeader({ searchQuery, onSearchChange }: PortalHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { label: '应用', href: '#apps' },
    { label: 'Skill', href: '#skills' },
    { label: '教程', href: '#skills' },
    { label: '资讯', href: '#news' },
    { label: '研究报告', href: '#reports' },
    { label: '超级 OPC', href: '#opc' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1344px] items-center justify-between gap-6 px-6 lg:px-10">
        <LogoMark />

        <nav className="hidden items-center gap-8 text-[15px] font-semibold text-slate-900 lg:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="transition-colors hover:text-blue-700">
              {item.label}
            </a>
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
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <a
            href="#about"
            className="inline-flex h-11 items-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            关于我们
          </a>
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
        <div className="border-t border-slate-200 bg-white px-6 py-4 lg:hidden">
          <label className="relative mb-4 block">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="搜索应用、Skill、报告、资讯..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </label>
          <nav className="grid grid-cols-2 gap-2 text-sm font-semibold text-slate-800">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg border border-slate-100 px-3 py-2"
              >
                {item.label}
              </a>
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
  onPreview: (app: AppType) => void;
}

function AppShelfCard({ app, onVisit, onPreview }: AppShelfCardProps) {
  const Icon = app.icon;
  const isOnline = app.status === 'online';

  return (
    <article
      className="group flex min-h-[76px] cursor-pointer items-center gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:shadow-sm"
      onClick={() => onPreview(app)}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${appIconBg[app.color]} text-white`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-slate-950">{app.name}</h3>
        <p className="mt-1 line-clamp-1 text-xs text-slate-600">{app.description}</p>
        <button
          type="button"
          disabled={!isOnline}
          onClick={(event) => {
            event.stopPropagation();
            onVisit(app);
          }}
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-950 disabled:text-slate-400"
        >
          {isOnline ? '打开' : '筹备中'}
          {isOnline && <ArrowRight className="h-3 w-3" />}
        </button>
      </div>
    </article>
  );
}

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackAppId, setFeedbackAppId] = useState<string | undefined>();
  const [selectedApp, setSelectedApp] = useState<AppType | null>(null);
  const navigate = useNavigate();
  const [appVisits, setAppVisits] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('hiic-ai-visits');
    if (saved) {
      try {
        return JSON.parse(saved) as Record<string, number>;
      } catch {
        localStorage.removeItem('hiic-ai-visits');
      }
    }
    return apps.reduce((acc, app) => ({ ...acc, [app.id]: app.visitCount }), {});
  });

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

  const handleVisit = (app: AppType) => {
    if (app.status !== 'online') return;

    setAppVisits((prev) => {
      const newVisits = { ...prev, [app.id]: (prev[app.id] || 0) + 1 };
      localStorage.setItem('hiic-ai-visits', JSON.stringify(newVisits));
      return newVisits;
    });

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
      <PortalHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main>
        <section className="border-b border-slate-200">
          <div className="mx-auto grid max-w-[1344px] gap-8 px-6 py-6 lg:grid-cols-[0.74fr_1fr] lg:px-10 lg:py-7">
            <div className="flex flex-col pt-2">
              <h1 className="font-serif text-[52px] font-semibold leading-[0.98] tracking-tight text-slate-950 sm:text-[72px] lg:text-[78px]">
                AI Research &
                <br />
                Capability Hub
              </h1>
              <p className="mt-5 text-2xl font-semibold text-slate-950">
                以研究驱动应用，以能力创造价值
              </p>
              <p className="mt-3 max-w-[520px] text-base leading-7 text-slate-600">
                汇聚前沿洞察、研究方法与实践工具，展示 HIIC 在 AI 领域的持续探索与产业赋能成果。
              </p>

              <div className="mt-7 grid max-w-[560px] grid-cols-4 divide-x divide-slate-200 border-y border-slate-200 py-3">
                {[
                  { value: `${onlineAppsCount}+`, label: 'AI 应用' },
                  { value: '126', label: '内部 Skill' },
                  { value: '34', label: '研究报告' },
                  { value: '12', label: 'OPC 成果' },
                ].map((item) => (
                  <div key={item.label} className="px-4 first:pl-0">
                    <div className="text-2xl font-bold tracking-tight text-slate-950">{item.value}</div>
                    <div className="mt-1 text-sm text-slate-600">{item.label}</div>
                  </div>
                ))}
              </div>

              <a href="#about" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                了解 HIIC AI Lab <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:p-5">
              <div className="grid gap-7 lg:grid-cols-[220px_1fr]">
                <div className="h-[310px] self-start overflow-hidden rounded-sm bg-slate-950 shadow-xl">
                  <img
                    src="/reports/ai-industry-outlook-2026.jpg"
                    alt="2026 人工智能产业趋势与应用展望报告封面"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex min-h-[310px] flex-col">
                  <div>
                    <span className="inline-flex items-center rounded-md bg-slate-950 px-3 py-1 text-xs font-bold text-white">
                      重点研究
                    </span>
                    <h2 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-slate-950">
                      2026 人工智能产业趋势与应用展望
                    </h2>
                    <p className="mt-2 line-clamp-2 max-w-[640px] text-sm leading-6 text-slate-600">
                      报告聚焦大模型演进、Agent 化应用、具身智能与产业落地，结合企业调研与案例，研判未来 12-18 个月的关键趋势与机会点。
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
                    <span className="font-medium text-slate-900">HIIC AI Research Team</span>
                    <span>2026-05-28</span>
                    <span>36 页</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-3">
                    <Link to="/library" className="inline-flex h-10 items-center rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
                      阅读全文
                    </Link>
                    <button className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-5 text-sm font-semibold text-slate-900 transition hover:border-slate-300">
                      下载报告 <Download className="h-4 w-4" />
                    </button>
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
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white" id="news">
          <div className="mx-auto grid max-w-[1344px] gap-0 px-6 py-5 lg:grid-cols-3 lg:px-10">
            <div className="border-slate-200 pb-6 lg:border-r lg:pb-0 lg:pr-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-950">今日 AI 讯息</h2>
                <a href="#news" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600">
                  更多 <ChevronRight className="h-4 w-4" />
                </a>
              </div>
              <div className="divide-y divide-slate-100">
                {newsItems.map((item) => (
                  <div key={`${item.time}-${item.title}`} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 py-2">
                    <time className="text-sm tabular-nums text-slate-500">{item.time}</time>
                    <p className="truncate text-sm font-medium text-slate-900">{item.title}</p>
                    <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold ${item.tone}`}>
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>
              <a href="#news" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-950">
                查看全部资讯 <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="border-slate-200 py-6 lg:border-r lg:px-8 lg:py-0" id="reports">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-950">最新研究报告</h2>
                <Link to="/library" className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600">
                  更多 <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {reportItems.map((report) => (
                  <Link key={report.title} to="/library" className="grid grid-cols-[42px_1fr_auto] items-center gap-3 py-2 transition hover:bg-slate-50">
                    <img src="/reports/ai-industry-outlook-2026.jpg" alt="" className="h-12 w-9 rounded-sm object-cover" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">{report.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {report.date} · {report.type} · {report.pages}
                      </p>
                    </div>
                    <ArrowDownToLine className="h-4 w-4 text-slate-600" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-6 lg:pl-8 lg:pt-0" id="skills">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-950">Skill / 教程</h2>
                <Link to={`/tutorials/${tutorials[0]?.id ?? '1'}`} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600">
                  更多 <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {skillItems.map((skill, index) => (
                  <Link key={skill.title} to={`/tutorials/${tutorials[index % tutorials.length]?.id ?? '1'}`} className="grid grid-cols-[30px_1fr_auto] items-center gap-3 py-2 transition hover:bg-slate-50">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-700">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-950">{skill.title}</p>
                        <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[11px] font-semibold ${skill.tone}`}>
                          {skill.level}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">HIIC AI Lab · {skill.meta}</p>
                    </div>
                    <PlayCircle className="h-4 w-4 text-slate-600" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-6" id="apps">
          <div className="mx-auto max-w-[1344px] px-6 lg:px-10">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-xl font-bold text-slate-950">AI 应用精选</h2>
                <p className="mt-1 text-sm text-slate-600">由同事们构建的实用工具，持续迭代中</p>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackModalOpen(true)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950"
              >
                推荐新应用 <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {featuredApps.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                {featuredApps.map((app) => (
                  <AppShelfCard key={app.id} app={app} onVisit={handleVisit} onPreview={setSelectedApp} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 py-12 text-center text-sm text-slate-500">
                未找到相关应用，换个关键词试试。
              </div>
            )}
          </div>
        </section>

        <section className="bg-white py-8" id="opc">
          <div className="mx-auto grid max-w-[1344px] gap-7 px-6 lg:grid-cols-[0.9fr_1.4fr_0.9fr] lg:px-10">
            <div>
              <h2 className="text-xl font-bold text-slate-950">超级 OPC：从试点到组织能力</h2>
              <p className="mt-2 max-w-[360px] text-sm leading-6 text-slate-600">
                以实际项目与成果，沉淀可复用的方法与资产。
              </p>
            </div>
            <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-4">
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
            <div className="rounded-lg border border-slate-200 bg-white p-5" id="about">
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

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-[1344px] flex-col gap-4 px-6 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <p>© 2026 深圳国家高技术产业创新中心（HIIC） AI Lab。保留所有权利。</p>
            <div className="flex items-center gap-6">
              <a href="#about" className="hover:text-slate-900">隐私政策</a>
              <a href="#about" className="hover:text-slate-900">使用条款</a>
              <button type="button" onClick={() => handleFeedback()} className="hover:text-slate-900">联系我们</button>
              <span>中 / EN</span>
            </div>
          </div>
        </footer>
      </main>

      <button
        type="button"
        onClick={() => handleFeedback()}
        className="fixed bottom-5 right-5 z-40 hidden h-11 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 md:inline-flex"
      >
        <Clock3 className="h-4 w-4" />
        反馈
      </button>

      <AppDetailModal
        app={selectedApp}
        visitCount={selectedApp ? (appVisits[selectedApp.id] || selectedApp.visitCount) : 0}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        onVisit={(appId) => {
          const app = apps.find((item) => item.id === appId);
          if (app) handleVisit(app);
        }}
        onFeedback={(appId) => {
          setSelectedApp(null);
          handleFeedback(appId);
        }}
      />

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

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create2026" element={<Create2026Page />} />
      <Route path="/tutorials/:id" element={<TutorialPage />} />
      <Route path="/library" element={<LibraryPage />} />
    </Routes>
  );
}

export default App;
