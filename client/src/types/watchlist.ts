import type { WatchStatus, MediaType } from '@/lib/constants';

export interface WatchlistEntry {
  id: string;
  user_id: string;
  tmdb_id: number;
  media_type: MediaType;
  status: WatchStatus;
  title: string;
  poster_path: string | null;
  overview: string | null;
  release_year: number | null;
  added_at: string;
  updated_at: string;
}

export interface WatchlistResponse {
  entries: WatchlistEntry[];
  total: number;
  page: number;
  limit: number;
}
