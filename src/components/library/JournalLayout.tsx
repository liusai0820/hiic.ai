import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, Newspaper } from 'lucide-react';

interface JournalLayoutProps {
  children: ReactNode;
  activeSourceId: string;
  onSourceSelect: (sourceId: string) => void;
}

export function JournalLayout({ children, activeSourceId, onSourceSelect }: JournalLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white flex-col lg:flex-row">
      {/* Mobile Header */}
      <header className="lg:hidden h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Newspaper className="w-5 h-5" />
          </div>
          <h1 className="text-base font-bold text-slate-900">AI 智能阅览室</h1>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -mr-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <Sidebar
        activeSourceId={activeSourceId}
        onSourceSelect={onSourceSelect}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 overflow-y-auto min-h-[calc(100vh-56px)] lg:min-h-screen bg-slate-50/50">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
