import { useState, useCallback } from 'react';
import { X, Send, HelpCircle, Lightbulb, MessageSquare, Megaphone, EyeOff } from 'lucide-react';
import type { ForumCategoryId } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useCreatePost } from '../hooks';

// 静态配置 (rendering-hoist-jsx)
const categoryOptions: { id: ForumCategoryId; name: string; icon: typeof HelpCircle; color: string }[] = [
  { id: 'qa', name: 'AI 工具问答', icon: HelpCircle, color: 'bg-primary-600' },
  { id: 'tips', name: '使用心得', icon: Lightbulb, color: 'bg-emerald-600' },
  { id: 'talk', name: '畅所欲言', icon: MessageSquare, color: 'bg-amber-600' },
  { id: 'activity', name: '活动公告', icon: Megaphone, color: 'bg-violet-600' },
];

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: ForumCategoryId;
}

export function CreatePostModal({ isOpen, onClose, defaultCategory }: CreatePostModalProps) {
  const { profile } = useAuth();
  const createPost = useCreatePost();

  const [category, setCategory] = useState<ForumCategoryId>(defaultCategory || 'talk');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      return;
    }

    setErrorMessage('');

    // 解析标签
    const tags = tagsInput
      .split(/[,，\s]+/)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    try {
      await createPost.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        category,
        is_anonymous: isAnonymous,
        tags: tags.length > 0 ? tags : undefined,
      });

      setShowSuccess(true);

      // 2秒后关闭
      setTimeout(() => {
        setShowSuccess(false);
        setTitle('');
        setContent('');
        setTagsInput('');
        setIsAnonymous(false);
        onClose();
      }, 2000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '发布失败，请重试');
    }
  }, [title, content, category, isAnonymous, tagsInput, createPost, onClose]);

  const handleClose = useCallback(() => {
    if (createPost.isPending) return;
    setTitle('');
    setContent('');
    setTagsInput('');
    setIsAnonymous(false);
    setShowSuccess(false);
    setErrorMessage('');
    onClose();
  }, [createPost.isPending, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto">
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* 弹窗内容 */}
      <div className="relative w-full max-w-2xl mx-4 my-8 sm:my-16 animate-slide-up">
        <div className="bg-white rounded-2xl shadow-floating overflow-hidden">
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">发布新帖</h2>
            <button
              onClick={handleClose}
              disabled={createPost.isPending}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {showSuccess ? (
            // 成功提示
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">发布成功</h3>
              <p className="text-slate-500">你的帖子已发布，即将返回列表...</p>
            </div>
          ) : (
            // 表单
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5">
                {/* 选择板块 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    选择板块
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {categoryOptions.map(cat => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                            isSelected
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-lg ${cat.color} flex items-center justify-center`}>
                            <Icon className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="truncate">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 发布者信息 */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-700">
                        {isAnonymous ? '匿' : (profile?.name?.slice(0, 1) || '用')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {isAnonymous ? '匿名用户' : (profile?.name || '用户')}
                      </div>
                      <div className="text-xs text-slate-500">
                        {isAnonymous ? '其他人不会看到你的身份' : (profile?.department || '')}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isAnonymous
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <EyeOff className="w-4 h-4" />
                    {isAnonymous ? '已匿名' : '匿名发布'}
                  </button>
                </div>

                {/* 标题 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    帖子标题
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="请输入标题，简洁明了地描述你要说的内容"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                    maxLength={100}
                    required
                  />
                  <div className="text-right text-xs text-slate-400 mt-1">
                    {title.length}/100
                  </div>
                </div>

                {/* 内容 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    帖子内容
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="详细描述你的问题、建议或分享的内容..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all resize-none"
                    required
                  />
                  <div className="text-right text-xs text-slate-400 mt-1">
                    {content.length} 字
                  </div>
                </div>

                {/* 标签 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    标签 <span className="text-slate-400 font-normal">(可选，用逗号或空格分隔)</span>
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="例如：ChatGPT, 提示词, 效率"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>

                {/* 错误提示 */}
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                    <p className="text-sm text-rose-700">{errorMessage}</p>
                  </div>
                )}
              </div>

              {/* 底部 */}
              <div className="flex items-center justify-between p-6 bg-slate-50 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  发布后可在帖子详情中编辑或删除
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={createPost.isPending}
                    className="btn-secondary"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={createPost.isPending || !title.trim() || !content.trim()}
                    className="btn-primary"
                  >
                    {createPost.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        发布中...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        发布帖子
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
