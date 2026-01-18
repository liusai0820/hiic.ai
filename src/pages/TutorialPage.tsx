import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Clock, User, Calendar, Send, MessageCircle, ArrowLeft, BookOpen, ChevronRight, Zap, Lightbulb, List, ArrowUp, Copy, Check } from 'lucide-react';
import { tutorials } from '../data';
import type { Comment } from '../types';

// Extract headings from markdown content
function extractHeadings(content: string) {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: { level: number; text: string; id: string }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ level, text, id });
  }

  return headings;
}

// Code block component with copy functionality
function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const codeString = String(children).replace(/\n$/, '');
  const language = className?.replace('language-', '') || '';

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [codeString]);

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
        {language && (
          <span className="px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100/80 rounded">
            {language}
          </span>
        )}
        <button
          onClick={handleCopy}
          className="p-1 rounded bg-slate-100/80 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-600 transition-all duration-200"
          title="复制代码"
        >
          {copied ? (
            <Check className="w-3 h-3 text-emerald-500" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>
      <code className={`${className} text-[13px] leading-relaxed`}>{children}</code>
    </div>
  );
}

const typeConfig = {
  quickstart: {
    icon: Zap,
    label: '快速入门',
    color: 'text-primary-600',
    bg: 'bg-primary-50',
    border: 'border-primary-200',
  },
  advanced: {
    icon: BookOpen,
    label: '进阶技巧',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
  usecase: {
    icon: Lightbulb,
    label: '应用场景',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
};

export function TutorialPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ author: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const [showMobileToc, setShowMobileToc] = useState(false);

  const tutorial = tutorials.find(t => t.id === id);
  const headings = useMemo(() => tutorial ? extractHeadings(tutorial.content) : [], [tutorial]);

  // Scroll to top when tutorial changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Load comments from localStorage
  useEffect(() => {
    if (tutorial) {
      const saved = localStorage.getItem(`tutorial-comments-${tutorial.id}`);
      if (saved) {
        setComments(JSON.parse(saved));
      } else {
        setComments([]);
      }
    }
  }, [tutorial]);

  // Track active heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveHeading(headings[i].id);
          return;
        }
      }
      if (headings.length > 0) {
        setActiveHeading(headings[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const saveComments = (newComments: Comment[]) => {
    if (tutorial) {
      localStorage.setItem(`tutorial-comments-${tutorial.id}`, JSON.stringify(newComments));
      setComments(newComments);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.author.trim() || !newComment.content.trim() || !tutorial) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const comment: Comment = {
      id: Date.now().toString(),
      tutorialId: tutorial.id,
      author: newComment.author.trim(),
      content: newComment.content.trim(),
      createdAt: new Date().toISOString(),
    };

    saveComments([...comments, comment]);
    setNewComment({ author: '', content: '' });
    setIsSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 7) return `${days} 天前`;
    return formatDate(dateString);
  };

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setShowMobileToc(false);
  };

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">教程不存在</h1>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const config = typeConfig[tutorial.type];
  const TypeIcon = config.icon;

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Top Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回</span>
            </button>

            {/* Mobile TOC Toggle */}
            <button
              onClick={() => setShowMobileToc(!showMobileToc)}
              className="xl:hidden flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-sm"
            >
              <List className="w-4 h-4" />
              <span>目录</span>
            </button>

            <Link to="/" className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">AI</span>
              </div>
              <span className="text-sm font-medium text-slate-900">HIIC AI Lab</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile TOC Dropdown */}
      {showMobileToc && (
        <div className="xl:hidden fixed inset-x-0 top-14 z-40 bg-white border-b border-slate-200 shadow-lg max-h-[60vh] overflow-y-auto">
          <div className="p-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">目录</p>
            <nav className="space-y-1">
              {headings.filter(h => h.level <= 2).map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                    heading.level === 1 ? '' : 'pl-6'
                  } ${
                    activeHeading === heading.id
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {heading.text}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="max-w-screen-2xl mx-auto">
        <div className="flex">
          {/* Left Sidebar - Compact Tutorial List */}
          <aside className="hidden lg:block w-56 flex-shrink-0 border-r border-slate-100">
            <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-6 px-4">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4 px-2">
                全部教程
              </p>
              <nav className="space-y-1">
                {tutorials.map((t) => {
                  const tConfig = typeConfig[t.type];
                  const TIcon = tConfig.icon;
                  const isActive = t.id === tutorial.id;

                  return (
                    <Link
                      key={t.id}
                      to={`/tutorials/${t.id}`}
                      className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <TIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                      <span className={`text-sm line-clamp-1 ${isActive ? 'font-medium' : ''}`}>
                        {t.title}
                      </span>
                      {isActive && (
                        <ChevronRight className="w-3.5 h-3.5 text-primary-400 ml-auto flex-shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content - Maximum Width */}
          <main className="flex-1 min-w-0">
            <article className="max-w-4xl mx-auto px-6 lg:px-12 py-10 lg:py-14">
              {/* Article Header */}
              <header className="mb-10">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md ${config.bg} ${config.border} border mb-5`}>
                  <TypeIcon className={`w-3.5 h-3.5 ${config.color}`} />
                  <span className={`text-xs font-medium ${config.color}`}>{config.label}</span>
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">
                  {tutorial.title}
                </h1>

                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  {tutorial.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>{tutorial.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>{formatDate(tutorial.publishDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{tutorial.readTime}阅读</span>
                  </div>
                </div>
              </header>

              {/* Divider */}
              <div className="w-16 h-px bg-slate-200 mb-10" />

              {/* Markdown Content - Comfortable Reading */}
              <div className="prose prose-slate prose-lg max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-2xl prose-h1:mt-12 prose-h1:mb-5
                prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-slate-100
                prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-5
                prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900 prose-strong:font-semibold
                prose-code:text-primary-600 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-slate-50 prose-pre:text-slate-800 prose-pre:rounded-xl prose-pre:p-5 prose-pre:border prose-pre:border-slate-200
                prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-primary-50 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-700
                prose-table:border-collapse prose-th:bg-slate-50 prose-th:border prose-th:border-slate-200 prose-th:px-4 prose-th:py-3 prose-td:border prose-td:border-slate-200 prose-td:px-4 prose-td:py-3
                prose-li:text-slate-600 prose-li:marker:text-slate-400
                prose-hr:border-slate-200 prose-hr:my-10
              ">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => {
                      const text = String(children);
                      const headingId = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '');
                      return <h1 id={headingId} className="scroll-mt-20">{children}</h1>;
                    },
                    h2: ({ children }) => {
                      const text = String(children);
                      const headingId = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '');
                      return <h2 id={headingId} className="scroll-mt-20">{children}</h2>;
                    },
                    h3: ({ children }) => {
                      const text = String(children);
                      const headingId = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-').replace(/(^-|-$)/g, '');
                      return <h3 id={headingId} className="scroll-mt-20">{children}</h3>;
                    },
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                    pre: ({ children }) => (
                      <pre className="not-prose bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 overflow-x-auto">
                        {children}
                      </pre>
                    ),
                    code: ({ className, children, ...props }) => {
                      const isInline = !className;
                      if (isInline) {
                        return (
                          <code className="text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded text-sm font-normal border border-primary-100" {...props}>
                            {children}
                          </code>
                        );
                      }
                      return <CodeBlock className={className}>{children}</CodeBlock>;
                    },
                  }}
                >
                  {tutorial.content}
                </ReactMarkdown>
              </div>

              {/* Article Footer */}
              <footer className="mt-16 pt-8 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <Link
                    to="/"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    返回首页
                  </Link>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary-600 transition-colors"
                  >
                    回到顶部
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </footer>
            </article>

            {/* Comments Section */}
            <section className="max-w-4xl mx-auto px-6 lg:px-12 pb-16">
              <div className="bg-slate-50 rounded-2xl p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <MessageCircle className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    评论 ({comments.length})
                  </h2>
                </div>

                {/* Comment Form */}
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="sm:col-span-1">
                      <input
                        type="text"
                        placeholder="你的名字"
                        value={newComment.author}
                        onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="写下你的想法..."
                          value={newComment.content}
                          onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                          className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 transition-all"
                          required
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting || !newComment.author.trim() || !newComment.content.trim()}
                          className="px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                        >
                          {isSubmitting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          <span className="hidden sm:inline">发送</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3 bg-white rounded-xl p-4">
                        <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-600 font-semibold text-sm">
                            {comment.author.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-900 text-sm">{comment.author}</span>
                            <span className="text-xs text-slate-400">{formatCommentDate(comment.createdAt)}</span>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400 text-sm">还没有评论，来发表第一条吧</p>
                  </div>
                )}
              </div>
            </section>
          </main>

          {/* Right Sidebar - Subtle TOC */}
          <aside className="hidden xl:block w-52 flex-shrink-0 border-l border-slate-100">
            <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 px-5">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">
                本文目录
              </p>
              <nav className="space-y-0.5">
                {headings.filter(h => h.level <= 2).map((heading) => (
                  <button
                    key={heading.id}
                    onClick={() => scrollToHeading(heading.id)}
                    className={`block w-full text-left text-[13px] py-1.5 transition-colors leading-snug ${
                      heading.level === 1 ? '' : 'pl-3'
                    } ${
                      activeHeading === heading.id
                        ? 'text-primary-600 font-medium'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {heading.text}
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={() => {
                    const commentSection = document.querySelector('section:last-of-type');
                    if (commentSection) {
                      commentSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center gap-2 text-xs text-slate-400 hover:text-primary-600 transition-colors mb-3"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  跳转到评论
                </button>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center gap-2 text-xs text-slate-400 hover:text-primary-600 transition-colors"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  回到顶部
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
