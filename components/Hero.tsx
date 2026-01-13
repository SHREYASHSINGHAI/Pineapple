import React from 'react';
import { MediaItem } from '../types';
import { IMAGE_BASE_URL_HD } from '../constants';
import { Play, Info } from 'lucide-react';

interface HeroProps {
  item: MediaItem | null;
  onPlay: (item: MediaItem) => void;
  onMoreInfo: (item: MediaItem) => void;
}

const Hero: React.FC<HeroProps> = ({ item, onPlay, onMoreInfo }) => {
  if (!item) return <div className="h-[60vh] w-full bg-slate-900 animate-pulse" />;

  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {item.backdrop_path ? (
          <img
            src={`${IMAGE_BASE_URL_HD}${item.backdrop_path}`}
            alt={title}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <span className="text-slate-500">No Image Available</span>
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent dark:from-slate-950 dark:via-slate-950/40 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/80 via-transparent to-transparent dark:from-slate-950/90 dark:via-transparent dark:to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col justify-end items-start z-10 space-y-4 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white drop-shadow-md animate-slide-up">
          {title}
        </h1>
        <div className="flex items-center space-x-4 text-sm md:text-base font-medium text-slate-700 dark:text-gray-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <span className="px-2 py-1 bg-pineapple-500 text-white rounded text-xs font-bold uppercase">
                {item.media_type}
            </span>
            <span>{year}</span>
            <span className="flex items-center">
                <svg className="w-4 h-4 text-pineapple-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {item.vote_average?.toFixed(1)}
            </span>
        </div>
        <p className="text-slate-600 dark:text-gray-300 line-clamp-3 md:line-clamp-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {item.overview}
        </p>

        <div className="flex space-x-4 pt-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => onPlay(item)}
            className="flex items-center space-x-2 bg-pineapple-500 hover:bg-pineapple-600 text-white px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 active:scale-95 shadow-lg shadow-pineapple-500/30"
          >
            <Play size={20} fill="currentColor" />
            <span>Watch Now</span>
          </button>
          <button
            onClick={() => onMoreInfo(item)}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 dark:bg-slate-800/60 dark:hover:bg-slate-700/60 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-full font-semibold transition-transform transform hover:scale-105 active:scale-95"
          >
            <Info size={20} />
            <span>More Info</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
