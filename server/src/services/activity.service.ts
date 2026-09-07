import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../utils/AppError.js';

export async function getFeed(supabase: SupabaseClient, userId: string, page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;

  const { data: followingRows } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', userId);

  const followingIds = followingRows?.map((r) => r.following_id) ?? [];

  if (followingIds.length === 0) {
    return { activities: [], total: 0, page, limit };
  }

  const { data, error, count } = await supabase
    .from('activity_feed')
    .select(`
      *,
      profiles:user_id (username, display_name, avatar_url)
    `, { count: 'exact' })
    .in('user_id', followingIds)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw new AppError(error.message, 500);

  return { activities: data, total: count || 0, page, limit };
}
