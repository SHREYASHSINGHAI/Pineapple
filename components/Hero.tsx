import React from 'react';
import { TrendingUp, Globe, Clapperboard, Tv } from 'lucide-react';

interface HeroProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const Hero: React.FC<HeroProps> = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    { id: 'home', label: 'All', icon: TrendingUp },
    { id: 'hollywood', label: 'Hollywood', icon: Clapperboard },
    { id: 'bollywood', label: 'Bollywood', icon: Globe },
    { id: 'kdrama', label: 'K-Drama', icon: Tv },
    { id: 'anime', label: 'Anime', icon: Tv },
  ];

  return (
    <div className="w-full pt-28 pb-4 px-4 md:px-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 animate-fade-in">
       {/* Section Title */}
       <div className="flex items-center space-x-2 text-slate-900 dark:text-white group select-none transition-colors">
         <TrendingUp className="w-6 h-6 text-pineapple-500" />
         <h1 className="text-xl md:text-2xl font-bold">
            {activeCategory === 'home' ? 'Trending Now' : `${categories.find(c => c.id === activeCategory)?.label} Hits`}
         </h1>
       </div>

       {/* Category Chips */}
       <div className="flex flex-wrap gap-2">
         {categories.map((cat) => (
           <button
             key={cat.id}
             onClick={() => onCategoryChange(cat.id)}
             className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 transform active:scale-95 ${
               activeCategory === cat.id
                 ? 'bg-pineapple-500 text-white shadow-lg shadow-pineapple-500/30 ring-2 ring-pineapple-500 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950'
                 : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
             }`}
           >
             {activeCategory === cat.id && <cat.icon size={14} />}
             <span>{cat.label}</span>
           </button>
         ))}
       </div>
    </div>
  );
};

export default Hero;