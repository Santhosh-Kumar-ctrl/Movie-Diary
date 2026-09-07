export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  credits?: {
    cast: TmdbCast[];
  };
  similar?: { results: TmdbSearchResult[] };
}

export interface TmdbTvShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  number_of_seasons: number;
  number_of_episodes: number;
  seasons?: TmdbSeason[];
  credits?: {
    cast: TmdbCast[];
  };
  similar?: { results: TmdbSearchResult[] };
}

export interface TmdbSeason {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  air_date: string | null;
  poster_path: string | null;
  episodes?: TmdbEpisode[];
}

export interface TmdbEpisode {
  id: number;
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  air_date: string | null;
  still_path: string | null;
  runtime: number | null;
}

export interface TmdbCast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TmdbSearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type?: 'movie' | 'tv';
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

export interface TmdbSearchResponse {
  page: number;
  results: TmdbSearchResult[];
  total_pages: number;
  total_results: number;
}
