import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { PortalContentKind } from '../content/portal';

interface XiaoqiGuideProps {
  scene?: PortalContentKind | 'home' | 'insights';
  compact?: boolean;
  className?: string;
}

const sceneGuide: Record<NonNullable<XiaoqiGuideProps['scene']>, {
  image: string;
  label: string;
  title: string;
  body: string;
  surface: string;
  dot: string;
  figureSurface: string;
  shadow: string;
  compactImageClass: string;
  imageClass: string;
  href?: string;
  action?: string;
}> = {
  home: {
    image: '/brand/xiaoqi-duo-guide-2d.png',
    label: '小七在场',
    title: '先看应用，再顺着方法和报告往下看。',
    body: '这里把工具、Skill、教程和研究成果放在同一条路径里，方便外部理解，也方便内部复用。',
    surface: 'border-[#cfe1ff] bg-gradient-to-br from-white via-[#f7fbff] to-[#effdf6]',
    dot: 'bg-[#31B7F0]',
    figureSurface: 'bg-[#eaf3ff]',
    shadow: 'bg-[#0A04AE]/12',
    compactImageClass: 'max-h-32',
    imageClass: 'max-h-40',
    href: '/apps',
    action: '看应用入口',
  },
  insights: {
    image: '/brand/xiaoqi-boy-standing-3d.png',
    label: '七哥留意到',
    title: '资讯先看时间线，再看哪些变化值得持续跟踪。',
    body: '保留日期、分类和摘要，后面新增报道时会自然长成一条智库观察线。',
    surface: 'border-[#d9e5ff] bg-gradient-to-br from-white via-[#f8fbff] to-[#fff7e8]',
    dot: 'bg-[#f5b638]',
    figureSurface: 'bg-[#fff1cc]',
    shadow: 'bg-[#f5b638]/20',
    compactImageClass: 'max-h-32',
    imageClass: 'max-h-40',
  },
  app: {
    image: '/brand/xiaoqi-product-board-3d.png',
    label: '打开前看一眼',
    title: '这个工具适合谁用、产出什么，先看清楚。',
    body: '应用页重点保留输入、输出、适用场景和当前状态。',
    surface: 'border-[#cfe1ff] bg-gradient-to-br from-white via-[#f5f9ff] to-[#edf7ff]',
    dot: 'bg-[#0A04AE]',
    figureSurface: 'bg-[#edf5ff]',
    shadow: 'bg-[#0A04AE]/12',
    compactImageClass: 'max-h-28',
    imageClass: 'max-h-36',
  },
  skill: {
    image: '/brand/xiaoqi-girl-standing-3d.png',
    label: '七妹的笔记',
    title: '能复用的经验，最好写成下次可以照着做的步骤。',
    body: 'Skill 页重点看输入、输出、流程和验收标准。',
    surface: 'border-[#d2e9de] bg-gradient-to-br from-white via-[#f9fffb] to-[#edf9f3]',
    dot: 'bg-[#35b779]',
    figureSurface: 'bg-[#e8f8ef]',
    shadow: 'bg-[#35b779]/18',
    compactImageClass: 'max-h-32',
    imageClass: 'max-h-40',
  },
  tutorial: {
    image: '/brand/xiaoqi-boy-reading-3d.png',
    label: '跟着做',
    title: '照着走一遍，先拿到一个真实结果。',
    body: '教程页优先看步骤、注意事项和产出检查。',
    surface: 'border-[#ddd7ff] bg-gradient-to-br from-white via-[#faf8ff] to-[#f3f0ff]',
    dot: 'bg-[#7c5cff]',
    figureSurface: 'bg-[#f0ecff]',
    shadow: 'bg-[#7c5cff]/16',
    compactImageClass: 'max-h-28',
    imageClass: 'max-h-36',
  },
  insight: {
    image: '/brand/xiaoqi-boy-dashboard-2d.png',
    label: '观察旁注',
    title: '先分清事实、判断，以及还要继续验证的问题。',
    body: '资讯观察页适合保留时间、来源、主题和业务影响。',
    surface: 'border-[#d9e5ff] bg-gradient-to-br from-white via-[#f8fbff] to-[#fff7e8]',
    dot: 'bg-[#f5b638]',
    figureSurface: 'bg-[#fff1cc]',
    shadow: 'bg-[#f5b638]/20',
    compactImageClass: 'max-h-28',
    imageClass: 'max-h-36',
  },
  report: {
    image: '/brand/xiaoqi-boy-trophy-3d.png',
    label: '读报告时',
    title: '先抓核心结论，再看方法和证据。',
    body: '报告页重点帮助读者快速判断这份成果的价值。',
    surface: 'border-[#cfe1ff] bg-gradient-to-br from-white via-[#f7fbff] to-[#eef5ff]',
    dot: 'bg-[#1F6FEB]',
    figureSurface: 'bg-[#eaf3ff]',
    shadow: 'bg-[#1F6FEB]/16',
    compactImageClass: 'max-h-28',
    imageClass: 'max-h-36',
  },
  collection: {
    image: '/brand/xiaoqi-duo-guide-2d.png',
    label: '专题旁边',
    title: '把阶段动作串起来，看见一条完整的能力建设线。',
    body: '让外部看到组织能力，也让内部知道下一步怎么沉淀。',
    surface: 'border-[#d6defc] bg-gradient-to-br from-white via-[#f7fbff] to-[#f0f7ff]',
    dot: 'bg-[#31B7F0]',
    figureSurface: 'bg-[#edf7ff]',
    shadow: 'bg-[#0A04AE]/12',
    compactImageClass: 'max-h-32',
    imageClass: 'max-h-40',
  },
};

export function XiaoqiGuide({ scene = 'home', compact = false, className = '' }: XiaoqiGuideProps) {
  const guide = sceneGuide[scene];

  return (
    <aside
      className={`relative overflow-hidden rounded-lg border shadow-sm shadow-[#0A04AE]/5 ${guide.surface} ${compact ? 'p-4' : 'p-5'} ${className}`}
    >
      <div className={`pointer-events-none absolute right-[-42px] top-[-42px] h-28 w-28 rounded-full ${guide.figureSurface} blur-2xl`} />
      <div className={`grid items-center gap-4 ${compact ? 'grid-cols-[minmax(0,1fr)_112px]' : 'sm:grid-cols-[minmax(0,1fr)_160px]'}`}>
        <div className="relative z-10">
          <div className="mb-3 text-[11px] font-bold text-[#0A04AE]">
            {guide.label}
          </div>
          <h2 className={`${compact ? 'text-base leading-6' : 'text-xl leading-7'} font-bold tracking-tight text-slate-950`}>
            {guide.title}
          </h2>
          <p className={`${compact ? 'mt-2 line-clamp-3 text-xs leading-5' : 'mt-3 text-sm leading-6'} text-[#52637A]`}>
            {guide.body}
          </p>
          {!compact && guide.href && guide.action && (
            <div className="mt-4">
              <Link to={guide.href} className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#0A04AE] px-3 text-xs font-bold text-white transition hover:bg-[#08038f]">
                {guide.action} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>

        <div className={`relative z-10 flex items-end justify-center ${compact ? 'min-h-28' : 'min-h-40'}`}>
          <div className={`absolute bottom-3 h-16 w-16 rounded-full ${guide.figureSurface}`} />
          <div className="q7-float relative z-10">
            <img
              src={guide.image}
              alt="深国创中心小七形象"
              className={`${compact ? guide.compactImageClass : guide.imageClass} w-auto object-contain`}
            />
          </div>
          <div className={`q7-shadow absolute bottom-0 h-2.5 w-20 rounded-full ${guide.shadow} blur-sm`} />
        </div>
      </div>
    </aside>
  );
}
