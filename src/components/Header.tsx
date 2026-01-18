import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, Users } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  topOffset?: number;
}

export function Header({ searchQuery, onSearchChange, topOffset = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass border-b border-slate-200/60' : 'bg-transparent'
      }`}
      style={{ top: `${topOffset}px` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="/" className="group">
            <Logo size="md" showText className="hidden sm:flex" />
            <Logo size="sm" showText={false} className="sm:hidden" />
          </a>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索应用..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <a href="#apps" className="btn-ghost">应用</a>
            <a href="#tutorials" className="btn-ghost">教程</a>
            <a href="#community" className="btn-ghost">交流</a>
            <a href="#updates" className="btn-ghost">更新</a>
            <a href="#about" className="btn-ghost">关于</a>
            <div className="w-px h-5 bg-slate-200 mx-2" />
            <Link to="/community" className="btn-primary">
              <Users className="w-4 h-4" />
              内部社区
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 animate-fade-in">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索应用..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="input pl-11"
              />
            </div>
            <nav className="flex flex-col gap-1">
              <a href="#apps" className="btn-ghost justify-start" onClick={() => setMobileMenuOpen(false)}>应用</a>
              <a href="#tutorials" className="btn-ghost justify-start" onClick={() => setMobileMenuOpen(false)}>教程</a>
              <a href="#community" className="btn-ghost justify-start" onClick={() => setMobileMenuOpen(false)}>交流</a>
              <a href="#updates" className="btn-ghost justify-start" onClick={() => setMobileMenuOpen(false)}>更新</a>
              <a href="#about" className="btn-ghost justify-start" onClick={() => setMobileMenuOpen(false)}>关于</a>
              <Link
                to="/community"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary justify-start"
              >
                <Users className="w-4 h-4" />
                内部社区
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
