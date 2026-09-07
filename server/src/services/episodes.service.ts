import type { SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../utils/AppError.js';

export async function getEpisodeProgress(supabase: SupabaseClient, entryId: string) {
  const { data, error } = await supabase
    .from('episode_progress')
    .select('*')
    .eq('watchlist_entry_id', entryId)
    .order('season_number')
    .order('episode_number');

  if (error) throw new AppError(error.message, 500);
  return data;
}

export async function toggleEpisode(
  supabase: SupabaseClient,
  userId: string,
  entryId: string,
  seasonNumber: number,
  episodeNumber: number,
  watched: boolean,
) {
  const { data, error } = await supabase
    .from('episode_progress')
    .upsert(
      {
        user_id: userId,
        watchlist_entry_id: entryId,
        season_number: seasonNumber,
        episode_number: episodeNumber,
        watched,
        watched_at: watched ? new Date().toISOString() : null,
      },
      { onConflict: 'user_id,watchlist_entry_id,season_number,episode_number' },
    )
    .select()
    .single();

  if (error) throw new AppError(error.message, 500);
  return data;
}

export async function markSeasonComplete(
  supabase: SupabaseClient,
  userId: string,
  entryId: string,
  seasonNumber: number,
  totalEpisodes: number,
) {
  const rows = Array.from({ length: totalEpisodes }, (_, i) => ({
    user_id: userId,
    watchlist_entry_id: entryId,
    season_number: seasonNumber,
    episode_number: i + 1,
    watched: true,
    watched_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('episode_progress')
    .upsert(rows, { onConflict: 'user_id,watchlist_entry_id,season_number,episode_number' });

  if (error) throw new AppError(error.message, 500);
}

export async function unmarkSeason(
  supabase: SupabaseClient,
  userId: string,
  entryId: string,
  seasonNumber: number,
) {
  const { error } = await supabase
    .from('episode_progress')
    .update({ watched: false, watched_at: null })
    .eq('user_id', userId)
    .eq('watchlist_entry_id', entryId)
    .eq('season_number', seasonNumber);

  if (error) throw new AppError(error.message, 500);
}

export async function getSeasonProgress(supabase: SupabaseClient, entryId: string, seasonNumber: number) {
  const { data, error } = await supabase
    .from('episode_progress')
    .select('watched')
    .eq('watchlist_entry_id', entryId)
    .eq('season_number', seasonNumber);

  if (error) throw new AppError(error.message, 500);

  const total = data.length;
  const watched = data.filter((ep) => ep.watched).length;

  return { total, watched };
}
