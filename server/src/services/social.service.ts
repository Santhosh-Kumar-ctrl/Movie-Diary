import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../utils/AppError.js';

export async function follow(supabase: SupabaseClient, followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new AppError('You cannot follow yourself', 400, 'SELF_FOLLOW');
  }

  const { error } = await supabase
    .from('follows')
    .insert({ follower_id: followerId, following_id: followingId });

  if (error) {
    if (error.code === '23505') {
      throw new AppError('Already following this user', 409, 'DUPLICATE');
    }
    throw new AppError(error.message, 500);
  }
}

export async function unfollow(supabase: SupabaseClient, followerId: string, followingId: string) {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId);

  if (error) throw new AppError(error.message, 500);
}

export async function getFollowers(supabase: SupabaseClient, userId: string, page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('follows')
    .select(`
      follower_id,
      created_at,
      profiles:follower_id (id, username, display_name, avatar_url)
    `, { count: 'exact' })
    .eq('following_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new AppError(error.message, 500);

  return { users: data, total: count || 0, page, limit };
}

export async function getFollowing(supabase: SupabaseClient, userId: string, page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from('follows')
    .select(`
      following_id,
      created_at,
      profiles:following_id (id, username, display_name, avatar_url)
    `, { count: 'exact' })
    .eq('follower_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new AppError(error.message, 500);

  return { users: data, total: count || 0, page, limit };
}

export async function isFollowing(supabase: SupabaseClient, followerId: string, followingId: string) {
  const { data } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle();

  return !!data;
}

export async function getFollowCounts(supabase: SupabaseClient, userId: string) {
  const [followersResult, followingResult] = await Promise.all([
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', userId),
    supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', userId),
  ]);

  return {
    followers: followersResult.count || 0,
    following: followingResult.count || 0,
  };
}
