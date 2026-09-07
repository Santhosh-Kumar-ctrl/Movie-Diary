import { api } from './client';
import type { WatchlistEntry, WatchlistResponse } from '@/types/watchlist';

interface WatchlistFilters {
  status?: string;
  mediaType?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export async function getWatchlist(filters: WatchlistFilters = {}): Promise<WatchlistResponse> {
  const { data } = await api.get('/watchlist', { params: filters });
  return data.data;
}

export async function addToWatchlist(entry: {
  tmdb_id: number;
  media_type: string;
  status?: string;
  title: string;
  poster_path?: string | null;
  overview?: string | null;
  release_year?: number | null;
}): Promise<WatchlistEntry> {
  const { data } = await api.post('/watchlist', entry);
  return data.data;
}

export async function updateWatchlistStatus(entryId: string, status: string): Promise<WatchlistEntry> {
  const { data } = await api.patch(`/watchlist/${entryId}`, { status });
  return data.data;
}

export async function removeFromWatchlist(entryId: string): Promise<void> {
  await api.delete(`/watchlist/${entryId}`);
}

export async function checkWatchlistEntry(mediaType: string, tmdbId: number): Promise<WatchlistEntry | null> {
  const { data } = await api.get(`/watchlist/check/${mediaType}/${tmdbId}`);
  return data.data;
}
