import { Mail, Github, User } from 'lucide-react';
import type { Developer } from '../types';

interface DeveloperSectionProps {
  developer: Developer;
}

export function DeveloperSection({ developer }: DeveloperSectionProps) {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 mb-4">
            关于 HIIC AI Lab
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            深圳国家高技术产业创新中心 AI 实验室
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center mb-4">
              <span className="text-white text-lg font-bold">V</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">愿景</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              成为政府智库领域最具影响力的 AI 应用创新平台，引领智能化办公新范式。
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center mb-4">
              <span className="text-white text-lg font-bold">M</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">使命</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              用 AI 技术赋能每一位同事，让复杂工作变简单，让重复劳动自动化，释放创造力。
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-4">
              <span className="text-white text-lg font-bold">P</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">理念</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              简约而不简单，专业而不复杂。每一款工具都追求极致的用户体验与实用价值。
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-slate-900 rounded-2xl p-8 sm:p-12 mb-16">
          <h3 className="text-xl font-bold text-white mb-6 text-center">核心价值观</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: '用户至上', desc: '一切以用户需求为中心' },
              { label: '持续创新', desc: '拥抱变化，追求卓越' },
              { label: '开放协作', desc: '共享知识，共同成长' },
              { label: '务实落地', desc: '解决真问题，创造真价值' },
            ].map((value, idx) => (
              <div key={idx} className="text-center p-4">
                <div className="text-2xl font-bold text-primary-400 mb-2">{value.label}</div>
                <p className="text-slate-400 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Developer Card */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-primary-600 flex items-center justify-center">
                  {developer.avatar ? (
                    <img
                      src={developer.avatar}
                      alt={developer.name}
                      className="w-full h-full rounded-2xl object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  开发者
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                  {developer.name}
                </h3>
                <p className="text-primary-600 font-medium mb-1">
                  {developer.title}
                </p>
                <p className="text-slate-500 text-sm mb-4">
                  {developer.organization}
                </p>
                <blockquote className="text-slate-600 italic border-l-4 border-primary-200 pl-4 mb-6">
                  "{developer.slogan}"
                </blockquote>

                {/* Contact Buttons */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  <a
                    href={`mailto:${developer.email}`}
                    className="btn-primary"
                  >
                    <Mail className="w-4 h-4" />
                    联系我
                  </a>
                  {developer.github && (
                    <a
                      href={developer.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
