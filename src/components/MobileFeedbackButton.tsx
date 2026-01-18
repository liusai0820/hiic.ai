import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

interface MobileFeedbackButtonProps {
  onClick: () => void;
}

export function MobileFeedbackButton({ onClick }: MobileFeedbackButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      setIsVisible(window.scrollY > 300);

      // Check if near bottom of page (within 200px of footer)
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;
      setIsAtBottom(scrolledToBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only show on mobile (md breakpoint handles hiding via CSS)
  return (
    <button
      onClick={onClick}
      className={`md:hidden fixed z-40 flex items-center justify-center transition-all duration-300 ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      } ${
        isAtBottom
          ? 'bottom-24 right-4'
          : 'bottom-6 right-4'
      }`}
      aria-label="反馈建议"
    >
      <div className="w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-600/30 hover:bg-primary-700 hover:scale-105 active:scale-95 transition-all">
        <MessageSquare className="w-5 h-5" />
      </div>
    </button>
  );
}
