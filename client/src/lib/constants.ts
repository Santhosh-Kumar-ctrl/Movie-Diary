export const WATCH_STATUSES = ['planning', 'watching', 'watched', 'dropped'] as const;
export type WatchStatus = (typeof WATCH_STATUSES)[number];

export const STATUS_LABELS: Record<WatchStatus, string> = {
  planning: 'Planning to Watch',
  watching: 'Currently Watching',
  watched: 'Watched',
  dropped: 'Dropped',
};

export const MEDIA_TYPES = ['movie', 'tv'] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
