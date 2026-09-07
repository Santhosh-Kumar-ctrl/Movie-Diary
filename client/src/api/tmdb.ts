import { api } from './client';
import type { TmdbSearchResponse, TmdbMovie, TmdbTvShow, TmdbSeason } from '@/types/media';

export async function searchTmdb(query: string, type: string = 'multi', page: number = 1): Promise<TmdbSearchResponse> {
  const { data } = await api.get('/tmdb/search', { params: { query, type, page } });
  return data.data;
}

export async function getMovie(tmdbId: number): Promise<TmdbMovie> {
  const { data } = await api.get(`/tmdb/movie/${tmdbId}`);
  return data.data;
}

export async function getTvShow(tmdbId: number): Promise<TmdbTvShow> {
  const { data } = await api.get(`/tmdb/tv/${tmdbId}`);
  return data.data;
}

export async function getTvSeason(tmdbId: number, seasonNum: number): Promise<TmdbSeason> {
  const { data } = await api.get(`/tmdb/tv/${tmdbId}/season/${seasonNum}`);
  return data.data;
}

export async function getTrending(type: string = 'all', window: string = 'week'): Promise<TmdbSearchResponse> {
  const { data } = await api.get('/tmdb/trending', { params: { type, window } });
  return data.data;
}
