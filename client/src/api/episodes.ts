import { api } from './client';

export interface EpisodeProgress {
  id: string;
  user_id: string;
  watchlist_entry_id: string;
  season_number: number;
  episode_number: number;
  watched: boolean;
  watched_at: string | null;
}

export async function getEpisodeProgress(entryId: string): Promise<EpisodeProgress[]> {
  const { data } = await api.get(`/watchlist/${entryId}/episodes`);
  return data.data;
}

export async function toggleEpisode(entryId: string, seasonNum: number, episodeNum: number, watched: boolean): Promise<EpisodeProgress> {
  const { data } = await api.put(`/watchlist/${entryId}/episodes/${seasonNum}/${episodeNum}`, { watched });
  return data.data;
}

export async function markSeasonComplete(entryId: string, seasonNum: number, totalEpisodes: number): Promise<void> {
  await api.put(`/watchlist/${entryId}/seasons/${seasonNum}/complete`, { total_episodes: totalEpisodes });
}

export async function unmarkSeason(entryId: string, seasonNum: number): Promise<void> {
  await api.delete(`/watchlist/${entryId}/seasons/${seasonNum}`);
}
