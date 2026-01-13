export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  media_type: 'movie';
  genre_ids: number[];
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  media_type: 'tv';
  genre_ids: number[];
}

export interface MediaItem {
  id: number;
  title?: string; // For movies
  name?: string; // For TV
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  media_type: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
}

export interface MediaDetails extends MediaItem {
  genres: { id: number; name: string }[];
  runtime?: number; // Movies
  number_of_seasons?: number; // TV
  number_of_episodes?: number; // TV
  seasons?: Season[];
  credits?: {
    cast: Cast[];
    crew: Crew[];
  };
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date: string;
  poster_path: string | null;
}

export interface Episode {
  id: number;
  name: string;
  episode_number: number;
  season_number: number;
  overview: string;
  still_path: string | null;
  air_date: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
}

export interface SearchResponse {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}
