import { Link } from 'react-router-dom';
import { OfficialLogo } from './OfficialLogo';

const navItems = [
  { label: '应用', to: '/apps' },
  { label: 'Skill', to: '/skills' },
  { label: '教程', to: '/tutorials' },
  { label: '资讯', to: '/insights' },
  { label: '研究报告', to: '/reports' },
  { label: '专题', to: '/collections' },
];

export function PortalTopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#d8e4ff] bg-[#f8fbff]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1344px] items-center justify-between gap-6 px-6 lg:px-10">
        <OfficialLogo />

        <nav className="hidden shrink-0 items-center gap-5 text-sm font-semibold text-slate-700 md:flex lg:gap-6">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to} className="shrink-0 whitespace-nowrap transition hover:text-[#0A04AE]">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function PortalFooter() {
  return (
    <footer className="border-t border-[#d8e4ff] bg-[#f8fbff]">
      <div className="mx-auto flex max-w-[1344px] flex-col gap-3 px-6 py-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <p>© 2026 深圳国家高技术产业创新中心（HIIC） AI Lab。保留所有权利。</p>
        <div className="flex flex-wrap items-center gap-5">
          <Link to="/apps" className="hover:text-[#0A04AE]">应用</Link>
          <Link to="/skills" className="hover:text-[#0A04AE]">Skill</Link>
          <Link to="/reports" className="hover:text-[#0A04AE]">研究报告</Link>
          <a href="/llms.txt" className="hover:text-[#0A04AE]">llms.txt</a>
          <a href="/ai-index.json" className="hover:text-[#0A04AE]">AI Index</a>
        </div>
      </div>
    </footer>
  );
}
