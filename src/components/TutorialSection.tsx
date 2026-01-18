import { Link } from 'react-router-dom';
import { BookOpen, Clock, Zap, Lightbulb, ArrowRight } from 'lucide-react';
import type { Tutorial } from '../types';

interface TutorialSectionProps {
  tutorials: Tutorial[];
}

const typeConfig = {
  quickstart: {
    icon: Zap,
    label: '快速入门',
    bgColor: 'bg-primary-600',
  },
  advanced: {
    icon: BookOpen,
    label: '进阶技巧',
    bgColor: 'bg-violet-600',
  },
  usecase: {
    icon: Lightbulb,
    label: '应用场景',
    bgColor: 'bg-emerald-600',
  },
};

export function TutorialSection({ tutorials }: TutorialSectionProps) {
  return (
    <section id="tutorials" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-4">
            <BookOpen className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">学习资源</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            教程与指南
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            从入门到精通，帮助你快速掌握每一款 AI 工具
          </p>
        </div>

        {/* Tutorials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tutorials.map((tutorial, index) => {
            const config = typeConfig[tutorial.type];
            const TypeIcon = config.icon;

            return (
              <Link
                key={tutorial.id}
                to={`/tutorials/${tutorial.id}`}
                className="card group p-6 flex gap-5 opacity-0 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center`}>
                  <TypeIcon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                      {config.label}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {tutorial.readTime}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {tutorial.title}
                  </h3>

                  <p className="text-sm text-slate-600 line-clamp-2">
                    {tutorial.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-primary-600" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
