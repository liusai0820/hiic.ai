import { useState, useCallback } from 'react';
import { X, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = 'input' | 'sending' | 'sent' | 'error';

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const { signInWithEmail, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('input');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('请输入有效的邮箱地址');
      setStep('error');
      return;
    }

    setStep('sending');

    const { error } = await signInWithEmail(email);

    if (error) {
      setErrorMessage(error.message);
      setStep('error');
      return;
    }

    // 开发模式下直接成功
    if (!isConfigured) {
      onSuccess?.();
      onClose();
      return;
    }

    setStep('sent');
  }, [email, signInWithEmail, isConfigured, onSuccess, onClose]);

  const handleClose = useCallback(() => {
    if (step === 'sending') return;
    setEmail('');
    setStep('input');
    setErrorMessage('');
    onClose();
  }, [step, onClose]);

  const handleRetry = useCallback(() => {
    setStep('input');
    setErrorMessage('');
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* 弹窗内容 */}
      <div className="relative w-full max-w-md mx-4 animate-scale-in">
        <div className="bg-white rounded-2xl shadow-floating overflow-hidden">
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">登录社区</h2>
            <button
              onClick={handleClose}
              disabled={step === 'sending'}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="p-6">
            {step === 'input' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-slate-600 mb-6">
                  使用工作邮箱登录，我们会向你发送一封包含登录链接的邮件。
                </p>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    工作邮箱
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.name@hiic.org.cn"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                {!isConfigured && (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="text-xs text-amber-700">
                      开发模式：点击登录将使用测试账号
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!email.trim()}
                  className="btn-primary w-full justify-center py-3"
                >
                  <Send className="w-4 h-4" />
                  {isConfigured ? '发送登录链接' : '使用测试账号登录'}
                </button>
              </form>
            )}

            {step === 'sending' && (
              <div className="py-8 text-center">
                <div className="w-12 h-12 border-3 border-slate-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600">正在发送登录链接...</p>
              </div>
            )}

            {step === 'sent' && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">邮件已发送</h3>
                <p className="text-sm text-slate-600 mb-4">
                  登录链接已发送至 <span className="font-medium text-slate-900">{email}</span>
                </p>
                <p className="text-xs text-slate-500">
                  请检查你的收件箱，点击邮件中的链接完成登录。
                  <br />
                  如果没有收到，请检查垃圾邮件文件夹。
                </p>
                <button
                  onClick={handleClose}
                  className="btn-secondary mt-6"
                >
                  关闭
                </button>
              </div>
            )}

            {step === 'error' && (
              <div className="py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">发送失败</h3>
                <p className="text-sm text-slate-600 mb-6">{errorMessage}</p>
                <button
                  onClick={handleRetry}
                  className="btn-primary"
                >
                  重试
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
