import { useState, useEffect } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';
import type { App } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  apps: App[];
  preselectedAppId?: string;
}

export function FeedbackModal({ isOpen, onClose, apps, preselectedAppId }: FeedbackModalProps) {
  const [formData, setFormData] = useState({
    type: 'suggestion' as 'suggestion' | 'bug' | 'question' | 'other',
    appId: preselectedAppId || '',
    content: '',
    contact: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (preselectedAppId) {
      setFormData(prev => ({ ...prev, appId: preselectedAppId }));
    }
  }, [preselectedAppId]);

  const feedbackTypes = [
    { value: 'suggestion', label: '功能建议' },
    { value: 'bug', label: 'Bug 反馈' },
    { value: 'question', label: '使用咨询' },
    { value: 'other', label: '其他' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setFormData({ type: 'suggestion', appId: '', content: '', contact: '' });
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-floating opacity-0 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="font-serif text-xl text-slate-900">反馈建议</h3>
            <p className="text-sm text-slate-500 mt-1">你的反馈将帮助我们做得更好</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">感谢你的反馈！</h4>
              <p className="text-slate-500">我们会认真阅读并尽快改进</p>
            </div>
          ) : (
            <>
              {/* Feedback Type */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  反馈类型
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {feedbackTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value as typeof formData.type })}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        formData.type === type.value
                          ? 'bg-primary-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Related App */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  相关应用（可选）
                </label>
                <select
                  value={formData.appId}
                  onChange={(e) => setFormData({ ...formData, appId: e.target.value })}
                  className="input"
                >
                  <option value="">请选择应用</option>
                  {apps.filter(app => app.status === 'online').map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  反馈内容 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="请详细描述你的建议或问题..."
                  rows={4}
                  className="input resize-none"
                  required
                />
              </div>

              {/* Contact */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  联系方式（可选）
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="邮箱或企业微信，方便我们回复你"
                  className="input"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.content.trim()}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    提交反馈
                  </>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
