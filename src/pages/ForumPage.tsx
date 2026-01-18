import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Plus,
  Flame,
  Clock,
  Star,
  Users,
  MessageCircle,
  TrendingUp,
  LogIn,
  LogOut
} from 'lucide-react';
import type { ForumCategoryId } from '../types';
import { PostCard } from '../components/PostCard';
import { PostDetailModal } from '../components/PostDetailModal';
import { CreatePostModal } from '../components/CreatePostModal';
import { LoginModal } from '../components/LoginModal';
import { forumCategories } from '../data';
import { useAuth } from '../contexts/AuthContext';
import { usePosts, useHotTags } from '../hooks';
import type { PostWithRelations } from '../types/database';

// 静态配置 (rendering-hoist-jsx)
const categoryColorClasses: Record<ForumCategoryId, { bg: string; text: string; light: string }> = {
  qa: { bg: 'bg-primary-600', text: 'text-primary-600', light: 'bg-primary-50' },
  tips: { bg: 'bg-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50' },
  talk: { bg: 'bg-amber-600', text: 'text-amber-600', light: 'bg-amber-50' },
  activity: { bg: 'bg-violet-600', text: 'text-violet-600', light: 'bg-violet-50' },
};

type SortType = 'hot' | 'latest' | 'pinned';

export function ForumPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedPost, setSelectedPost] = useState<PostWithRelations | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('latest');
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const { user, profile, signOut } = useAuth();

  // 进入页面时滚动到顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 从 URL 获取当前分类
  const currentCategory = searchParams.get('category') as ForumCategoryId | null;

  // 使用 hooks 获取数据
  const { data: posts = [], isLoading: postsLoading } = usePosts({
    category: currentCategory,
    searchQuery,
    sortBy,
  });

  const { data: hotTags = [] } = useHotTags(8);

  // 使用 Map 快速查找 (js-set-map-lookups)
  const categoryMap = useMemo(() => {
    return new Map(forumCategories.map(cat => [cat.id, cat]));
  }, []);

  // 统计数据
  const stats = useMemo(() => ({
    totalPosts: posts.length,
    totalComments: posts.reduce((sum, p) => sum + p.comments_count, 0),
    activeUsers: new Set(posts.map(p => p.author.name)).size,
  }), [posts]);

  // 回调函数
  const handleCategoryChange = useCallback((categoryId: ForumCategoryId | null) => {
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

  const handlePostClick = useCallback((post: PostWithRelations) => {
    setSelectedPost(post);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPost(null);
  }, []);

  const handleCreatePost = useCallback(() => {
    if (user) {
      setCreatePostOpen(true);
    } else {
      setLoginModalOpen(true);
    }
  }, [user]);

  const handleLogout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 返回按钮 */}
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">返回首页</span>
            </Link>

            {/* 标题 */}
            <h1 className="font-semibold text-lg text-slate-900">交流社区</h1>

            {/* 右侧按钮 */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-700">
                        {profile?.name?.slice(0, 1) || '用'}
                      </span>
                    </div>
                    <span>{profile?.name || '用户'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-ghost text-slate-500 hover:text-slate-700"
                    title="退出登录"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                  <button onClick={handleCreatePost} className="btn-primary">
                    <Plus className="w-4 h-4" />
                    发帖
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setLoginModalOpen(true)}
                    className="btn-secondary"
                  >
                    <LogIn className="w-4 h-4" />
                    登录
                  </button>
                  <button onClick={handleCreatePost} className="btn-primary">
                    <Plus className="w-4 h-4" />
                    发帖
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* 左侧边栏 */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            {/* 板块列表 */}
            <div className="card p-4 mb-6">
              <h3 className="font-semibold text-slate-900 mb-4">板块分类</h3>
              <nav className="space-y-1">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    !currentCategory
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  全部帖子
                  <span className="ml-auto text-xs text-slate-400">{posts.length}</span>
                </button>
                {forumCategories.map(category => {
                  const Icon = category.icon;
                  const colors = categoryColorClasses[category.id];
                  const isActive = currentCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? `${colors.light} ${colors.text}`
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {category.name}
                      <span className="ml-auto text-xs text-slate-400">{category.postCount}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* 热门标签 */}
            <div className="card p-4 mb-6">
              <h3 className="font-semibold text-slate-900 mb-4">热门标签</h3>
              <div className="flex flex-wrap gap-2">
                {hotTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => setSearchQuery(tag.name)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 text-xs text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 社区统计 */}
            <div className="card p-4">
              <h3 className="font-semibold text-slate-900 mb-4">社区统计</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    帖子总数
                  </span>
                  <span className="font-medium text-slate-900">{stats.totalPosts}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    评论总数
                  </span>
                  <span className="font-medium text-slate-900">{stats.totalComments}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    活跃用户
                  </span>
                  <span className="font-medium text-slate-900">{stats.activeUsers}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* 主内容区 */}
          <main className="flex-1 min-w-0">
            {/* 搜索和筛选 */}
            <div className="card p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* 搜索框 */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜索帖子..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>

                {/* 排序按钮 */}
                <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                  <button
                    onClick={() => setSortBy('latest')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'latest'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    最新
                  </button>
                  <button
                    onClick={() => setSortBy('hot')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'hot'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    热门
                  </button>
                  <button
                    onClick={() => setSortBy('pinned')}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'pinned'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Star className="w-4 h-4" />
                    精华
                  </button>
                </div>
              </div>
            </div>

            {/* 当前分类标题 */}
            {currentCategory && (
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const category = categoryMap.get(currentCategory);
                    if (!category) return null;
                    const Icon = category.icon;
                    const colors = categoryColorClasses[currentCategory];
                    return (
                      <>
                        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="font-semibold text-lg text-slate-900">{category.name}</h2>
                          <p className="text-sm text-slate-500">{category.description}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* 帖子列表 */}
            <div className="space-y-4">
              {postsLoading ? (
                <div className="card p-12 text-center">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-500">加载中...</p>
                </div>
              ) : posts.length > 0 ? (
                posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={{
                      id: post.id,
                      title: post.title,
                      content: post.content,
                      category: post.category as ForumCategoryId,
                      author: {
                        name: post.is_anonymous ? '匿名用户' : post.author.name,
                        department: post.is_anonymous ? '' : post.author.department,
                        avatar: post.author.avatar_url || '',
                      },
                      createdAt: post.created_at,
                      views: post.views,
                      likes: post.likes_count,
                      favorites: post.favorites_count,
                      comments: [],
                      tags: post.tags.map(t => t.tag.name),
                      isPinned: post.is_pinned,
                      isAnonymous: post.is_anonymous,
                    }}
                    onClick={() => handlePostClick(post)}
                  />
                ))
              ) : (
                <div className="card p-12 text-center">
                  <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-medium text-slate-700 mb-2">暂无帖子</h3>
                  <p className="text-sm text-slate-500">
                    {searchQuery ? '没有找到匹配的帖子，试试其他关键词' : '来发表第一篇帖子吧'}
                  </p>
                </div>
              )}
            </div>
          </main>

          {/* 右侧边栏 - 移动端隐藏 */}
          <aside className="hidden xl:block w-72 flex-shrink-0">
            {/* 发帖引导 */}
            <div className="card p-5 mb-6 bg-gradient-to-br from-primary-50 to-white border-primary-100">
              <h3 className="font-semibold text-slate-900 mb-2">分享你的想法</h3>
              <p className="text-sm text-slate-600 mb-4">
                有问题想问、经验想分享、建议想提？都可以在这里发帖交流
              </p>
              <button onClick={handleCreatePost} className="btn-primary w-full justify-center">
                <Plus className="w-4 h-4" />
                发布新帖
              </button>
            </div>

            {/* 活跃用户 */}
            <div className="card p-5">
              <h3 className="font-semibold text-slate-900 mb-4">活跃贡献者</h3>
              <div className="space-y-3">
                {Array.from(new Map(posts.map(p => [p.author.id, p.author])).values())
                  .slice(0, 5)
                  .map((author, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-600">
                          {author.name.slice(0, 1)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-slate-900 truncate">
                          {author.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {author.department}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 帖子详情弹窗 */}
      {selectedPost && (
        <PostDetailModal
          post={{
            id: selectedPost.id,
            title: selectedPost.title,
            content: selectedPost.content,
            category: selectedPost.category as ForumCategoryId,
            author: {
              name: selectedPost.is_anonymous ? '匿名用户' : selectedPost.author.name,
              department: selectedPost.is_anonymous ? '' : selectedPost.author.department,
              avatar: selectedPost.author.avatar_url || '',
            },
            createdAt: selectedPost.created_at,
            views: selectedPost.views,
            likes: selectedPost.likes_count,
            favorites: selectedPost.favorites_count,
            comments: [],
            tags: selectedPost.tags.map(t => t.tag.name),
            isPinned: selectedPost.is_pinned,
            isAnonymous: selectedPost.is_anonymous,
          }}
          onClose={handleCloseModal}
        />
      )}

      {/* 发帖弹窗 */}
      <CreatePostModal
        isOpen={createPostOpen}
        onClose={() => setCreatePostOpen(false)}
        defaultCategory={currentCategory || undefined}
      />

      {/* 登录弹窗 */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={() => setLoginModalOpen(false)}
      />
    </div>
  );
}
