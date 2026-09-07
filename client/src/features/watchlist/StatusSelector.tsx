import { useState, useRef, useEffect } from 'react';
import { WATCH_STATUSES, STATUS_LABELS, type WatchStatus } from '@/lib/constants';
import { useWatchlistEntry, useWatchlistMutations } from './useWatchlist';
import { yearFromDate } from '@/lib/utils';

interface StatusSelectorProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  posterPath?: string | null;
  overview?: string | null;
  releaseDate?: string | null;
}

export function StatusSelector({ tmdbId, mediaType, title, posterPath, overview, releaseDate }: StatusSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: entry, isLoading } = useWatchlistEntry(mediaType, tmdbId);
  const { addMutation, updateMutation, removeMutation } = useWatchlistMutations();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading) {
    return <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-800" />;
  }

  const handleSelect = (status: WatchStatus) => {
    if (entry) {
      if (status === entry.status) {
        setOpen(false);
        return;
      }
      updateMutation.mutate({ entryId: entry.id, status });
    } else {
      addMutation.mutate({
        tmdb_id: tmdbId,
        media_type: mediaType,
        status,
        title,
        poster_path: posterPath,
        overview: overview?.slice(0, 500),
        release_year: releaseDate ? Number(yearFromDate(releaseDate)) || null : null,
      });
    }
    setOpen(false);
  };

  const handleRemove = () => {
    if (entry) {
      removeMutation.mutate(entry.id);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
          entry
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {entry ? (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
            {STATUS_LABELS[entry.status]}
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add to Watchlist
          </>
        )}
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-10 mt-2 w-56 rounded-lg border border-gray-700 bg-gray-800 py-1 shadow-xl">
          {WATCH_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => handleSelect(status)}
              className={`flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-700 ${
                entry?.status === status ? 'text-indigo-400' : 'text-gray-300'
              }`}
            >
              {STATUS_LABELS[status]}
              {entry?.status === status && (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}
          {entry && (
            <>
              <div className="my-1 border-t border-gray-700" />
              <button
                onClick={handleRemove}
                className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
              >
                Remove from Watchlist
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
