import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MediaRow from './components/MediaRow';
import DetailModal from './components/DetailModal';
import { getTrending, getPopularMovies, getPopularTV, getDiscoverContent } from './services/tmdb';
import { MediaItem } from './types';

function App() {
  const [isDark, setIsDark] = useState(true);
  const [activeCategory, setActiveCategory] = useState('home');
  const [rows, setRows] = useState<{ id: string; title: string; items: MediaItem[] }[]>([]);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [playOnOpen, setPlayOnOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize Theme
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Fetch Data based on Category
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setRows([]); // Clear rows to show transition
      try {
        let newRows: { id: string; title: string; items: MediaItem[] }[] = [];

        if (activeCategory === 'home') {
          const [trending, movies, tv] = await Promise.all([
            getTrending('day'),
            getPopularMovies(),
            getPopularTV()
          ]);
          newRows = [
            { id: 'trending', title: 'Top Rated Today', items: trending },
            { id: 'movies', title: 'Popular Movies', items: movies },
            { id: 'tv', title: 'Hit TV Shows', items: tv }
          ];
        } else if (activeCategory === 'hollywood') {
          // Hollywood: Split by Genres and TV
          const [action, comedy, scifi, horror, tv] = await Promise.all([
            getDiscoverContent('movie', 'en', 28),   // Action
            getDiscoverContent('movie', 'en', 35),   // Comedy
            getDiscoverContent('movie', 'en', 878),  // Sci-Fi
            getDiscoverContent('movie', 'en', 27),   // Horror
            getDiscoverContent('tv', 'en')           // US TV
          ]);
          newRows = [
            { id: 'hw-action', title: 'Adrenaline Rush (Action)', items: action },
            { id: 'hw-tv', title: 'Trending US Series', items: tv },
            { id: 'hw-scifi', title: 'Sci-Fi & Fantasy', items: scifi },
            { id: 'hw-comedy', title: 'Comedy Hits', items: comedy },
            { id: 'hw-horror', title: 'Late Night Horror', items: horror },
          ];
        } else if (activeCategory === 'bollywood') {
          // Bollywood: Movies (General, Action, Romance, Horror, Comedy) + Series
          const [popular, romance, action, series, horror, comedy] = await Promise.all([
            getDiscoverContent('movie', 'hi'),        // General Popular
            getDiscoverContent('movie', 'hi', 10749), // Romance
            getDiscoverContent('movie', 'hi', 28),    // Action
            getDiscoverContent('tv', 'hi'),           // Hindi Series
            getDiscoverContent('movie', 'hi', 27),    // Horror
            getDiscoverContent('movie', 'hi', 35)     // Comedy
          ]);
          newRows = [
            { id: 'bw-popular', title: 'Bollywood Blockbusters', items: popular },
            { id: 'bw-series', title: 'Indian Web Series & TV', items: series },
            { id: 'bw-romance', title: 'Romantic Favorites', items: romance },
            { id: 'bw-horror', title: 'Hindi Horror', items: horror },
            { id: 'bw-action', title: 'Hindi Action', items: action },
            { id: 'bw-comedy', title: 'Laugh Out Loud (Comedy)', items: comedy },
          ];
        } else if (activeCategory === 'kdrama') {
          // K-Drama: Series (General, Romance, Action, Comedy, Fantasy) + Movies
          const [popularTv, romanceTv, actionTv, comedyTv, fantasyTv, movies] = await Promise.all([
            getDiscoverContent('tv', 'ko'),           // K-Drama General
            getDiscoverContent('tv', 'ko', 10749),    // K-Drama Romance
            getDiscoverContent('tv', 'ko', 10759),    // K-Drama Action & Adventure
            getDiscoverContent('tv', 'ko', 35),       // K-Drama Comedy
            getDiscoverContent('tv', 'ko', 10765),    // K-Drama Sci-Fi & Fantasy
            getDiscoverContent('movie', 'ko')         // Korean Movies
          ]);
          newRows = [
            { id: 'k-drama', title: 'Trending K-Dramas', items: popularTv },
            { id: 'k-romance', title: 'Romantic K-Dramas', items: romanceTv },
            { id: 'k-action', title: 'Action & Adventure', items: actionTv },
            { id: 'k-fantasy', title: 'Sci-Fi & Fantasy', items: fantasyTv },
            { id: 'k-comedy', title: 'Comedy Hits', items: comedyTv },
            { id: 'k-movies', title: 'Korean Cinema', items: movies },
          ];
        } else if (activeCategory === 'anime') {
          // Anime: Series + Movies
          const [series, movies] = await Promise.all([
            getDiscoverContent('tv', 'ja', 16),    // Anime Series
            getDiscoverContent('movie', 'ja', 16)  // Anime Movies
          ]);
          newRows = [
            { id: 'anime-series', title: 'Trending Anime Series', items: series },
            { id: 'anime-movies', title: 'Anime Movies', items: movies },
          ];
        }

        setRows(newRows);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCategory]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleOpenDetail = (item: MediaItem, shouldPlay: boolean = false) => {
    setSelectedItem(item);
    setPlayOnOpen(shouldPlay);
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      <Navbar 
        toggleTheme={toggleTheme} 
        isDark={isDark} 
        onSearchResultSelect={(item) => handleOpenDetail(item, false)}
      />

      <Hero 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <div className="relative z-10 space-y-8 pb-12 min-h-[50vh]">
         {loading ? (
             <div className="flex justify-center pt-20">
                 <div className="w-10 h-10 border-4 border-pineapple-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
         ) : (
             <div className="space-y-4 animate-slide-up">
                 {rows.map((row) => (
                    <MediaRow 
                        key={row.id}
                        title={row.title} 
                        items={row.items} 
                        onItemClick={(item) => handleOpenDetail(item, false)} 
                    />
                 ))}
                 {rows.length === 0 && !loading && (
                     <div className="text-center text-slate-500 pt-20">No content found for this category.</div>
                 )}
             </div>
         )}
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
          initialPlay={playOnOpen}
        />
      )}
    </div>
  );
}

export default App;