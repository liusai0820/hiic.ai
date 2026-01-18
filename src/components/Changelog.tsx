import { Rocket, Sparkles, Wrench, Bell } from 'lucide-react';
import type { Announcement } from '../types';

interface ChangelogProps {
  announcements: Announcement[];
}

const typeConfig = {
  feature: { icon: Rocket, bg: 'bg-emerald-600', label: '新功能' },
  update: { icon: Sparkles, bg: 'bg-primary-600', label: '更新' },
  fix: { icon: Wrench, bg: 'bg-amber-600', label: '修复' },
  notice: { icon: Bell, bg: 'bg-violet-600', label: '公告' },
};

export function Changelog({ announcements }: ChangelogProps) {
  return (
    <section id="updates" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 mb-4">
            最近更新
          </h2>
          <p className="text-slate-600">
            持续优化，为你带来更好的使用体验
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-3 bottom-3 w-px bg-slate-200 hidden sm:block" />

          <div className="space-y-6">
            {announcements.map((item, index) => {
              const config = typeConfig[item.type];
              const Icon = config.icon;

              return (
                <div
                  key={item.id}
                  className="relative flex gap-4 sm:gap-6 opacity-0 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Icon - Pure solid color */}
                  <div className={`relative z-10 flex-shrink-0 icon-box icon-box-md ${config.bg}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </span>
                      <span className={`tag ${
                        item.type === 'feature' ? 'tag-green' :
                        item.type === 'update' ? 'tag-blue' :
                        item.type === 'fix' ? 'tag-orange' :
                        'tag-purple'
                      }`}>
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      {item.content}
                    </p>
                    <time className="text-xs text-slate-400 font-medium">
                      {item.date}
                    </time>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
