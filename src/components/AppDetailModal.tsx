import { useEffect, useState } from 'react';
import { X, ExternalLink, MessageSquare, Eye, Zap, Clock, Tag, CheckCircle, ArrowUpRight, Sparkles, BookOpen } from 'lucide-react';
import type { App } from '../types';

interface AppDetailModalProps {
  app: App | null;
  visitCount: number;
  isOpen: boolean;
  onClose: () => void;
  onVisit: (appId: string) => void;
  onFeedback: (appId: string) => void;
}

const colorConfig: Record<string, { solid: string; light: string; text: string; border: string }> = {
  blue: { solid: 'bg-primary-600', light: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-200' },
  violet: { solid: 'bg-violet-600', light: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200' },
  emerald: { solid: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  amber: { solid: 'bg-amber-600', light: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  rose: { solid: 'bg-rose-600', light: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  indigo: { solid: 'bg-indigo-600', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
};

// App-specific features and use cases
const appDetails: Record<string, { features: string[]; useCases: string[]; tips: string }> = {
  ppt: {
    features: ['一键生成完整PPT', '多种专业模板', '智能排版布局', '支持PPTX导出'],
    useCases: ['季度工作汇报', '项目进展报告', '培训课件制作', '商业计划书'],
    tips: '输入越详细的主题描述，生成的内容越精准。建议包含具体的内容要点。',
  },
  chain: {
    features: ['智能产业分析', '上下游关系图', '交互式探索', '多格式导出'],
    useCases: ['产业调研报告', '投资分析', '竞争格局分析', '供应链梳理'],
    tips: '可以输入具体的产业名称，如"新能源汽车"、"半导体芯片"等。',
  },
  mind: {
    features: ['Markdown转思维导图', '多层级结构', 'Xmind格式导出', '实时预览'],
    useCases: ['会议纪要整理', '知识体系梳理', '项目规划', '读书笔记'],
    tips: '使用Markdown的标题层级(#、##、###)来定义思维导图的结构。',
  },
  report: {
    features: ['自动数据分析', '专业报告模板', '图表自动生成', 'Word/PDF导出'],
    useCases: ['市场调研报告', '数据分析报告', '行业研究报告', '月度总结'],
    tips: '上传数据后，AI会自动识别关键指标并生成分析结论。',
  },
  chart: {
    features: ['智能图表推荐', '多种可视化类型', '数据自动解读', '一键美化'],
    useCases: ['数据可视化', '报告配图', '趋势分析', '对比展示'],
    tips: '支持Excel、CSV等格式数据，AI会根据数据特征推荐最合适的图表类型。',
  },
  search: {
    features: ['语义理解检索', '多文档搜索', '智能摘要', '关联推荐'],
    useCases: ['政策文件检索', '研究资料查找', '知识库搜索', '文档归档'],
    tips: '使用自然语言描述你要查找的内容，比关键词搜索更精准。',
  },
};

export function AppDetailModal({
  app,
  visitCount,
  isOpen,
  onClose,
  onVisit,
  onFeedback,
}: AppDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'features' | 'usecases'>('features');

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Reset tab when app changes
  useEffect(() => {
    setActiveTab('features');
  }, [app?.id]);

  if (!isOpen || !app) return null;

  const colors = colorConfig[app.color || 'blue'];
  const Icon = app.icon;
  const isOnline = app.status === 'online';
  const details = appDetails[app.id] || {
    features: ['智能AI处理', '简洁易用界面', '高效工作流程', '持续功能更新'],
    useCases: ['日常办公', '报告制作', '数据处理', '信息整理'],
    tips: '更多功能正在开发中，敬请期待！',
  };

  const handleVisit = () => {
    if (isOnline && app.url !== '#') {
      onVisit(app.id);
      window.open(app.url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className={`${colors.solid} px-6 pt-6 pb-8 relative`}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white/80 hover:bg-white/30 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* App info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white">{app.name}</h2>
                {isOnline && (
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium">
                    v{app.version}
                  </span>
                )}
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                {app.description}
              </p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 text-white/80">
              <Eye className="w-4 h-4" />
              <span className="text-sm">
                <span className="font-semibold text-white">{visitCount}</span> 次使用
              </span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Tag className="w-4 h-4" />
              <span className="text-sm">{app.category}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              {isOnline ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">已上线</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">开发中</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-lg mb-5">
            <button
              onClick={() => setActiveTab('features')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'features'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <Sparkles className="w-4 h-4" />
              功能特性
            </button>
            <button
              onClick={() => setActiveTab('usecases')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'usecases'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <BookOpen className="w-4 h-4" />
              应用场景
            </button>
          </div>

          {/* Tab content */}
          <div className="mb-5">
            {activeTab === 'features' ? (
              <div className="grid grid-cols-2 gap-3">
                {details.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 p-3 rounded-xl ${colors.light} border ${colors.border}`}
                  >
                    <Zap className={`w-4 h-4 ${colors.text} flex-shrink-0`} />
                    <span className="text-sm text-slate-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {details.useCases.map((useCase, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <ArrowUpRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{useCase}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                  使用技巧
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {details.tips}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleVisit}
              disabled={!isOnline}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold transition-all ${isOnline
                  ? `${colors.solid} text-white hover:opacity-90 active:scale-[0.98]`
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
            >
              {isOnline ? (
                <>
                  <ExternalLink className="w-4 h-4" />
                  立即使用
                </>
              ) : (
                '即将上线'
              )}
            </button>
            <button
              onClick={() => onFeedback(app.id)}
              className="flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              反馈
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
