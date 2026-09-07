import { Link } from 'react-router-dom';
import { useWatchlist, useWatchlistMutations } from './useWatchlist';
import { WATCH_STATUSES, STATUS_LABELS, type WatchStatus } from '@/lib/constants';
import { StatusBadge } from '@/components/media/StatusBadge';
import { tmdbImage, formatDate } from '@/lib/utils';
import { Spinner } from '@/components/ui/Spinner';

const ALL_STATUSES: Array<WatchStatus | 'all'> = ['all', ...WATCH_STATUSES];

export default function WatchlistPage() {
  const {
    entries,
    total,
    isLoading,
    statusFilter,
    setStatusFilter,
    mediaTypeFilter,
    setMediaTypeFilter,
  } = useWatchlist();

  const { updateMutation, removeMutation } = useWatchlistMutations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
        <p className="mt-1 text-gray-400">{total} title{total !== 1 ? 's' : ''} tracked</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex gap-1 rounded-lg bg-gray-900 p-1">
          {ALL_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {status === 'all' ? 'All' : STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        <div className="flex gap-1 rounded-lg bg-gray-900 p-1">
          {(['all', 'movie', 'tv'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setMediaTypeFilter(type)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                mediaTypeFilter === type
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {type === 'all' ? 'All' : type === 'movie' ? 'Movies' : 'TV Shows'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : entries.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-gray-500">Your watchlist is empty.</p>
          <Link to="/search" className="mt-2 inline-block text-indigo-400 hover:text-indigo-300">
            Search for something to watch
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const linkTo = entry.media_type === 'movie' ? `/movie/${entry.tmdb_id}` : `/tv/${entry.tmdb_id}`;
            return (
              <div
                key={entry.id}
                className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4 transition-colors hover:border-gray-700"
              >
                <Link to={linkTo} className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-800">
                  {entry.poster_path ? (
                    <img
                      src={tmdbImage(entry.poster_path, 'w185')}
                      alt={entry.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-600">
                      N/A
                    </div>
                  )}
                </Link>

                <div className="min-w-0 flex-1">
                  <Link to={linkTo} className="font-medium text-white hover:text-indigo-400">
                    {entry.title}
                  </Link>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    <span className="uppercase">{entry.media_type}</span>
                    {entry.release_year && <span>{entry.release_year}</span>}
                    <span>Added {formatDate(entry.added_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={entry.status} />

                  <select
                    value={entry.status}
                    onChange={(e) => updateMutation.mutate({ entryId: entry.id, status: e.target.value })}
                    className="rounded-lg border border-gray-700 bg-gray-800 px-2 py-1 text-xs text-gray-300 focus:border-indigo-500 focus:outline-none"
                  >
                    {WATCH_STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeMutation.mutate(entry.id)}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 hover:text-red-400"
                    title="Remove"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
