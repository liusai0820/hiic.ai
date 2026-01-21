import { useState, useMemo, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Search } from 'lucide-react';
import {
  Header,
  AnnouncementBanner,
  Hero,
  FeaturedApp,
  CategoryFilter,
  AppCard,
  AppDetailModal,
  TutorialSection,
  CommunitySection,
  Changelog,
  DeveloperSection,
  FeedbackModal,
  Footer,
  MobileFeedbackButton,
} from './components';
import { TutorialPage, ForumPage, LibraryPage } from './pages';
import { apps, categories, announcements, developer, tutorials, forumCategories, forumPosts } from './data';
import type { Category, App as AppType } from './types';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('全部');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackAppId, setFeedbackAppId] = useState<string | undefined>();
  const [selectedApp, setSelectedApp] = useState<AppType | null>(null);
  const [bannerHeight, setBannerHeight] = useState(44); // Default announcement banner height
  const [appVisits, setAppVisits] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('hiic-ai-visits');
    if (saved) {
      return JSON.parse(saved);
    }
    return apps.reduce((acc, app) => ({ ...acc, [app.id]: app.visitCount }), {});
  });

  // Filter apps
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch =
        searchQuery === '' ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === '全部' || app.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Calculate stats
  const totalVisits = Object.values(appVisits).reduce((sum, count) => sum + count, 0);
  const onlineAppsCount = apps.filter((app) => app.status === 'online').length;

  // Handle app visit
  const handleVisit = (appId: string) => {
    setAppVisits((prev) => {
      const newVisits = { ...prev, [appId]: (prev[appId] || 0) + 1 };
      localStorage.setItem('hiic-ai-visits', JSON.stringify(newVisits));
      return newVisits;
    });
  };

  // Handle feedback
  const handleFeedback = (appId?: string) => {
    setFeedbackAppId(appId);
    setFeedbackModalOpen(true);
  };

  // Get apps with updated visit counts
  const appsWithVisits = filteredApps.map((app) => ({
    ...app,
    visitCount: appVisits[app.id] || app.visitCount,
  }));

  // Get featured app (the one with most visits)
  const featuredApp = apps.find(app => app.status === 'online' && app.id === 'ppt')!;

  // Handle banner height change
  const handleBannerHeightChange = useCallback((height: number) => {
    setBannerHeight(height);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <AnnouncementBanner
        announcements={announcements}
        onHeightChange={handleBannerHeightChange}
      />

      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        topOffset={bannerHeight}
      />

      <main style={{ paddingTop: `${bannerHeight + 80}px` }}>
        <Hero totalApps={onlineAppsCount} totalVisits={totalVisits} />

        <FeaturedApp
          app={featuredApp}
          visitCount={appVisits[featuredApp.id] || featuredApp.visitCount}
          onVisit={handleVisit}
        />

        {/* Apps Section */}
        <section id="apps" className="py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                探索 AI 应用
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                精选多款 AI 工具，覆盖办公效率、数据可视化、研究分析等场景
              </p>
            </div>

            {/* Category Filter */}
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />

            {/* Apps Grid */}
            {appsWithVisits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appsWithVisits.map((app, index) => (
                  <AppCard
                    key={app.id}
                    app={app}
                    index={index}
                    onVisit={handleVisit}
                    onFeedback={handleFeedback}
                    onCardClick={setSelectedApp}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  未找到相关应用
                </h3>
                <p className="text-slate-500">
                  试试其他关键词或分类
                </p>
              </div>
            )}
          </div>
        </section>

        <TutorialSection tutorials={tutorials} />
        <CommunitySection categories={forumCategories} posts={forumPosts} />
        <Changelog announcements={announcements} />
        <DeveloperSection developer={developer} />
      </main>

      <Footer />

      <MobileFeedbackButton onClick={() => handleFeedback()} />

      <AppDetailModal
        app={selectedApp}
        visitCount={selectedApp ? (appVisits[selectedApp.id] || selectedApp.visitCount) : 0}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        onVisit={handleVisit}
        onFeedback={(appId) => {
          setSelectedApp(null);
          handleFeedback(appId);
        }}
      />

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          setFeedbackAppId(undefined);
        }}
        apps={apps}
        preselectedAppId={feedbackAppId}
      />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tutorials/:id" element={<TutorialPage />} />
      <Route path="/community" element={<ForumPage />} />
      <Route path="/library" element={<LibraryPage />} />
    </Routes>
  );
}

export default App;
