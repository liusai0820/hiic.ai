import { useState, useMemo, useCallback } from 'react';
import { X, Heart, Bookmark, Share2, Send, Pin, Flame, Eye } from 'lucide-react';
import type { ForumPost, ForumCategoryId } from '../types';

// 静态配置提取到组件外 (rendering-hoist-jsx)
const categoryColors: Record<ForumCategoryId, { bg: string; text: string; border: string }> = {
  qa: { bg: 'bg-primary-600', text: 'text-white', border: 'border-primary-600' },
  tips: { bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-600' },
  talk: { bg: 'bg-amber-600', text: 'text-white', border: 'border-amber-600' },
  activity: { bg: 'bg-violet-600', text: 'text-white', border: 'border-violet-600' },
};

const categoryNames: Record<ForumCategoryId, string> = {
  qa: 'AI 工具问答',
  tips: '使用心得',
  talk: '畅所欲言',
  activity: '活动公告',
};

interface PostDetailModalProps {
  post: ForumPost;
  onClose: () => void;
}

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
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatFullTime(dateString: string): string {
  return new Date(dateString).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function PostDetailModal({ post, onClose }: PostDetailModalProps) {
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [commentText, setCommentText] = useState('');

  // 缓存计算结果 (rerender-memo)
  const categoryStyle = useMemo(() => categoryColors[post.category], [post.category]);
  const categoryName = useMemo(() => categoryNames[post.category], [post.category]);
  const publishTime = useMemo(() => formatFullTime(post.createdAt), [post.createdAt]);

  // 使用 functional setState 保持回调稳定 (rerender-functional-setstate)
  const handleLike = useCallback(() => {
    setLiked(prev => !prev);
  }, []);

  const handleFavorite = useCallback(() => {
    setFavorited(prev => !prev);
  }, []);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
  }, []);

  const handleSubmitComment = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    // 这里可以添加提交评论的逻辑
    setCommentText('');
  }, [commentText]);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <div className="relative w-full max-w-3xl mx-4 my-8 sm:my-16 animate-slide-up">
        <div className="bg-white rounded-2xl shadow-floating overflow-hidden">
          {/* 顶部彩色条 */}
          <div className={`h-1.5 ${categoryStyle.bg}`} />

          {/* 头部 */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* 分类和标签 */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
                    {categoryName}
                  </span>
                  {post.isPinned && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-primary-100 text-primary-700">
                      <Pin className="w-3 h-3" />
                      置顶
                    </span>
                  )}
                  {post.isHot && (
                    <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-rose-100 text-rose-700">
                      <Flame className="w-3 h-3" />
                      热门
                    </span>
                  )}
                </div>

                {/* 标题 */}
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                  {post.title}
                </h2>

                {/* 作者信息 */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-slate-600">
                      {post.author.name.slice(0, 1)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{post.author.name}</div>
                    <div className="text-xs text-slate-500">
                      {post.author.department} · {publishTime}
                    </div>
                  </div>
                </div>
              </div>

              {/* 关闭按钮 */}
              <button
                onClick={onClose}
                className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="p-6">
            {/* 帖子正文 */}
            <div className="prose prose-slate max-w-none mb-6">
              {post.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-3 text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-slate-100 text-xs text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 统计数据 */}
            <div className="flex items-center gap-6 py-4 border-y border-slate-100 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {post.views} 阅读
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                {post.likes + (liked ? 1 : 0)} 点赞
              </span>
              <span className="flex items-center gap-1.5">
                <Bookmark className="w-4 h-4" />
                {post.favorites + (favorited ? 1 : 0)} 收藏
              </span>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-3 py-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  liked
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                {liked ? '已点赞' : '点赞'}
              </button>
              <button
                onClick={handleFavorite}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  favorited
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                {favorited ? '已收藏' : '收藏'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                分享
              </button>
            </div>
          </div>

          {/* 评论区 */}
          <div className="border-t border-slate-100">
            <div className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">
                评论 ({post.comments.length})
              </h3>

              {/* 评论输入框 */}
              <form onSubmit={handleSubmitComment} className="mb-6">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary-600">我</span>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="写下你的评论..."
                      className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>

              {/* 评论列表 */}
              <div className="space-y-4">
                {post.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-slate-600">
                        {comment.author.name.slice(0, 1)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-slate-900">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-slate-400">
                          {comment.author.department}
                        </span>
                        <span className="text-xs text-slate-400">
                          · {formatTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 mb-2">{comment.content}</p>
                      <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-rose-500 transition-colors">
                        <Heart className="w-3.5 h-3.5" />
                        {comment.likes}
                      </button>
                    </div>
                  </div>
                ))}

                {post.comments.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    暂无评论，来发表第一条评论吧
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
