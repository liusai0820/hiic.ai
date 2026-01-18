import { Star, ArrowRight, TrendingUp, Eye } from 'lucide-react';
import type { App, AppColor } from '../types';

interface FeaturedAppProps {
  app: App;
  visitCount: number;
  onVisit: (appId: string) => void;
}

const colorConfig: Record<AppColor, { bg: string; text: string; light: string }> = {
  blue: { bg: 'bg-primary-600', text: 'text-primary-600', light: 'bg-primary-50' },
  violet: { bg: 'bg-violet-600', text: 'text-violet-600', light: 'bg-violet-50' },
  emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50' },
  amber: { bg: 'bg-amber-600', text: 'text-amber-600', light: 'bg-amber-50' },
  rose: { bg: 'bg-rose-600', text: 'text-rose-600', light: 'bg-rose-50' },
  indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', light: 'bg-indigo-50' },
};

export function FeaturedApp({ app, visitCount, onVisit }: FeaturedAppProps) {
  const Icon = app.icon;
  const colors = colorConfig[app.color];

  const handleClick = () => {
    if (app.status === 'online') {
      onVisit(app.id);
      window.open(app.url, '_blank');
    }
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left - Featured Badge & App Info */}
            <div className="flex-1 p-6 sm:p-8 lg:p-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 mb-6">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-semibold text-amber-700">本周推荐</span>
              </div>

              {/* App Header */}
              <div className="flex items-start gap-5 mb-6">
                <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">
                    {app.name}
                  </h3>
                  <p className="text-slate-500">
                    {app.category} · v{app.version}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                {app.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-slate-500">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">{visitCount} 次使用</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">热度上升中</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleClick}
                className="btn-primary text-base px-6 py-3"
              >
                立即体验
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Right - Visual/Preview */}
            <div className={`hidden lg:flex lg:w-80 ${colors.light} items-center justify-center p-10`}>
              <div className={`w-32 h-32 rounded-3xl ${colors.bg} flex items-center justify-center opacity-90`}>
                <Icon className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
