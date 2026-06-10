import { Link } from 'react-router-dom';

interface OfficialLogoProps {
  subtitle?: string;
}

export function OfficialLogo({ subtitle = 'AI Lab' }: OfficialLogoProps) {
  return (
    <Link to="/" className="flex min-w-0 shrink-0 items-center gap-3">
      <div className="flex h-11 w-[190px] shrink-0 items-center rounded-md bg-[#071b3d] px-3 shadow-sm shadow-[#071b3d]/20 sm:h-12 sm:w-[252px] sm:px-4">
        <img
          src="/brand/hiic-official-lockup-white.png"
          alt="HIIC 深圳国家高技术产业创新中心"
          className="h-7 w-full object-contain object-left sm:h-9"
        />
      </div>
      <div className="hidden min-w-0 leading-tight sm:block">
        <div className="truncate text-sm font-bold tracking-tight text-slate-950">
          {subtitle}
        </div>
        <div className="truncate text-xs font-medium text-[#52637A]">
          AI Research Portal
        </div>
      </div>
    </Link>
  );
}
