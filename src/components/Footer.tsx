import { Mail } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo size="sm" className="[&_span]:text-white [&_.font-serif]:text-white" />
            <p className="text-sm">
              © {currentYear} HIIC AI Lab. Made by 开发者
            </p>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <a href="#apps" className="text-sm hover:text-white transition-colors">
              应用
            </a>
            <a href="#tutorials" className="text-sm hover:text-white transition-colors">
              教程
            </a>
            <a href="#community" className="text-sm hover:text-white transition-colors">
              交流
            </a>
            <a href="#updates" className="text-sm hover:text-white transition-colors">
              更新
            </a>
            <a href="#about" className="text-sm hover:text-white transition-colors">
              关于
            </a>
          </nav>

          {/* Contact */}
          <div className="flex items-center gap-3">
            <a
              href="mailto:ai@hiic.org.cn"
              className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              title="发送邮件"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          深圳国家高技术产业创新中心 · 内部使用
        </div>
      </div>
    </footer>
  );
}
