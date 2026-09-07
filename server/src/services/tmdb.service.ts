import { tmdbClient, tmdbCache } from '../config/tmdb.js';

interface SearchParams {
  query: string;
  type: 'movie' | 'tv' | 'multi';
  page: number;
}

function cached<T>(key: string, ttl: number, fetcher: () => Promise<T>): Promise<T> {
  const hit = tmdbCache.get<T>(key);
  if (hit) return Promise.resolve(hit);
  return fetcher().then((data) => {
    tmdbCache.set(key, data, ttl);
    return data;
  });
}

export async function searchTmdb({ query, type, page }: SearchParams) {
  const endpoint = type === 'multi' ? '/search/multi' : `/search/${type}`;
  return cached(`search:${type}:${query}:${page}`, 600, async () => {
    const { data } = await tmdbClient.get(endpoint, {
      params: { query, page, include_adult: false },
    });
    return data;
  });
}

export async function getMovieDetails(tmdbId: number) {
  return cached(`movie:${tmdbId}`, 86400, async () => {
    const { data } = await tmdbClient.get(`/movie/${tmdbId}`, {
      params: { append_to_response: 'credits,similar' },
    });
    return data;
  });
}

export async function getTvDetails(tmdbId: number) {
  return cached(`tv:${tmdbId}`, 86400, async () => {
    const { data } = await tmdbClient.get(`/tv/${tmdbId}`, {
      params: { append_to_response: 'credits,similar' },
    });
    return data;
  });
}

export async function getTvSeason(tmdbId: number, seasonNumber: number) {
  return cached(`tv:${tmdbId}:season:${seasonNumber}`, 86400, async () => {
    const { data } = await tmdbClient.get(`/tv/${tmdbId}/season/${seasonNumber}`);
    return data;
  });
}

export async function getTrending(type: 'movie' | 'tv' | 'all', window: 'day' | 'week') {
  return cached(`trending:${type}:${window}`, 3600, async () => {
    const { data } = await tmdbClient.get(`/trending/${type}/${window}`);
    return data;
  });
}
