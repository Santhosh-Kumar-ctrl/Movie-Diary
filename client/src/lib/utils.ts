import { TMDB_IMAGE_BASE } from './constants';

export function tmdbImage(path: string | null | undefined, size: 'w185' | 'w342' | 'w780' = 'w342') {
  if (!path) return '/placeholder-poster.svg';
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function yearFromDate(date: string | null | undefined) {
  if (!date) return '';
  return new Date(date).getFullYear().toString();
}
