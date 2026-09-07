import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../utils/AppError.js';

interface CreateReviewData {
  rating: number;
  review_text?: string | null;
  contains_spoilers?: boolean;
}

export async function getReviewForEntry(supabase: SupabaseClient, userId: string, entryId: string) {
  const { data } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('watchlist_entry_id', entryId)
    .maybeSingle();

  return data;
}

export async function createReview(supabase: SupabaseClient, userId: string, entryId: string, reviewData: CreateReviewData) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      user_id: userId,
      watchlist_entry_id: entryId,
      ...reviewData,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new AppError('You have already reviewed this title', 409, 'DUPLICATE');
    }
    throw new AppError(error.message, 500);
  }

  return data;
}

export async function updateReview(supabase: SupabaseClient, reviewId: string, userId: string, reviewData: Partial<CreateReviewData>) {
  const { data, error } = await supabase
    .from('reviews')
    .update(reviewData)
    .eq('id', reviewId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw new AppError('Failed to update review', 500);
  return data;
}

export async function deleteReview(supabase: SupabaseClient, reviewId: string, userId: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', userId);

  if (error) throw new AppError('Failed to delete review', 500);
}

export async function getReviewsForTitle(supabase: SupabaseClient, mediaType: string, tmdbId: number, page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('reviews')
    .select(`
      *,
      profiles:user_id (username, display_name, avatar_url),
      watchlist_entries:watchlist_entry_id!inner (tmdb_id, media_type)
    `, { count: 'exact' })
    .eq('watchlist_entries.tmdb_id', tmdbId)
    .eq('watchlist_entries.media_type', mediaType)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new AppError(error.message, 500);

  return { reviews: data, total: count || 0, page, limit };
}

export async function getUserReviews(supabase: SupabaseClient, userId: string, page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('reviews')
    .select(`
      *,
      watchlist_entries:watchlist_entry_id (title, poster_path, tmdb_id, media_type)
    `, { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new AppError(error.message, 500);

  return { reviews: data, total: count || 0, page, limit };
}
