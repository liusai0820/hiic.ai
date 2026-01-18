import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight, Flame, Clock, Star } from 'lucide-react';
import type { ForumPost, ForumCategory, ForumCategoryId } from '../types';
import { PostCard } from './PostCard';
import { PostDetailModal } from './PostDetailModal';

// 静态配置提取到组件外 (rendering-hoist-jsx)
const categoryColorClasses: Record<ForumCategoryId, string> = {
  qa: 'bg-primary-600',
  tips: 'bg-emerald-600',
  talk: 'bg-amber-600',
  activity: 'bg-violet-600',
};

type FilterType = 'hot' | 'latest' | 'pinned';

interface CommunitySectionProps {
  categories: ForumCategory[];
  posts: ForumPost[];
}

export function CommunitySection({ categories, posts }: CommunitySectionProps) {
  const [filter, setFilter] = useState<FilterType>('hot');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);

  // 筛选和排序帖子 (rerender-memo)
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    switch (filter) {
      case 'hot':
        result = result.filter(p => p.isHot || p.likes > 10).sort((a, b) => b.likes - a.likes);
        break;
      case 'latest':
        result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'pinned':
        result = result.filter(p => p.isPinned);
        break;
    }

    return result.slice(0, 5);
  }, [posts, filter]);

  // 总帖子数
  const totalPosts = useMemo(() => {
    return categories.reduce((sum, cat) => sum + cat.postCount, 0);
  }, [categories]);

  // 回调函数 (rerender-functional-setstate)
  const handlePostClick = useCallback((post: ForumPost) => {
    setSelectedPost(post);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPost(null);
  }, []);

  return (
    <section id="community" className="py-16 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-4">
            <MessageCircle className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">内部社区</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            交流社区
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            分享使用心得、提出建议、参与讨论，与同事一起探索 AI 工具的更多可能
          </p>
        </div>

        {/* 板块卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={`/community?category=${category.id}`}
                className="card p-5 hover:shadow-elevated transition-all group opacity-0 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-10 h-10 rounded-xl ${categoryColorClasses[category.id]} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{category.name}</h3>
                <p className="text-xs text-slate-500 mb-2">{category.description}</p>
                <div className="text-sm font-medium text-primary-600">
                  {category.postCount} 帖子
                </div>
              </Link>
            );
          })}
        </div>

        {/* 热门讨论 */}
        <div className="card overflow-hidden">
          {/* 头部 */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">热门讨论</h3>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setFilter('hot')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filter === 'hot'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                热门
              </button>
              <button
                onClick={() => setFilter('latest')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filter === 'latest'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                最新
              </button>
              <button
                onClick={() => setFilter('pinned')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filter === 'pinned'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                精华
              </button>
            </div>
          </div>

          {/* 帖子列表 */}
          <div className="divide-y divide-slate-100">
            {filteredPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onClick={handlePostClick}
                compact
              />
            ))}

            {filteredPosts.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                暂无帖子
              </div>
            )}
          </div>

          {/* 底部 */}
          <div className="p-5 bg-slate-50 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                共 <span className="font-medium text-slate-700">{totalPosts}</span> 篇帖子
              </p>
              <Link
                to="/community"
                className="btn-primary"
              >
                进入社区
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 帖子详情弹窗 */}
      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={handleCloseModal} />
      )}
    </section>
  );
}
