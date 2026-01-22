import { journalSources } from '../../data';
import { Newspaper, ChevronRight, ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  activeSourceId: string;
  onSourceSelect: (sourceId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ activeSourceId, onSourceSelect, isOpen = false, onClose }: SidebarProps) {
  // Group sources by category
  const categories = Array.from(new Set(journalSources.map(s => s.category)));

  const getCategoryName = (cat: string) => {
    switch (cat) {
      case 'business': return '商业财经';
      case 'science': return '前沿科学';
      case 'technology': return '创新技术';
      case 'internal': return '内部内参';
      case 'general': return '综合人文';
      default: return cat;
    }
  };

  const handleSelect = (id: string) => {
    onSourceSelect(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              {/* 返回主页按钮 */}
              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                返回主页
              </Link>

              {/* Mobile Close Button */}
              <button
                onClick={onClose}
                className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Newspaper className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">AI 智能阅览室</h1>
                <p className="text-xs text-slate-500">HIIC AI Library</p>
              </div>
            </div>

            <nav className="space-y-8 overflow-y-auto max-h-[calc(100vh-200px)]">
              {categories.map(category => (
                <div key={category}>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                    {getCategoryName(category)}
                  </h3>
                  <ul className="space-y-1">
                    {journalSources
                      .filter(source => source.category === category)
                      .map(source => (
                        <li key={source.id}>
                          <button
                            onClick={() => handleSelect(source.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${activeSourceId === source.id
                              ? 'bg-indigo-50 text-indigo-700 font-medium'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                              }`}
                          >
                            <span className="truncate">{source.name}</span>
                            {activeSourceId === source.id && (
                              <ChevronRight className="w-4 h-4 text-indigo-500" />
                            )}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className="px-6 py-4 border-t border-slate-100 mt-auto">
            <div className="p-3 bg-indigo-50 rounded-lg">
              <p className="text-xs text-indigo-800 leading-relaxed font-medium">
                内部资料仅供科研参考
                <br />
                严禁外传或用于商业用途
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
