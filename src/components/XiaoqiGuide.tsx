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
    label: '小七带路',
    title: '从应用入口开始，看见一套 AI 能力是怎么长出来的。',
    body: '首页的小七只在路径旁边轻轻带一下，把应用、Skill、教程和报告串成一张能力地图。',
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
    label: '七哥观察',
    title: '先看时间，再看判断：把每天的信息变成可追踪的观察。',
    body: '这里保留日期、分类和趋势摘要，后续新增报道时能自然长成一条智库观察线。',
    surface: 'border-[#d9e5ff] bg-gradient-to-br from-white via-[#f8fbff] to-[#fff7e8]',
    dot: 'bg-[#f5b638]',
    figureSurface: 'bg-[#fff1cc]',
    shadow: 'bg-[#f5b638]/20',
    compactImageClass: 'max-h-32',
    imageClass: 'max-h-40',
  },
  app: {
    image: '/brand/xiaoqi-product-board-3d.png',
    label: '应用巡视',
    title: '这个工具能解决谁的什么问题，先在这里看清楚。',
    body: '应用详情页重点说清楚输入、输出、适用场景和当前状态。',
    surface: 'border-[#cfe1ff] bg-gradient-to-br from-white via-[#f5f9ff] to-[#edf7ff]',
    dot: 'bg-[#0A04AE]',
    figureSurface: 'bg-[#edf5ff]',
    shadow: 'bg-[#0A04AE]/12',
    compactImageClass: 'max-h-28',
    imageClass: 'max-h-36',
  },
  skill: {
    image: '/brand/xiaoqi-girl-standing-3d.png',
    label: '七妹提示',
    title: '把做过一次的经验，整理成下次可以直接复用的做法。',
    body: '这里更适合放模板、流程、验收标准和可复制经验。',
    surface: 'border-[#d2e9de] bg-gradient-to-br from-white via-[#f9fffb] to-[#edf9f3]',
    dot: 'bg-[#35b779]',
    figureSurface: 'bg-[#e8f8ef]',
    shadow: 'bg-[#35b779]/18',
    compactImageClass: 'max-h-32',
    imageClass: 'max-h-40',
  },
  tutorial: {
    image: '/brand/xiaoqi-boy-reading-3d.png',
    label: '学习路径',
    title: '照着走一遍，能交付一个真实结果。',
    body: '步骤、注意事项和产出检查，比概念解释更重要。',
    surface: 'border-[#ddd7ff] bg-gradient-to-br from-white via-[#faf8ff] to-[#f3f0ff]',
    dot: 'bg-[#7c5cff]',
    figureSurface: 'bg-[#f0ecff]',
    shadow: 'bg-[#7c5cff]/16',
    compactImageClass: 'max-h-28',
    imageClass: 'max-h-36',
  },
  insight: {
    image: '/brand/xiaoqi-boy-dashboard-2d.png',
    label: '趋势观察',
    title: '这条观察先分清事实、判断和还要继续验证的问题。',
    body: '资讯观察页适合保留时间、来源、主题和对业务的影响。',
    surface: 'border-[#d9e5ff] bg-gradient-to-br from-white via-[#f8fbff] to-[#fff7e8]',
    dot: 'bg-[#f5b638]',
    figureSurface: 'bg-[#fff1cc]',
    shadow: 'bg-[#f5b638]/20',
    compactImageClass: 'max-h-28',
    imageClass: 'max-h-36',
  },
  report: {
    image: '/brand/xiaoqi-boy-trophy-3d.png',
    label: '研究成果',
    title: '先抓住核心结论，再看方法和证据。',
    body: '小七在这里更像成果讲解员，帮助读者快速抓住报告价值。',
    surface: 'border-[#cfe1ff] bg-gradient-to-br from-white via-[#f7fbff] to-[#eef5ff]',
    dot: 'bg-[#1F6FEB]',
    figureSurface: 'bg-[#eaf3ff]',
    shadow: 'bg-[#1F6FEB]/16',
    compactImageClass: 'max-h-28',
    imageClass: 'max-h-36',
  },
  collection: {
    image: '/brand/xiaoqi-duo-guide-2d.png',
    label: '专题导航',
    title: '把阶段动作串起来，看见一条完整的能力建设线。',
    body: '让外部看到组织能力，也让内部知道下一步怎么继续沉淀。',
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
          <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-[#0A04AE]">
            <span className={`h-1.5 w-1.5 rounded-full ${guide.dot}`} />
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
