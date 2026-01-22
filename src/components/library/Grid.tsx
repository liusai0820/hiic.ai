import { BookOpen, Clock, AlertTriangle } from 'lucide-react';
import type { JournalIssue, JournalSource } from '../../types';

interface GridProps {
  source: JournalSource;
  issues: JournalIssue[];
  loading?: boolean;
  error?: string | null;
  onIssueClick: (issue: JournalIssue) => void;
}

export function Grid({ source, issues, loading, error, onIssueClick }: GridProps) {
  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>无法加载期刊数据: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 lg:mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight font-serif">
              {source.name}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 whitespace-nowrap">
              {source.frequency}
            </span>
          </div>
          <p className="text-slate-500 text-sm lg:text-lg max-w-2xl leading-relaxed">
            {source.description}
          </p>
        </div>

        {/* Compliance Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-100 self-start sm:self-auto">
          <AlertTriangle className="w-3.5 h-3.5" />
          内部研究资料
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 lg:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="flex flex-col animate-pulse">
              <div className="aspect-[3/4] mb-3 bg-slate-200 rounded-lg" />
              <div className="h-3 bg-slate-200 rounded w-1/2 mb-1.5" />
              <div className="h-4 bg-slate-200 rounded w-full mb-1.5" />
              <div className="h-3 bg-slate-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 lg:gap-6">
          {issues.map((issue) => (
            <article
              key={issue.id}
              onClick={() => onIssueClick(issue)}
              className="group cursor-pointer flex flex-col"
            >
              {/* Cover */}
              <div className="relative aspect-[3/4] mb-3 bg-slate-100 rounded-lg overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 ring-1 ring-slate-900/5">
                <img
                  src={issue.cover}
                  alt={issue.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 lg:p-3">
                  <button className="w-full py-1.5 lg:py-2 bg-white/95 backdrop-blur text-slate-900 text-xs lg:text-sm font-semibold rounded-lg shadow-lg flex items-center justify-center gap-1.5 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <BookOpen className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                    <span className="hidden sm:inline">阅读</span> AI 摘要
                  </button>
                </div>

                {/* Watermark */}
                <div className="absolute top-2 right-2 lg:top-3 lg:right-3 px-1.5 py-0.5 bg-black/30 backdrop-blur text-white/90 text-[8px] lg:text-[10px] rounded border border-white/20 pointer-events-none">
                  HIIC
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] lg:text-xs text-slate-500 mb-1 lg:mb-1.5 font-medium">
                  <span>{issue.publishDate}</span>
                  <span className="w-0.5 h-0.5 lg:w-1 lg:h-1 bg-slate-300 rounded-full" />
                  <span className="truncate">{issue.issueNumber}</span>
                </div>
                <h3 className="text-sm lg:text-base font-bold text-slate-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {source.name} - {issue.publishDate}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 lg:line-clamp-2 leading-relaxed hidden sm:block">
                  {issue.summary}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && issues.length === 0 && !error && (
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-500">暂无期刊数据</p>
        </div>
      )}
    </div>
  );
}
