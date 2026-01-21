import { ExternalLink, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { App, AppColor } from '../types';

interface AppCardProps {
  app: App;
  onVisit: (id: string) => void;
  onFeedback: (id: string) => void;
  onCardClick?: (app: App) => void;
  index: number;
}

const colorConfig: Record<AppColor, string> = {
  blue: 'bg-primary-600',
  violet: 'bg-violet-600',
  emerald: 'bg-emerald-600',
  amber: 'bg-amber-600',
  rose: 'bg-rose-600',
  indigo: 'bg-indigo-600',
};

const categoryTagColors: Record<string, string> = {
  '办公效率': 'tag-blue',
  '数据可视化': 'tag-purple',
  '文档处理': 'tag-green',
  '研究分析': 'tag-orange',
};

export function AppCard({ app, onVisit, onFeedback, onCardClick, index }: AppCardProps) {
  const navigate = useNavigate();
  const Icon = app.icon;
  const isDisabled = app.status !== 'online';
  const iconBg = colorConfig[app.color] || 'bg-primary-600';
  const isInternal = app.url.startsWith('/');

  const handleVisit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDisabled) return;
    onVisit(app.id);

    if (isInternal) {
      navigate(app.url);
    } else {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleFeedback = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFeedback(app.id);
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(app);
    }
  };

  return (
    <article
      className={`group card p-6 opacity-0 animate-slide-up ${onCardClick ? 'cursor-pointer' : ''}`}
      style={{ animationDelay: `${index * 80}ms` }}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        {/* Icon - Pure solid color, no gradient */}
        <div className={`icon-box icon-box-lg ${iconBg} group-hover:scale-105 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        {/* Status Badge */}
        {app.status === 'coming' && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
            <Clock className="w-3 h-3" />
            即将上线
          </span>
        )}
      </div>

      {/* Category */}
      <div className="mb-3">
        <span className={`tag ${categoryTagColors[app.category] || 'tag-blue'}`}>
          {app.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
        {app.name}
      </h3>

      {/* Description - 固定两行高度确保对齐 */}
      <p className="text-sm text-slate-600 leading-relaxed mb-5 line-clamp-2 min-h-[2.625rem]">
        {app.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        {/* Stats */}
        {app.status === 'online' ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span>{app.visitCount} 次使用</span>
          </div>
        ) : (
          <div className="text-sm text-slate-400">敬请期待</div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {app.status === 'online' && (
            <button
              onClick={handleFeedback}
              className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="反馈"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleVisit}
            disabled={isDisabled}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${isDisabled
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98]'
              }`}
          >
            {isDisabled ? '即将上线' : '立即使用'}
            {!isDisabled && (isInternal ? <ArrowRight className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />)}
          </button>
        </div>
      </div>
    </article>
  );
}
