import React from 'react';
import { MediaItem } from '../types';
import { IMAGE_BASE_URL } from '../constants';
import { Star } from 'lucide-react';

interface MediaCardProps {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, onClick }) => {
  const title = item.title || item.name;
  const year = (item.release_date || item.first_air_date || '').split('-')[0];

  return (
    <div
      onClick={() => onClick(item)}
      className="group relative flex-shrink-0 w-36 md:w-48 cursor-pointer transition-all duration-300 hover:z-10"
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl dark:group-hover:shadow-pineapple-900/20">
        {item.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}${item.poster_path}`}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full p-4 text-center text-xs text-slate-500 dark:text-slate-400">
            {title}
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
             <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                 <button className="bg-pineapple-500 text-white rounded-full p-2 mb-2 w-10 h-10 flex items-center justify-center shadow-lg">
                     <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                 </button>
             </div>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-1.5 py-0.5 rounded flex items-center">
            <Star size={10} className="text-pineapple-400 mr-1" fill="currentColor" />
            {item.vote_average.toFixed(1)}
        </div>
      </div>

      <div className="mt-2 px-1">
        <h3 className="text-slate-900 dark:text-white font-semibold text-sm truncate group-hover:text-pineapple-600 dark:group-hover:text-pineapple-400 transition-colors">
          {title}
        </h3>
        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          <span>{year}</span>
          <span className="uppercase border border-slate-300 dark:border-slate-700 px-1 rounded-[2px] text-[10px]">
            {item.media_type}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
