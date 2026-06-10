import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, RefreshCw, Wifi } from 'lucide-react';
import { getItemPath, type PortalContentItem } from '../content/portal';

interface LiveFeedItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  category: string;
  score?: number;
}

interface LiveDailySection {
  label: string;
  items: Array<{
    title: string;
    summary: string;
    url: string;
    source: string;
  }>;
}

interface LiveFeedPayload {
  generatedAt: string;
  source: {
    name: string;
    agent: string;
    rss?: string;
  };
  items: LiveFeedItem[];
  daily?: {
    date?: string;
    generatedAt?: string;
    sections?: LiveDailySection[];
  };
  error?: string;
}

interface AIConsultingLiveFeedProps {
  fallbackItems: PortalContentItem[];
}

function formatTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '刚刚';

  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function AIConsultingLiveFeed({ fallbackItems }: AIConsultingLiveFeedProps) {
  const [payload, setPayload] = useState<LiveFeedPayload | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');

  useEffect(() => {
    let cancelled = false;

    async function loadFeed() {
      try {
        const response = await fetch('/api/ai-consulting?take=6', {
          headers: { accept: 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`AI consulting feed returned ${response.status}`);
        }
        const data = (await response.json()) as LiveFeedPayload;
        if (!cancelled) {
          setPayload(data);
          setStatus(data.items.length > 0 ? 'ready' : 'fallback');
        }
      } catch {
        if (!cancelled) {
          setStatus('fallback');
        }
      }
    }

    void loadFeed();

    return () => {
      cancelled = true;
    };
  }, []);

  const dailyLead = useMemo(() => {
    return payload?.daily?.sections?.find((section) => section.items.length > 0);
  }, [payload]);

  if (status === 'ready' && payload) {
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950">
              AI 咨询实时动态
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                <Wifi className="h-3 w-3" />
                Live
              </span>
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              来自 AI HOT，约 5 分钟刷新一次
            </p>
          </div>
          <a href={payload.source.agent} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-[#0A04AE]">
            来源 <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {dailyLead && (
          <a
            href={dailyLead.items[0]?.url}
            target="_blank"
            rel="noreferrer"
            className="mb-3 block rounded-lg border border-[#d8e4ff] bg-[#f8fbff] p-3 transition hover:border-[#0A04AE]"
          >
            <div className="text-xs font-bold text-[#0A04AE]">{dailyLead.label}</div>
            <p className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-slate-950">
              {dailyLead.items[0]?.title}
            </p>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
              {dailyLead.items[0]?.summary}
            </p>
          </a>
        )}

        <div className="divide-y divide-slate-100">
          {payload.items.slice(0, 5).map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="grid grid-cols-[56px_1fr_auto] items-center gap-3 py-2 transition hover:bg-[#f5f8ff]"
            >
              <time className="text-xs tabular-nums text-[#52637A]">{formatTime(item.publishedAt)}</time>
              <p className="truncate text-sm font-medium text-slate-900">{item.title}</p>
              <span className="max-w-[92px] truncate rounded-md border border-blue-100 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                {item.category}
              </span>
            </a>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <a href={payload.source.rss} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A04AE]">
            RSS / REST API <ArrowRight className="h-4 w-4" />
          </a>
          <span className="text-xs text-slate-500">
            更新 {formatTime(payload.generatedAt)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950">
            AI 观察与速递
            {status === 'loading' && <RefreshCw className="h-4 w-4 animate-spin text-[#0A04AE]" />}
          </h2>
          <p className="mt-1 text-xs text-slate-500">实时源不可用时展示本地精选内容</p>
        </div>
        <Link to="/insights" className="inline-flex items-center gap-1 text-sm font-semibold text-[#0A04AE]">
          更多 <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {fallbackItems.map((item) => (
          <Link
            key={item.slug}
            to={getItemPath(item)}
            className="grid grid-cols-[56px_1fr_auto] items-center gap-3 py-2 transition hover:bg-[#f5f8ff]"
          >
            <time className="text-sm tabular-nums text-[#52637A]">{item.date.slice(5)}</time>
            <p className="truncate text-sm font-medium text-slate-900">{item.title}</p>
            <span className="rounded-md border border-slate-100 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-600">
              {item.category}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
