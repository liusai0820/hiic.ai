import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Share2, Download, Sparkles, BookOpen, MessageSquare, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Minimize, BookOpenCheck, FileText, PanelRightClose, PanelRight } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import type { JournalIssue } from '../../types';

// 配置 PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface JournalReaderProps {
  issue: JournalIssue;
  onClose: () => void;
}

// 阅读主题配置
const themes = {
  light: {
    name: '白纸',
    bg: '#ffffff',
    pageBg: '#ffffff',
    text: '#1e293b',
    sidebar: 'bg-white',
    header: 'bg-white border-slate-200',
    toolbar: 'bg-white border-slate-200',
    containerBg: 'bg-slate-100',
    btnHover: 'hover:bg-slate-100',
    borderColor: 'border-slate-200',
  },
  sepia: {
    name: '羊皮纸',
    bg: '#f4ecd8',
    pageBg: '#faf6eb',
    text: '#5c4b37',
    sidebar: 'bg-[#f4ecd8]',
    header: 'bg-[#f4ecd8] border-[#d4c9b0]',
    toolbar: 'bg-[#faf6eb] border-[#d4c9b0]',
    containerBg: 'bg-[#ebe4d4]',
    btnHover: 'hover:bg-[#e8dfc8]',
    borderColor: 'border-[#d4c9b0]',
  },
  dark: {
    name: '夜间',
    bg: '#1a1a2e',
    pageBg: '#16213e',
    text: '#e2e8f0',
    sidebar: 'bg-[#1a1a2e]',
    header: 'bg-[#1a1a2e] border-[#2d2d44]',
    toolbar: 'bg-[#16213e] border-[#2d2d44]',
    containerBg: 'bg-[#0f0f1a]',
    btnHover: 'hover:bg-[#2d2d44]',
    borderColor: 'border-[#2d2d44]',
  },
  green: {
    name: '护眼',
    bg: '#c8e6c9',
    pageBg: '#e8f5e9',
    text: '#2e5a30',
    sidebar: 'bg-[#c8e6c9]',
    header: 'bg-[#c8e6c9] border-[#a5d6a7]',
    toolbar: 'bg-[#e8f5e9] border-[#a5d6a7]',
    containerBg: 'bg-[#b8dbb9]',
    btnHover: 'hover:bg-[#a5d6a7]',
    borderColor: 'border-[#a5d6a7]',
  },
};

type ThemeKey = keyof typeof themes;
type ViewMode = 'single' | 'double';

export function JournalReader({ issue, onClose }: JournalReaderProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>(() => window.innerWidth < 1024 ? 'single' : 'double');
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('light');
  const [showSidebar, setShowSidebar] = useState<boolean>(window.innerWidth >= 1024);
  const [showControls, setShowControls] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const readerRef = useRef<HTMLDivElement>(null);
  const theme = themes[currentTheme];

  const handleContentClick = (e: React.MouseEvent) => {
    // Only apply smart tap logic on mobile/small screens
    // On desktop, clicks might be for selecting text or other interactions
    if (window.innerWidth >= 1024) return;

    const width = window.innerWidth;
    const x = e.clientX;
    const threshold = width * 0.3;

    if (x < threshold) {
      previousPage();
    } else if (x > width - threshold) {
      nextPage();
    } else {
      setShowControls(!showControls);
    }
  };

  // 计算页面尺寸
  const calculatePageSize = useCallback(() => {
    if (!containerRef.current) return { width: 400, height: 600 };

    const container = containerRef.current;
    const isMobile = window.innerWidth < 640;
    const padding = isMobile ? 32 : 64;
    const containerWidth = container.clientWidth - padding;
    const containerHeight = container.clientHeight - 32;

    // A4 比例 约 1:1.414
    const aspectRatio = 1.414;

    if (viewMode === 'double') {
      // 双页模式：两页并排
      const maxPageWidth = (containerWidth - 24) / 2; // 中间间隔
      const maxPageHeight = containerHeight;

      let pageWidth = maxPageWidth;
      let pageHeight = pageWidth * aspectRatio;

      if (pageHeight > maxPageHeight) {
        pageHeight = maxPageHeight;
        pageWidth = pageHeight / aspectRatio;
      }

      return { width: Math.floor(pageWidth * scale), height: Math.floor(pageHeight * scale) };
    } else {
      // 单页模式
      let pageWidth = containerWidth;
      let pageHeight = pageWidth * aspectRatio;

      if (pageHeight > containerHeight) {
        pageHeight = containerHeight;
        pageWidth = pageHeight / aspectRatio;
      }

      return { width: Math.floor(pageWidth * scale), height: Math.floor(pageHeight * scale) };
    }
  }, [viewMode, scale]);

  // 监听容器尺寸变化，触发重新计算
  const [, forceUpdate] = useState({});
  useEffect(() => {
    const handleResize = () => forceUpdate({});
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isFullscreen, showSidebar]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  // 双页模式下，每次翻两页
  const changePage = (offset: number) => {
    if (viewMode === 'double') {
      setPageNumber(prevPageNumber => {
        const newPage = prevPageNumber + offset * 2;
        if (newPage < 1) return 1;
        if (newPage > numPages) return numPages;
        return newPage;
      });
    } else {
      setPageNumber(prevPageNumber => {
        const newPage = prevPageNumber + offset;
        if (newPage < 1) return 1;
        if (newPage > numPages) return numPages;
        return newPage;
      });
    }
  };

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function zoomIn() {
    setScale(prev => Math.min(prev + 0.1, 2.0));
  }

  function zoomOut() {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  }

  function resetZoom() {
    setScale(1.0);
  }

  // 全屏切换
  const toggleFullscreen = async () => {
    if (!readerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await readerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          previousPage();
          break;
        case 'ArrowRight':
          nextPage();
          break;
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          } else {
            onClose();
          }
          break;
        case '+':
        case '=':
          zoomIn();
          break;
        case '-':
          zoomOut();
          break;
        case 'f':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pageNumber, numPages, isFullscreen, viewMode]);

  const pageSize = calculatePageSize();

  // 获取当前显示的页码
  const getDisplayPages = () => {
    if (viewMode === 'single') {
      return [pageNumber];
    }
    // 双页模式
    if (pageNumber === 1) {
      return [1]; // 封面单独显示
    }
    // 确保左边是偶数页，右边是奇数页（像书本一样）
    const leftPage = pageNumber % 2 === 0 ? pageNumber : pageNumber - 1;
    const rightPage = leftPage + 1;
    return rightPage <= numPages ? [leftPage, rightPage] : [leftPage];
  };

  const displayPages = getDisplayPages();

  return (
    <div
      ref={readerRef}
      className="fixed inset-0 z-[60] flex flex-col animate-scale-in transition-colors duration-300"
      style={{ backgroundColor: theme.bg }}
    >
      {/* Header */}
      <header
        className={`
          absolute lg:static top-0 left-0 right-0 h-14 ${theme.header} border-b
          flex items-center justify-between px-4 sm:px-6 z-40 transition-all duration-300
          ${showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 lg:translate-y-0 lg:opacity-100'}
        `}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className={`p-2 ${theme.btnHover} rounded-lg transition-colors`}
            style={{ color: theme.text }}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop Title */}
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold" style={{ color: theme.text }}>{issue.title}</h1>
            <p className="text-xs opacity-60" style={{ color: theme.text }}>{issue.issueNumber} • {issue.publishDate}</p>
          </div>

          {/* Mobile Page Info */}
          <div className="sm:hidden text-sm font-medium" style={{ color: theme.text }}>
            {pageNumber} / {numPages || '-'}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile View Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'single' ? 'double' : 'single')}
            className={`p-2 ${theme.btnHover} rounded-lg transition-colors sm:hidden`}
            style={{ color: theme.text }}
            title="切换视图"
          >
            <BookOpenCheck className="w-5 h-5" />
          </button>

          <span className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-100">
            内部资料 • 严禁外传
          </span>
          <button className={`hidden sm:flex p-2 ${theme.btnHover} rounded-lg transition-colors`} style={{ color: theme.text }} title="分享">
            <Share2 className="w-5 h-5" />
          </button>
          <button className={`hidden sm:flex p-2 ${theme.btnHover} rounded-lg transition-colors`} style={{ color: theme.text }} title="下载原件">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: PDF Viewer */}
        <div className={`flex-1 ${theme.containerBg} relative overflow-hidden flex flex-col transition-colors duration-300`}>
          {/* Toolbar */}
          <div
            className={`
              absolute lg:static bottom-0 left-0 right-0 h-12 ${theme.toolbar} border-t lg:border-t-0 lg:border-b
              flex items-center justify-between sm:justify-center gap-4 px-4 overflow-x-auto z-40 shadow-sm transition-all duration-300
              ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 lg:translate-y-0 lg:opacity-100'}
            `}
          >
            {/* 视图模式切换 (Desktop only) */}
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: theme.text + '10' }}>
              <button
                onClick={() => setViewMode('single')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'single' ? 'bg-indigo-500 text-white shadow-sm' : ''}`}
                style={viewMode !== 'single' ? { color: theme.text } : {}}
                title="单页视图"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('double')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'double' ? 'bg-indigo-500 text-white shadow-sm' : ''}`}
                style={viewMode !== 'double' ? { color: theme.text } : {}}
                title="双页视图"
              >
                <BookOpenCheck className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden sm:block w-px h-6 opacity-20" style={{ backgroundColor: theme.text }} />

            {/* 翻页控制 (Desktop only) */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={previousPage}
                disabled={pageNumber <= 1}
                className={`p-1.5 ${theme.btnHover} rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors`}
                style={{ color: theme.text }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium min-w-[100px] text-center" style={{ color: theme.text }}>
                {viewMode === 'double' && displayPages.length === 2
                  ? `${displayPages[0]}-${displayPages[1]} / ${numPages || '-'}`
                  : `Page ${pageNumber} / ${numPages || '-'}`
                }
              </span>
              <button
                onClick={nextPage}
                disabled={viewMode === 'double' ? pageNumber >= numPages - 1 : pageNumber >= numPages}
                className={`p-1.5 ${theme.btnHover} rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-colors`}
                style={{ color: theme.text }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden sm:block w-px h-6 opacity-20" style={{ backgroundColor: theme.text }} />

            {/* 主题颜色快速切换 - 直接显示4个颜色按钮 */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs opacity-50 mr-1 hidden sm:inline" style={{ color: theme.text }}>主题</span>
              {(Object.keys(themes) as ThemeKey[]).map((key) => {
                const t = themes[key];
                return (
                  <button
                    key={key}
                    onClick={() => setCurrentTheme(key)}
                    className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${currentTheme === key
                      ? 'ring-2 ring-offset-1 ring-indigo-500 scale-110'
                      : 'opacity-70 hover:opacity-100'
                      }`}
                    style={{
                      backgroundColor: t.pageBg,
                      borderColor: t.text + '30'
                    }}
                    title={t.name}
                  />
                );
              })}
            </div>

            <div className="w-px h-6 opacity-20" style={{ backgroundColor: theme.text }} />

            {/* 缩放控制 */}
            <div className="flex items-center gap-2">
              <button onClick={zoomOut} className={`p-1.5 ${theme.btnHover} rounded-md transition-colors`} style={{ color: theme.text }}>
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={resetZoom}
                className="hidden sm:block text-sm font-medium w-14 text-center cursor-pointer hover:opacity-70 transition-opacity"
                style={{ color: theme.text }}
                title="重置缩放"
              >
                {Math.round(scale * 100)}%
              </button>
              <button onClick={zoomIn} className={`p-1.5 ${theme.btnHover} rounded-md transition-colors`} style={{ color: theme.text }}>
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <div className="hidden sm:block w-px h-6 opacity-20" style={{ backgroundColor: theme.text }} />

            {/* 全屏按钮 */}
            <button
              onClick={toggleFullscreen}
              className={`p-1.5 ${theme.btnHover} rounded-md transition-colors hidden sm:block`}
              style={{ color: theme.text }}
              title={isFullscreen ? '退出全屏' : '全屏阅读'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* 侧边栏切换 */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-1.5 ${theme.btnHover} rounded-md transition-colors flex-shrink-0`}
              style={{ color: theme.text }}
              title={showSidebar ? '隐藏侧边栏' : '显示侧边栏'}
            >
              {showSidebar ? <PanelRightClose className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
            </button>
          </div>

          {/* PDF 阅读区域 */}
          <div
            ref={containerRef}
            onClick={handleContentClick}
            className="flex-1 overflow-auto flex items-center justify-center p-4 sm:p-8 transition-colors duration-300 relative h-full"
            style={{ backgroundColor: theme.bg }}
          >
            {/* Watermark Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.02] rotate-[-45deg] select-none overflow-hidden z-50">
              <div className="text-6xl sm:text-9xl font-bold whitespace-nowrap" style={{ color: theme.text }}>
                HIIC INTERNAL ONLY
              </div>
            </div>

            {/* Mobile Navigation Hints */}
            {showControls && (
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-40 pointer-events-none lg:hidden flex items-center justify-between px-4">
                <div className="flex flex-col items-center gap-2 animate-pulse">
                  <div className="p-3 rounded-full bg-black/5 backdrop-blur-[2px] border border-black/5 shadow-sm">
                    <ChevronLeft className="w-6 h-6" style={{ color: theme.text }} />
                  </div>
                  <span className="text-[10px] font-medium opacity-50" style={{ color: theme.text }}>上一页</span>
                </div>

                <div className="flex flex-col items-center gap-2 animate-pulse">
                  <div className="p-3 rounded-full bg-black/5 backdrop-blur-[2px] border border-black/5 shadow-sm">
                    <ChevronRight className="w-6 h-6" style={{ color: theme.text }} />
                  </div>
                  <span className="text-[10px] font-medium opacity-50" style={{ color: theme.text }}>下一页</span>
                </div>
              </div>
            )}

            {/* 书本容器 */}
            <div
              className={`flex items-center justify-center gap-1 transition-all duration-300 ${viewMode === 'double' ? 'perspective-[2000px]' : ''
                }`}
            >
              <Document
                file={issue.pdfUrl || issue.cover}
                onLoadSuccess={onDocumentLoadSuccess}
                className="flex items-center justify-center"
                error={
                  <div
                    className="p-8 rounded-lg shadow text-center"
                    style={{ backgroundColor: theme.pageBg }}
                  >
                    <p className="mb-2" style={{ color: theme.text }}>无法加载 PDF 文件</p>
                    <p className="text-xs opacity-60" style={{ color: theme.text }}>请检查网络连接或稍后重试</p>
                  </div>
                }
                loading={
                  <div
                    className="p-12 rounded-lg shadow flex flex-col items-center"
                    style={{ backgroundColor: theme.pageBg }}
                  >
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
                    <p className="text-sm" style={{ color: theme.text }}>正在加载文档...</p>
                  </div>
                }
              >
                {viewMode === 'double' ? (
                  <div className="flex items-stretch gap-[2px]">
                    {displayPages.map((page, index) => (
                      <div
                        key={page}
                        className={`relative shadow-2xl transition-transform duration-300 ${index === 0 ? 'origin-right' : 'origin-left'
                          }`}
                        style={{
                          backgroundColor: theme.pageBg,
                          transform: displayPages.length === 2
                            ? `rotateY(${index === 0 ? '2deg' : '-2deg'})`
                            : 'none',
                          boxShadow: index === 0
                            ? 'inset -10px 0 30px rgba(0,0,0,0.1), -5px 0 20px rgba(0,0,0,0.2)'
                            : 'inset 10px 0 30px rgba(0,0,0,0.1), 5px 0 20px rgba(0,0,0,0.2)',
                        }}
                      >
                        {/* 书脊阴影效果 */}
                        {displayPages.length === 2 && (
                          <div
                            className="absolute top-0 bottom-0 w-8 z-10 pointer-events-none"
                            style={{
                              [index === 0 ? 'right' : 'left']: 0,
                              background: index === 0
                                ? 'linear-gradient(to left, rgba(0,0,0,0.15), transparent)'
                                : 'linear-gradient(to right, rgba(0,0,0,0.15), transparent)',
                            }}
                          />
                        )}
                        <Page
                          pageNumber={page}
                          width={pageSize.width}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                          className="transition-all duration-300"
                          canvasBackground={theme.pageBg}
                        />
                        {/* 页码 */}
                        <div
                          className="absolute bottom-2 text-xs font-medium opacity-40 w-full text-center"
                          style={{ color: theme.text }}
                        >
                          {page}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="shadow-2xl"
                    style={{ backgroundColor: theme.pageBg }}
                  >
                    <Page
                      pageNumber={pageNumber}
                      width={pageSize.width}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="transition-all duration-300"
                      canvasBackground={theme.pageBg}
                    />
                    {/* 页码 */}
                    <div
                      className="absolute bottom-2 text-xs font-medium opacity-40 w-full text-center"
                      style={{ color: theme.text }}
                    >
                      {pageNumber}
                    </div>
                  </div>
                )}
              </Document>
            </div>

            {/* 翻页热区 */}
            <button
              onClick={previousPage}
              disabled={pageNumber <= 1}
              className="absolute left-0 top-0 bottom-0 w-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-default hidden lg:flex items-center justify-start pl-4"
              style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.05), transparent)' }}
            >
              <ChevronLeft className="w-8 h-8 text-slate-400" />
            </button>
            <button
              onClick={nextPage}
              disabled={viewMode === 'double' ? pageNumber >= numPages - 1 : pageNumber >= numPages}
              className="absolute right-0 top-0 bottom-0 w-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-default hidden lg:flex items-center justify-end pr-4"
              style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.05), transparent)' }}
            >
              <ChevronRight className="w-8 h-8 text-slate-400" />
            </button>
          </div>


        </div>

        {/* Right: AI Analysis */}
        {showSidebar && (
          <>
            {/* Mobile Overlay Backdrop */}
            <div
              className="fixed inset-0 bg-black/20 z-20 lg:hidden"
              onClick={() => setShowSidebar(false)}
            />

            <div
              className={`
                fixed inset-y-0 right-0 z-30 w-80 shadow-2xl
                lg:static lg:shadow-none lg:w-96 lg:z-auto
                ${theme.sidebar} border-l ${theme.borderColor}
                flex flex-col flex-shrink-0 transition-all duration-300
              `}
            >
              <div className={`p-6 border-b ${theme.borderColor}`}>
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Insight</span>
              </div>
              <h2 className="text-lg font-bold" style={{ color: theme.text }}>智能速读</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <section>
                <h3 className="text-sm font-semibold mb-3" style={{ color: theme.text }}>核心观点 Summary</h3>
                <p className="text-sm leading-relaxed text-justify opacity-80" style={{ color: theme.text }}>
                  {issue.summary || 'Pending AI analysis...'}
                </p>
              </section>

              <section>
                <h3 className="text-sm font-semibold mb-3" style={{ color: theme.text }}>关键数据 Key Takeaways</h3>
                <ul className="space-y-3">
                  {issue.keyTakeaways && issue.keyTakeaways.length > 0 ? (
                    issue.keyTakeaways.map((point, i) => (
                      <li key={i} className="flex gap-3 text-sm" style={{ color: theme.text }}>
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-medium mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed opacity-80">{point}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm opacity-60" style={{ color: theme.text }}>
                      Content to be analyzed
                    </li>
                  )}
                </ul>
              </section>

              <section>
                <h3 className="text-sm font-semibold mb-3" style={{ color: theme.text }}>延伸阅读</h3>
                <div
                  className="p-4 rounded-xl border cursor-pointer transition-colors"
                  style={{
                    backgroundColor: theme.text + '05',
                    borderColor: theme.text + '10'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-4 h-4 mt-0.5 opacity-60" style={{ color: theme.text }} />
                    <div>
                      <p className="text-xs font-medium mb-1" style={{ color: theme.text }}>
                        关联内参报告
                      </p>
                      <p className="text-xs opacity-60" style={{ color: theme.text }}>
                        建议阅读《2025全球科技趋势展望》第3章关于此话题的论述。
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className={`p-4 border-t ${theme.borderColor}`} style={{ backgroundColor: theme.text + '05' }}>
              <button
                className="w-full py-2.5 border text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                style={{
                  backgroundColor: theme.pageBg,
                  borderColor: theme.text + '20',
                  color: theme.text
                }}
              >
                <MessageSquare className="w-4 h-4 opacity-60" />
                向 AI 提问本文内容
              </button>
            </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
