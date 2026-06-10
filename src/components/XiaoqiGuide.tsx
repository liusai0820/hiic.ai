import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

interface XiaoqiGuideProps {
  compact?: boolean;
  className?: string;
}

export function XiaoqiGuide({ compact = false, className = '' }: XiaoqiGuideProps) {
  return (
    <aside
      className={`relative overflow-hidden rounded-lg border border-[#c9d8ff] bg-[#eef5ff] shadow-sm ${compact ? 'p-4' : 'p-5'} ${className}`}
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-[#0A04AE]" />
      <div className={`grid items-center gap-4 ${compact ? 'grid-cols-[1fr_92px]' : 'sm:grid-cols-[1fr_160px]'}`}>
        <div className="relative z-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-white px-2.5 py-1 text-xs font-bold text-[#0A04AE] shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            小七导览员
          </div>
          <h2 className={`${compact ? 'text-base' : 'text-xl'} font-bold tracking-tight text-slate-950`}>
            先看应用，再看方法，最后看研究成果
          </h2>
          <p className={`${compact ? 'mt-2 line-clamp-2 text-xs leading-5' : 'mt-3 text-sm leading-6'} text-[#52637A]`}>
            小七会把 AI 应用、Skill、教程和报告串成一条清晰路径，方便外部理解我们的能力，也方便内部持续维护。
          </p>
          {!compact && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/apps" className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#0A04AE] px-3 text-xs font-bold text-white transition hover:bg-[#08038f]">
                看应用 <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/reports" className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#c9d8ff] bg-white px-3 text-xs font-bold text-[#0A04AE] transition hover:border-[#0A04AE]">
                看报告 <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        <div className="relative z-10 flex justify-center">
          <div className="q7-float">
            <img
              src="/brand/xiaoqi-duo-guide-2d.png"
              alt="深国创中心小七导览员"
              className={`${compact ? 'h-24' : 'h-36'} w-auto object-contain`}
            />
          </div>
          <div className="q7-shadow absolute bottom-0 h-3 w-24 rounded-full bg-[#0A04AE]/15 blur-sm" />
        </div>
      </div>
    </aside>
  );
}
