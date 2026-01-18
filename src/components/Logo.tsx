interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { box: 'w-8 h-8', text: 'text-xs', label: 'text-lg' },
  md: { box: 'w-10 h-10', text: 'text-sm', label: 'text-xl' },
  lg: { box: 'w-14 h-14', text: 'text-lg', label: 'text-2xl' },
};

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Mark - Geometric precision with nested squares */}
      <div className={`${config.box} relative group`}>
        {/* Outer square - Primary blue */}
        <div className="absolute inset-0 bg-primary-600 rounded-xl transition-transform group-hover:scale-105" />

        {/* Inner accent - Top right corner */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-400 rounded-tr-xl rounded-bl-lg" />

        {/* AI Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-white font-bold ${config.text} tracking-tight`}>
            AI
          </span>
        </div>
      </div>

      {/* Wordmark */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-serif ${config.label} text-slate-900 tracking-tight leading-none`}>
            HIIC AI Lab
          </span>
          {size === 'lg' && (
            <span className="text-xs text-slate-500 tracking-wide mt-0.5">
              Institutional Precision
            </span>
          )}
        </div>
      )}
    </div>
  );
}
