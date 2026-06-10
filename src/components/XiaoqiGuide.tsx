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
  labelSurface: string;
  glow: string;
  shadow: string;
  compactImageClass: string;
  imageClass: string;
  figureClass: string;
  href?: string;
  action?: string;
}> = {
  home: {
    image: '/brand/xiaoqi-city-stage-3d.png',
    label: '小七陪你逛',
    title: '从应用入口开始，顺手就能找到方法、教程和报告。',
    body: '首页不用讲太多概念，先把能看的成果、能用的工具、能复用的方法摆出来。',
    surface: 'border border-[#d8e4ff] bg-white/85 shadow-sm shadow-[#0A04AE]/5 backdrop-blur',
    labelSurface: 'bg-[#edf5ff] text-[#0A04AE]',
    glow: 'bg-[#cfe1ff]',
    shadow: 'bg-[#0A04AE]/12',
    compactImageClass: 'max-h-32',
    imageClass: 'max-h-44',
    figureClass: 'right-0',
    href: '/apps',
    action: '看应用入口',
  },
  insights: {
    image: '/brand/xiaoqi-girl-guide-2d.png',
    label: '小七翻到这里',
    title: '资讯先按时间看，再挑值得追踪的变化。',
    body: '每条资讯都保留来源、日期和判断，不把热闹误写成结论。',
    surface: 'border border-[#f3dca4] bg-white/90 shadow-sm shadow-[#f5b638]/10',
    labelSurface: 'bg-[#fff4d6] text-[#8a5a00]',
    glow: 'bg-[#ffefbd]',
    shadow: 'bg-[#f5b638]/20',
    compactImageClass: 'max-h-32',
    imageClass: 'max-h-40',
    figureClass: 'right-[-8px]',
  },
  app: {
    image: '/brand/xiaoqi-product-board-3d.png',
    label: '小七先试用',
    title: '看清楚这个工具适合谁、能产出什么。',
    body: '应用页只保留最关键的信息：入口、场景、输出和当前状态。',
    surface: 'border border-[#d8e4ff] bg-white/90 shadow-sm shadow-[#0A04AE]/5',
    labelSurface: 'bg-[#eef5ff] text-[#0A04AE]',
    glow: 'bg-[#dbeaff]',
    shadow: 'bg-[#0A04AE]/12',
    compactImageClass: 'max-h-28',
    imageClass: 'max-h-36',
    figureClass: 'right-[-10px]',
  },
  skill: {
    image: '/brand/xiaoqi-girl-standing-3d.png',
    label: '小七贴了便签',
    title: '能复用的经验，最好写成下次能照着做的步骤。',
    body: 'Skill 页重点看输入、输出、流程和验收标准。',
    surface: 'border border-[#cfe8dc] bg-white/90 shadow-sm shadow-[#35b779]/8',
    labelSurface: 'bg-[#eaf8f0] text-[#13724a]',
    glow: 'bg-[#d7f4e4]',
    shadow: 'bg-[#35b779]/18',
    compactImageClass: 'max-h-32',
    imageClass: 'max-h-40',
    figureClass: 'right-[-4px]',
  },
  tutorial: {
    image: '/brand/xiaoqi-boy-reading-3d.png',
    label: '小七坐下来看',
    title: '照着走一遍，先拿到一个真实结果。',
    body: '教程页优先看步骤、注意事项和产出检查，少讲概念，多给动作。',
    surface: 'border border-[#ddd7ff] bg-white/90 shadow-sm shadow-[#7c5cff]/8',
    labelSurface: 'bg-[#f1eeff] text-[#5b42d6]',
    glow: 'bg-[#e6e0ff]',
    shadow: 'bg-[#7c5cff]/16',
    compactImageClass: 'max-h-28',
    imageClass: 'max-h-36',
    figureClass: 'right-[-6px]',
  },
  insight: {
    image: '/brand/xiaoqi-boy-dashboard-2d.png',
    label: '小七看了看数据',
    title: '先分清事实、判断，以及还要继续验证的问题。',
    body: '观察页适合保留时间、来源、主题和业务影响。',
    surface: 'border border-[#f3dca4] bg-white/90 shadow-sm shadow-[#f5b638]/10',
    labelSurface: 'bg-[#fff4d6] text-[#8a5a00]',
    glow: 'bg-[#ffefbd]',
    shadow: 'bg-[#f5b638]/20',
    compactImageClass: 'max-h-28',
    imageClass: 'max-h-36',
    figureClass: 'right-[-8px]',
  },
  report: {
    image: '/brand/xiaoqi-boy-trophy-3d.png',
    label: '小七替你划重点',
    title: '先抓核心结论，再看方法和证据。',
    body: '报告页要帮助读者快速判断这份成果的价值，以及它可以怎么被引用。',
    surface: 'border border-[#cfe1ff] bg-white/90 shadow-sm shadow-[#1F6FEB]/8',
    labelSurface: 'bg-[#edf5ff] text-[#1556b8]',
    glow: 'bg-[#dbeaff]',
    shadow: 'bg-[#1F6FEB]/16',
    compactImageClass: 'max-h-28',
    imageClass: 'max-h-36',
    figureClass: 'right-[-8px]',
  },
  collection: {
    image: '/brand/xiaoqi-duo-guide-2d.png',
    label: '小七一起看全局',
    title: '把阶段动作串起来，看见一条完整的能力建设线。',
    body: '专题页让外部看到组织能力，也让内部知道下一步怎么沉淀。',
    surface: 'border border-[#d6defc] bg-white/90 shadow-sm shadow-[#0A04AE]/5',
    labelSurface: 'bg-[#edf7ff] text-[#0A04AE]',
    glow: 'bg-[#dbeaff]',
    shadow: 'bg-[#0A04AE]/12',
    compactImageClass: 'max-h-32',
    imageClass: 'max-h-40',
    figureClass: 'right-[-6px]',
  },
};

export function XiaoqiGuide({ scene = 'home', compact = false, className = '' }: XiaoqiGuideProps) {
  const guide = sceneGuide[scene];

  return (
    <aside
      className={`relative isolate overflow-hidden rounded-lg ${guide.surface} ${compact ? 'min-h-[142px] p-4 pr-[116px]' : 'min-h-[188px] p-5 pr-[180px]'} ${className}`}
    >
      <div className={`pointer-events-none absolute bottom-[-52px] ${compact ? 'right-[-54px] h-40 w-40' : 'right-[-70px] h-56 w-56'} rounded-full ${guide.glow} opacity-80 blur-2xl`} />
      <div className="relative z-10 max-w-[520px]">
        <div className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${guide.labelSurface}`}>
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

      <div className={`pointer-events-none absolute bottom-0 ${guide.figureClass} z-10 flex ${compact ? 'w-[118px]' : 'w-[172px]'} items-end justify-center`}>
        <div className="q7-float relative z-10">
          <img
            src={guide.image}
            alt="深国创中心小七形象"
            className={`${compact ? guide.compactImageClass : guide.imageClass} w-auto object-contain`}
          />
        </div>
        <div className={`q7-shadow absolute bottom-1 h-2.5 w-20 rounded-full ${guide.shadow} blur-sm`} />
      </div>
    </aside>
  );
}
