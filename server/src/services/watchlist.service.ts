import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../utils/AppError.js';

interface WatchlistFilters {
  status?: string;
  mediaType?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}

interface AddEntryData {
  tmdb_id: number;
  media_type: 'movie' | 'tv';
  status: string;
  title: string;
  poster_path?: string | null;
  overview?: string | null;
  release_year?: number | null;
}

export async function getUserWatchlist(supabase: SupabaseClient, userId: string, filters: WatchlistFilters) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;
  const sort = filters.sort || 'added_at';
  const order = filters.order === 'asc';

  let query = supabase
    .from('watchlist_entries')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order(sort, { ascending: order })
    .range(offset, offset + limit - 1);

  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.mediaType) {
    query = query.eq('media_type', filters.mediaType);
  }

  const { data, error, count } = await query;
  if (error) throw new AppError(error.message, 500);

  return { entries: data, total: count || 0, page, limit };
}

export async function getEntry(supabase: SupabaseClient, entryId: string) {
  const { data, error } = await supabase
    .from('watchlist_entries')
    .select('*')
    .eq('id', entryId)
    .single();

  if (error) throw new AppError('Entry not found', 404, 'NOT_FOUND');
  return data;
}

export async function addEntry(supabase: SupabaseClient, userId: string, entryData: AddEntryData) {
  const { data, error } = await supabase
    .from('watchlist_entries')
    .insert({ ...entryData, user_id: userId })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new AppError('This title is already in your watchlist', 409, 'DUPLICATE');
    }
    throw new AppError(error.message, 500);
  }

  return data;
}

export async function updateStatus(supabase: SupabaseClient, entryId: string, userId: string, status: string) {
  const { data, error } = await supabase
    .from('watchlist_entries')
    .update({ status })
    .eq('id', entryId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new AppError('Failed to update status', 500);
  return data;
}

export async function removeEntry(supabase: SupabaseClient, entryId: string, userId: string) {
  const { error } = await supabase
    .from('watchlist_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId);

  if (error) throw new AppError('Failed to remove entry', 500);
}

export async function checkEntry(supabase: SupabaseClient, userId: string, mediaType: string, tmdbId: number) {
  const { data } = await supabase
    .from('watchlist_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('media_type', mediaType)
    .eq('tmdb_id', tmdbId)
    .maybeSingle();

  return data;
}

export async function getPublicWatchlist(supabase: SupabaseClient, userId: string, filters: WatchlistFilters) {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const offset = (page - 1) * limit;

  let query = supabase
    .from('watchlist_entries')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('added_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.mediaType) {
    query = query.eq('media_type', filters.mediaType);
  }

  const { data, error, count } = await query;
  if (error) throw new AppError(error.message, 500);

  return { entries: data, total: count || 0, page, limit };
}
