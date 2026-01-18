import type { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export function CategoryFilter({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="relative mb-10">
      {/* Mobile: Horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 sm:overflow-visible sm:flex-wrap sm:justify-center scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      {/* Mobile scroll fade indicator */}
      <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none sm:hidden" />
    </div>
  );
}
