import { useMemo } from 'react';
import { Heart, MessageCircle, Bookmark, Eye, Pin, Flame } from 'lucide-react';
import type { ForumPost, ForumCategoryId } from '../types';

// 静态颜色映射 - 提取到组件外 (rendering-hoist-jsx)
const categoryColors: Record<ForumCategoryId, { bg: string; text: string }> = {
  qa: { bg: 'bg-primary-100', text: 'text-primary-700' },
  tips: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  talk: { bg: 'bg-amber-100', text: 'text-amber-700' },
  activity: { bg: 'bg-violet-100', text: 'text-violet-700' },
};

const categoryNames: Record<ForumCategoryId, string> = {
  qa: '问答',
  tips: '心得',
  talk: '畅言',
  activity: '活动',
};

interface PostCardProps {
  post: ForumPost;
  onClick: (post: ForumPost) => void;
  compact?: boolean;
}

// 格式化时间
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  return date.toLocaleDateString('zh-CN');
}

export function PostCard({ post, onClick, compact = false }: PostCardProps) {
  // 使用 useMemo 缓存计算结果 (rerender-memo)
  const timeDisplay = useMemo(() => formatTime(post.createdAt), [post.createdAt]);
  const categoryStyle = useMemo(() => categoryColors[post.category], [post.category]);
  const categoryName = useMemo(() => categoryNames[post.category], [post.category]);

  if (compact) {
    // 紧凑模式 - 用于首页预览
    return (
      <button
        onClick={() => onClick(post)}
        className="w-full text-left p-4 rounded-xl hover:bg-slate-50 transition-colors group"
      >
        <div className="flex items-start gap-3">
          {/* 状态标识 */}
          <div className="flex-shrink-0 mt-0.5">
            {post.isPinned ? (
              <Pin className="w-4 h-4 text-primary-600" />
            ) : post.isHot ? (
              <Flame className="w-4 h-4 text-rose-500" />
            ) : (
              <div className={`w-2 h-2 rounded-full ${categoryStyle.bg}`} />
            )}
          </div>

          {/* 内容 */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-slate-900 truncate group-hover:text-primary-600 transition-colors">
              {post.title}
            </h4>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
              <span>{post.author.name}</span>
              <span>{post.author.department}</span>
              <span>{timeDisplay}</span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {post.comments.length}
              </span>
            </div>
          </div>
        </div>
      </button>
    );
  }

  // 完整卡片模式 - 用于论坛列表
  return (
    <button
      onClick={() => onClick(post)}
      className="w-full text-left card p-5 hover:shadow-elevated transition-all group"
    >
      {/* 头部：分类 + 标签 */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
          {categoryName}
        </span>
        {post.isPinned && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-primary-600 text-white">
            <Pin className="w-3 h-3" />
            置顶
          </span>
        )}
        {post.isHot && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-rose-100 text-rose-700">
            <Flame className="w-3 h-3" />
            热门
          </span>
        )}
      </div>

      {/* 标题 */}
      <h3 className="font-semibold text-lg text-slate-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
        {post.title}
      </h3>

      {/* 内容预览 */}
      <p className="text-sm text-slate-600 line-clamp-2 mb-4">
        {post.content.replace(/[#*`\n]/g, ' ').slice(0, 120)}...
      </p>

      {/* 底部：作者信息 + 互动数据 */}
      <div className="flex items-center justify-between">
        {/* 作者 */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
            <span className="text-xs font-medium text-slate-600">
              {post.author.name.slice(0, 1)}
            </span>
          </div>
          <div className="text-xs">
            <span className="text-slate-700 font-medium">{post.author.name}</span>
            <span className="text-slate-400 mx-1">·</span>
            <span className="text-slate-500">{post.author.department}</span>
            <span className="text-slate-400 mx-1">·</span>
            <span className="text-slate-500">{timeDisplay}</span>
          </div>
        </div>

        {/* 互动数据 */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {post.views}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            {post.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {post.comments.length}
          </span>
          <span className="flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5" />
            {post.favorites}
          </span>
        </div>
      </div>
    </button>
  );
}
