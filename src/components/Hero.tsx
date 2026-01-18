import { Layers, Activity, Users } from 'lucide-react';

interface HeroProps {
  totalApps: number;
  totalVisits: number;
}

export function Hero({ totalApps, totalVisits }: HeroProps) {
  const stats = [
    { icon: Layers, value: totalApps, label: '款应用', bg: 'bg-primary-50', iconBg: 'bg-primary-600' },
    { icon: Activity, value: `${totalVisits}+`, label: '次使用', bg: 'bg-violet-50', iconBg: 'bg-violet-600' },
    { icon: Users, value: '100+', label: '同事受益', bg: 'bg-emerald-50', iconBg: 'bg-emerald-600' },
  ];

  return (
    <section className="relative pt-12 sm:pt-20 pb-20 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content */}
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full mb-8 opacity-0 animate-fade-in">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-sm font-medium text-slate-600">HIIC 内部专属</span>
          </div>

          {/* Title - Using Instrument Serif */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-slate-900 mb-6 opacity-0 animate-slide-up">
            探索 <span className="text-primary-600">AI</span> 的无限可能
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-12 opacity-0 animate-slide-up delay-100">
            深圳国家高技术产业创新中心 AI 工具集
            <br className="hidden sm:block" />
            助力高效工作，释放创造潜能
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 opacity-0 animate-slide-up delay-200">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 px-6 py-4 ${stat.bg} rounded-2xl border border-white/50`}
              >
                <div className={`icon-box icon-box-md ${stat.iconBg}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
