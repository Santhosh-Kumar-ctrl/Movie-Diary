import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEpisodeProgress, toggleEpisode, markSeasonComplete, unmarkSeason } from '@/api/episodes';
import { getTvSeason } from '@/api/tmdb';
import type { TmdbSeason } from '@/types/media';
import { formatDate } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';

interface SeasonAccordionProps {
  tmdbId: number;
  season: TmdbSeason;
  entryId: string;
}

export function SeasonAccordion({ tmdbId, season, entryId }: SeasonAccordionProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);

  const { data: progress } = useQuery({
    queryKey: ['episodes', entryId],
    queryFn: () => getEpisodeProgress(entryId),
    staleTime: 30 * 1000,
  });

  const { data: seasonDetail } = useQuery({
    queryKey: ['tmdb', 'tv', tmdbId, 'season', season.season_number],
    queryFn: () => getTvSeason(tmdbId, season.season_number),
    enabled: open,
    staleTime: 30 * 60 * 1000,
  });

  const seasonProgress = progress?.filter((ep) => ep.season_number === season.season_number) ?? [];
  const watchedCount = seasonProgress.filter((ep) => ep.watched).length;
  const isComplete = watchedCount >= season.episode_count && season.episode_count > 0;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['episodes', entryId] });

  const toggleMutation = useMutation({
    mutationFn: ({ episodeNum, watched }: { episodeNum: number; watched: boolean }) =>
      toggleEpisode(entryId, season.season_number, episodeNum, watched),
    onSuccess: invalidate,
    onError: () => addToast('Failed to update episode', 'error'),
  });

  const markCompleteMutation = useMutation({
    mutationFn: () => markSeasonComplete(entryId, season.season_number, season.episode_count),
    onSuccess: () => { invalidate(); addToast('Season marked complete!', 'success'); },
    onError: () => addToast('Failed to mark season', 'error'),
  });

  const unmarkMutation = useMutation({
    mutationFn: () => unmarkSeason(entryId, season.season_number),
    onSuccess: () => { invalidate(); addToast('Season unmarked', 'info'); },
    onError: () => addToast('Failed to unmark season', 'error'),
  });

  const isEpisodeWatched = (episodeNum: number) =>
    seasonProgress.some((ep) => ep.episode_number === episodeNum && ep.watched);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-800/50"
      >
        <div className="flex items-center gap-3">
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          <span className="font-medium text-white">{season.name}</span>
          <span className="text-sm text-gray-400">
            {watchedCount}/{season.episode_count} episodes
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-700">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${season.episode_count > 0 ? (watchedCount / season.episode_count) * 100 : 0}%` }}
            />
          </div>
          {isComplete ? (
            <button
              onClick={(e) => { e.stopPropagation(); unmarkMutation.mutate(); }}
              className="rounded-lg bg-green-600/20 px-3 py-1 text-xs font-medium text-green-400 hover:bg-green-600/30"
            >
              Completed
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); markCompleteMutation.mutate(); }}
              className="rounded-lg bg-gray-700 px-3 py-1 text-xs font-medium text-gray-300 hover:bg-gray-600"
            >
              Mark Complete
            </button>
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-800">
          {seasonDetail?.episodes ? (
            <div className="divide-y divide-gray-800">
              {seasonDetail.episodes.map((ep) => {
                const watched = isEpisodeWatched(ep.episode_number);
                return (
                  <label
                    key={ep.id}
                    className="flex cursor-pointer items-center gap-4 px-4 py-3 hover:bg-gray-800/30"
                  >
                    <input
                      type="checkbox"
                      checked={watched}
                      onChange={() => toggleMutation.mutate({ episodeNum: ep.episode_number, watched: !watched })}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="w-8 text-sm font-medium text-gray-500">
                      E{String(ep.episode_number).padStart(2, '0')}
                    </span>
                    <span className={`flex-1 text-sm ${watched ? 'text-gray-500 line-through' : 'text-white'}`}>
                      {ep.name}
                    </span>
                    {ep.air_date && (
                      <span className="text-xs text-gray-600">{formatDate(ep.air_date)}</span>
                    )}
                    {ep.runtime && (
                      <span className="text-xs text-gray-600">{ep.runtime}m</span>
                    )}
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="flex justify-center py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-indigo-500" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
