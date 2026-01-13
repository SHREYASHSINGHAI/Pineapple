import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MediaItem, MediaDetails, Season, Episode } from '../types';
import { getMediaDetails, getSeasonDetails } from '../services/tmdb';
import { IMAGE_BASE_URL_HD, VIDROCK_MOVIE_EMBED, VIDROCK_TV_EMBED } from '../constants';
import { X, Play, Calendar, Clock, Star, Users, Maximize, Minimize, ArrowLeft } from 'lucide-react';

interface DetailModalProps {
  item: MediaItem;
  onClose: () => void;
  initialPlay?: boolean;
}

const DetailModal: React.FC<DetailModalProps> = ({ item, onClose, initialPlay = false }) => {
  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [isPlaying, setIsPlaying] = useState(initialPlay);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Handle Fullscreen toggle
  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error(`Error attempting to exit full-screen mode: ${err.message} (${err.name})`);
     });
    }
  }, []);

  // Sync fullscreen state with browser events (e.g. Esc key)
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  // Keyboard shortcut 'F'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the key is F and we are playing
      if (isPlaying && (e.key === 'f' || e.key === 'F')) {
        // Prevent default only if we're consuming the event
        e.preventDefault();
        toggleFullScreen();
      }
    };
    // Use capture phase to try and catch events before they disappear into iframes if possible
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, toggleFullScreen]);

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMediaDetails(item.media_type, item.id);
      setDetails(data);
      if (item.media_type === 'tv') {
        // Fetch season 1 by default
        await fetchSeason(item.id, 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [item]);

  const fetchSeason = async (tvId: number, seasonNum: number) => {
    try {
      setSeasonLoading(true);
      const data = await getSeasonDetails(tvId, seasonNum);
      setEpisodes(data.episodes);
      setSelectedSeason(seasonNum);
    } catch (error) {
      console.error(error);
    } finally {
      setSeasonLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const getEmbedUrl = () => {
    if (item.media_type === 'movie') {
      return `${VIDROCK_MOVIE_EMBED}/${item.id}`;
    }
    return `${VIDROCK_TV_EMBED}/${item.id}/${selectedSeason}/${selectedEpisode}`;
  };

  const renderContent = () => {
    if (loading || !details) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pineapple-500"></div>
        </div>
      );
    }

    const title = details.title || details.name;
    const year = new Date(details.release_date || details.first_air_date || Date.now()).getFullYear();
    const runtime = details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : null;

    if (isPlaying) {
      return (
        <div 
            ref={playerContainerRef}
            className={`w-full bg-black relative shadow-2xl animate-fade-in ${isFullScreen ? 'h-screen w-screen' : 'aspect-video rounded-lg overflow-hidden'}`}
        >
          <iframe
            src={getEmbedUrl()}
            className="w-full h-full"
            allowFullScreen
            title={title}
            scrolling="no"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="origin"
            style={{ border: 0 }}
          ></iframe>
           
           <div className="absolute top-4 right-4 flex gap-3 z-50">
                <button
                    onClick={toggleFullScreen}
                    className="bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-colors group"
                    title="Toggle Fullscreen (F)"
                >
                    {isFullScreen ? (
                        <Minimize size={20} className="group-hover:scale-110 transition-transform" />
                    ) : (
                        <Maximize size={20} className="group-hover:scale-110 transition-transform" />
                    )}
                </button>
                
                <button 
                    onClick={() => {
                        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
                        setIsPlaying(false);
                    }}
                    className="bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-sm transition-colors group"
                    title="Back to Details"
                >
                    <ArrowLeft size={20} className="group-hover:scale-110 transition-transform" />
                </button>
           </div>
        </div>
      );
    }

    return (
      <div className="relative animate-fade-in">
        {/* Backdrop Banner */}
        <div className="relative h-64 md:h-96 w-full rounded-t-2xl overflow-hidden">
             {details.backdrop_path ? (
               <img 
                 src={`${IMAGE_BASE_URL_HD}${details.backdrop_path}`} 
                 alt={title}
                 className="w-full h-full object-cover"
               />
             ) : (
                <div className="w-full h-full bg-slate-800" />
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/20 to-transparent dark:from-slate-900 dark:via-slate-900/40 dark:to-transparent" />
             
             <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-md transition-colors"
             >
                 <X size={24} />
             </button>
        </div>

        <div className="px-6 md:px-12 -mt-20 md:-mt-32 relative z-10 flex flex-col md:flex-row gap-8 pb-12">
            {/* Poster */}
            <div className="flex-shrink-0 w-32 md:w-64 rounded-xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <img 
                    src={details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : 'https://via.placeholder.com/500x750'} 
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Info */}
            <div className="flex-1 text-slate-800 dark:text-gray-100 mt-4 md:mt-12">
                <h2 className="text-3xl md:text-5xl font-bold mb-2">{title}</h2>
                
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-slate-600 dark:text-slate-300 mb-6">
                    <span className="flex items-center"><Star size={16} className="text-pineapple-500 mr-1" fill="currentColor" /> {details.vote_average.toFixed(1)}</span>
                    <span className="flex items-center"><Calendar size={16} className="mr-1" /> {year}</span>
                    {runtime && <span className="flex items-center"><Clock size={16} className="mr-1" /> {runtime}</span>}
                    {details.number_of_seasons && <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-xs font-semibold">{details.number_of_seasons} Seasons</span>}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {details.genres?.map(g => (
                        <span key={g.id} className="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded-full text-xs font-medium">
                            {g.name}
                        </span>
                    ))}
                </div>

                <p className="text-lg leading-relaxed mb-8 text-slate-700 dark:text-slate-300 max-w-3xl">
                    {details.overview}
                </p>

                <div className="flex gap-4">
                     <button 
                        onClick={handlePlay}
                        className="flex items-center gap-2 bg-pineapple-500 hover:bg-pineapple-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-pineapple-500/20 transition-all hover:scale-105 active:scale-95"
                     >
                        <Play fill="currentColor" /> Play
                     </button>
                </div>

                {/* TV Show Episode Selector */}
                {item.media_type === 'tv' && details.seasons && (
                    <div className="mt-12 p-6 bg-slate-100 dark:bg-slate-800/50 rounded-xl">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                             <Users size={20} className="text-pineapple-500"/> Episodes
                        </h3>
                        
                        {/* Season Tabs */}
                        <div className="flex overflow-x-auto gap-2 pb-4 mb-4 hide-scrollbar">
                            {details.seasons.filter(s => s.season_number > 0).map(season => (
                                <button
                                    key={season.id}
                                    onClick={() => fetchSeason(item.id, season.season_number)}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                                        selectedSeason === season.season_number 
                                        ? 'bg-pineapple-500 text-white shadow-md' 
                                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                    }`}
                                >
                                    Season {season.season_number}
                                </button>
                            ))}
                        </div>

                        {/* Episodes Grid */}
                        {seasonLoading ? (
                             <div className="py-8 text-center text-slate-500">Loading episodes...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                                {episodes.map(ep => (
                                    <button
                                        key={ep.id}
                                        onClick={() => {
                                            setSelectedEpisode(ep.episode_number);
                                            setIsPlaying(true);
                                        }}
                                        className={`flex items-start gap-3 p-3 rounded-lg text-left transition-all hover:bg-white dark:hover:bg-slate-700 ${
                                            selectedEpisode === ep.episode_number && isPlaying && false 
                                            ? 'ring-2 ring-pineapple-500'
                                            : ''
                                        }`}
                                    >
                                        <div className="w-8 h-8 flex-shrink-0 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center text-xs font-bold">
                                            {ep.episode_number}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold line-clamp-1">{ep.name}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{ep.overview || "No description available."}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full h-full md:max-h-[90vh] md:max-w-6xl bg-slate-50 dark:bg-slate-900 rounded-none md:rounded-2xl overflow-y-auto hide-scrollbar shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default DetailModal;