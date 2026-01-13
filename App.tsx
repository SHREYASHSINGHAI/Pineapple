import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MediaRow from './components/MediaRow';
import DetailModal from './components/DetailModal';
import { getTrending, getPopularMovies, getPopularTV } from './services/tmdb';
import { MediaItem } from './types';

function App() {
  const [isDark, setIsDark] = useState(true);
  const [heroItem, setHeroItem] = useState<MediaItem | null>(null);
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [popularMovies, setPopularMovies] = useState<MediaItem[]>([]);
  const [popularTV, setPopularTV] = useState<MediaItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Initialize Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, moviesData, tvData] = await Promise.all([
          getTrending('day'),
          getPopularMovies(),
          getPopularTV()
        ]);

        setTrending(trendingData);
        setPopularMovies(moviesData);
        setPopularTV(tvData);

        // Set random hero from trending
        if (trendingData.length > 0) {
          const random = Math.floor(Math.random() * Math.min(5, trendingData.length));
          setHeroItem(trendingData[random]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      <Navbar 
        toggleTheme={toggleTheme} 
        isDark={isDark} 
        onSearchResultSelect={setSelectedItem}
      />

      <Hero 
        item={heroItem} 
        onPlay={(item) => setSelectedItem(item)}
        onMoreInfo={(item) => setSelectedItem(item)}
      />

      <div className="relative z-10 -mt-24 md:-mt-32 space-y-8 pb-12">
         {/* Rows contain their own internal padding/margins */}
         <div className="space-y-4">
             <MediaRow 
               title="Trending Now" 
               items={trending} 
               onItemClick={setSelectedItem} 
             />
             
             <MediaRow 
               title="Popular Movies" 
               items={popularMovies} 
               onItemClick={setSelectedItem} 
             />
             
             <MediaRow 
               title="Hit TV Shows" 
               items={popularTV} 
               onItemClick={setSelectedItem} 
             />
         </div>
      </div>

      <footer className="container mx-auto px-6 py-8 text-center border-t border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Pineapple Streaming. All rights reserved.
        </p>
        <p className="text-slate-400 dark:text-slate-600 text-xs mt-2">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </footer>

      {selectedItem && (
        <DetailModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}

export default App;