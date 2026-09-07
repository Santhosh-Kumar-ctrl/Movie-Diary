import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../utils/AppError.js';
import { getFollowCounts } from './social.service.js';

interface UpdateProfileData {
  username?: string;
  display_name?: string;
  bio?: string;
  is_public?: boolean;
}

export async function getProfile(supabase: SupabaseClient, userId: string) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw new AppError('Profile not found', 404, 'NOT_FOUND');

  const [statusCounts, reviewCount, followCounts] = await Promise.all([
    getStatusCounts(supabase, userId),
    getReviewCount(supabase, userId),
    getFollowCounts(supabase, userId),
  ]);

  return {
    ...profile,
    stats: {
      ...statusCounts,
      total_reviews: reviewCount,
      ...followCounts,
    },
  };
}

export async function updateProfile(supabase: SupabaseClient, userId: string, data: UpdateProfileData) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .update(data)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new AppError('Username already taken', 409, 'DUPLICATE');
    }
    throw new AppError(error.message, 500);
  }

  return profile;
}

export async function searchUsers(supabase: SupabaseClient, query: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .ilike('username', `%${query}%`)
    .limit(limit);

  if (error) throw new AppError(error.message, 500);

  return data;
}

async function getStatusCounts(supabase: SupabaseClient, userId: string) {
  const statuses = ['planning', 'watching', 'watched', 'dropped'] as const;
  const results: Record<string, number> = {};

  for (const status of statuses) {
    const { count } = await supabase
      .from('watchlist_entries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', status);
    results[status] = count || 0;
  }

  return results;
}

async function getReviewCount(supabase: SupabaseClient, userId: string) {
  const { count } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  return count || 0;
}
