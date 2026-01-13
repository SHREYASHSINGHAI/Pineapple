import { TMDB_API_KEY, TMDB_BASE_URL } from '../constants';
import { MediaItem, MediaDetails, SearchResponse, Season, Episode } from '../types';

const fetchFromTMDB = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'en-US',
    ...params,
  });

  const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${queryParams}`);
  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.statusText}`);
  }
  return response.json();
};

export const getTrending = async (timeWindow: 'day' | 'week' = 'day'): Promise<MediaItem[]> => {
  const data = await fetchFromTMDB<SearchResponse>(`/trending/all/${timeWindow}`);
  return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
};

export const getPopularMovies = async (): Promise<MediaItem[]> => {
  const data = await fetchFromTMDB<SearchResponse>('/movie/popular');
  return data.results.map(item => ({ ...item, media_type: 'movie' }));
};

export const getPopularTV = async (): Promise<MediaItem[]> => {
  const data = await fetchFromTMDB<SearchResponse>('/tv/popular');
  return data.results.map(item => ({ ...item, media_type: 'tv' }));
};

export const searchMedia = async (query: string): Promise<MediaItem[]> => {
  if (!query) return [];
  const data = await fetchFromTMDB<SearchResponse>('/search/multi', { query });
  return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
};

export const getMediaDetails = async (type: 'movie' | 'tv', id: number): Promise<MediaDetails> => {
  const data = await fetchFromTMDB<MediaDetails>(`/${type}/${id}`, {
    append_to_response: 'credits',
  });
  return { ...data, media_type: type };
};

export const getSeasonDetails = async (tvId: number, seasonNumber: number): Promise<{ episodes: Episode[] }> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await fetchFromTMDB<any>(`/tv/${tvId}/season/${seasonNumber}`);
  return { episodes: data.episodes };
};

export const getDiscoverContent = async (
  type: 'movie' | 'tv',
  language?: string,
  genreId?: number
): Promise<MediaItem[]> => {
  const params: Record<string, string> = {
    sort_by: 'popularity.desc',
    include_adult: 'false',
    'vote_count.gte': '10',
  };
  
  if (language) params.with_original_language = language;
  if (genreId) params.with_genres = genreId.toString();

  const data = await fetchFromTMDB<SearchResponse>(`/discover/${type}`, params);
  return data.results.map(item => ({ ...item, media_type: type }));
};
