import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface JournalLayoutProps {
  children: ReactNode;
  activeSourceId: string;
  onSourceSelect: (sourceId: string) => void;
}

export function JournalLayout({ children, activeSourceId, onSourceSelect }: JournalLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar activeSourceId={activeSourceId} onSourceSelect={onSourceSelect} />
      <main className="flex-1 overflow-y-auto min-h-screen bg-slate-50/50">
        <div className="max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
