import { useState, useEffect } from 'react';
import { X, Megaphone, Sparkles, RefreshCw, Wrench, ChevronRight } from 'lucide-react';
import type { Announcement } from '../types';

interface AnnouncementBannerProps {
  announcements: Announcement[];
  onHeightChange?: (height: number) => void;
}

const typeConfig = {
  notice: {
    icon: Megaphone,
    label: '公告',
    bg: 'bg-slate-900',
    labelBg: 'bg-primary-500',
  },
  feature: {
    icon: Sparkles,
    label: '新功能',
    bg: 'bg-slate-900',
    labelBg: 'bg-emerald-500',
  },
  update: {
    icon: RefreshCw,
    label: '更新',
    bg: 'bg-slate-900',
    labelBg: 'bg-violet-500',
  },
  fix: {
    icon: Wrench,
    label: '修复',
    bg: 'bg-slate-900',
    labelBg: 'bg-amber-500',
  },
};

export function AnnouncementBanner({ announcements, onHeightChange }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);

  // Load dismissed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('hiic-dismissed-announcements');
    if (saved) {
      const parsed = JSON.parse(saved);
      const now = Date.now();
      const validDismissed = new Set<string>();
      for (const [id, timestamp] of Object.entries(parsed)) {
        if (now - (timestamp as number) < 24 * 60 * 60 * 1000) {
          validDismissed.add(id);
        }
      }
      setDismissed(validDismissed);
    }
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  // Get the latest active announcement that hasn't been dismissed
  const activeAnnouncement = announcements.find(
    (a) => !dismissed.has(a.id)
  );

  // Notify parent of height changes
  useEffect(() => {
    if (onHeightChange) {
      onHeightChange(activeAnnouncement ? 44 : 0);
    }
  }, [activeAnnouncement, onHeightChange]);

  const handleDismiss = (id: string) => {
    const newDismissed = new Set(dismissed);
    newDismissed.add(id);
    setDismissed(newDismissed);

    const saved = localStorage.getItem('hiic-dismissed-announcements');
    const parsed = saved ? JSON.parse(saved) : {};
    parsed[id] = Date.now();
    localStorage.setItem('hiic-dismissed-announcements', JSON.stringify(parsed));
  };

  if (!activeAnnouncement) return null;

  const config = typeConfig[activeAnnouncement.type];
  const Icon = config.icon;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[60] ${config.bg} transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-center h-11 gap-3 sm:gap-4">
          {/* Type Label - Pill */}
          <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${config.labelBg}`}>
            <Icon className="w-3 h-3 text-white" />
            <span className="text-[11px] font-semibold tracking-wide text-white uppercase">
              {config.label}
            </span>
          </div>

          {/* Mobile Icon */}
          <div className={`sm:hidden flex items-center justify-center w-6 h-6 rounded-full ${config.labelBg}`}>
            <Icon className="w-3 h-3 text-white" />
          </div>

          {/* Content */}
          <p className="text-sm text-slate-200 text-center">
            <span className="font-medium text-white">{activeAnnouncement.title}</span>
            {activeAnnouncement.content && (
              <span className="hidden md:inline ml-2 opacity-70">
                — {activeAnnouncement.content}
              </span>
            )}
          </p>

          {/* Learn More */}
          <button className="hidden sm:flex items-center gap-0.5 text-xs text-primary-400 hover:text-primary-300 transition-colors font-medium group">
            了解更多
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Dismiss */}
          <button
            onClick={() => handleDismiss(activeAnnouncement.id)}
            className="absolute right-0 p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="关闭公告"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
