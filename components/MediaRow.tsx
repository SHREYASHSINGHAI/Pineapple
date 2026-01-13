import React, { useRef } from 'react';
import { MediaItem } from '../types';
import MediaCard from './MediaCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaRowProps {
  title: string;
  items: MediaItem[];
  onItemClick: (item: MediaItem) => void;
}

const MediaRow: React.FC<MediaRowProps> = ({ title, items, onItemClick }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { current } = rowRef;
      const scrollAmount = direction === 'left' ? -current.offsetWidth * 0.75 : current.offsetWidth * 0.75;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="py-6 animate-fade-in">
      <div className="flex justify-between items-end px-4 md:px-12 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white flex items-center">
          <span className="w-1.5 h-6 bg-pineapple-500 rounded-full mr-3"></span>
          {title}
        </h2>
        <div className="flex space-x-2">
            <button onClick={() => scroll('left')} className="p-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-pineapple-500 hover:text-white dark:hover:bg-pineapple-500 transition-colors">
                <ChevronLeft size={20} />
            </button>
             <button onClick={() => scroll('right')} className="p-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-pineapple-500 hover:text-white dark:hover:bg-pineapple-500 transition-colors">
                <ChevronRight size={20} />
            </button>
        </div>
      </div>
      
      <div 
        ref={rowRef}
        className="flex space-x-4 overflow-x-auto px-4 md:px-12 pb-4 hide-scrollbar snap-x snap-mandatory"
      >
        {items.map((item) => (
          <div key={`${item.media_type}-${item.id}`} className="snap-start">
             <MediaCard item={item} onClick={onItemClick} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaRow;
