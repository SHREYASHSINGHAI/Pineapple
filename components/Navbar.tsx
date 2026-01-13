import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, MonitorPlay } from 'lucide-react';
import { MediaItem } from '../types';
import { searchMedia } from '../services/tmdb';

interface NavbarProps {
  toggleTheme: () => void;
  isDark: boolean;
  onSearchResultSelect: (item: MediaItem) => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleTheme, isDark, onSearchResultSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setIsSearching(true);
        try {
            const data = await searchMedia(query);
            setResults(data.slice(0, 5));
        } catch(e) {
            console.error(e);
        } finally {
            setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <MonitorPlay className="text-pineapple-500 w-8 h-8 group-hover:rotate-12 transition-transform" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pineapple-500 to-pineapple-600 dark:from-pineapple-400 dark:to-pineapple-500">
            Pineapple
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative hidden md:block w-96 group">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search movies & TV..."
                    className="w-full bg-slate-200/50 dark:bg-slate-800/50 border border-transparent focus:border-pineapple-500 focus:bg-white dark:focus:bg-slate-900 rounded-full py-2 pl-10 pr-4 outline-none text-slate-800 dark:text-gray-200 transition-all shadow-sm focus:shadow-md"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4 group-focus-within:text-pineapple-500 transition-colors" />
                {isSearching && (
                    <div className="absolute right-3 top-2.5 w-4 h-4 border-2 border-pineapple-500 border-t-transparent rounded-full animate-spin"></div>
                )}
            </div>

            {/* Results Dropdown */}
            {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-fade-in">
                    {results.map(item => (
                        <div 
                            key={item.id}
                            onClick={() => {
                                onSearchResultSelect(item);
                                setQuery('');
                                setResults([]);
                            }}
                            className="flex items-center gap-3 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                        >
                            <div className="w-10 h-14 bg-slate-300 rounded overflow-hidden flex-shrink-0">
                                {item.poster_path ? (
                                    <img src={`https://image.tmdb.org/t/p/w92${item.poster_path}`} alt={item.title || item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-700" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.title || item.name}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {item.media_type.toUpperCase()} • {(item.release_date || item.first_air_date || '').split('-')[0]}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
             {/* Mobile Search Icon (Placeholder for now) */}
             <button className="md:hidden text-slate-600 dark:text-slate-300">
                <Search size={24} />
             </button>

            <button 
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-yellow-400 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle Theme"
            >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pineapple-400 to-pineapple-600 cursor-pointer shadow-lg shadow-pineapple-500/20"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;