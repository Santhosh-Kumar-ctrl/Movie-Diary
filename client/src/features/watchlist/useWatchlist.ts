import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as watchlistApi from '@/api/watchlist';
import { useUiStore } from '@/store/uiStore';
import type { WatchStatus, MediaType } from '@/lib/constants';
import { useState } from 'react';

export function useWatchlist() {
  const [statusFilter, setStatusFilter] = useState<WatchStatus | 'all'>('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<MediaType | 'all'>('all');

  const query = useQuery({
    queryKey: ['watchlist', { status: statusFilter, mediaType: mediaTypeFilter }],
    queryFn: () => watchlistApi.getWatchlist({
      status: statusFilter === 'all' ? undefined : statusFilter,
      mediaType: mediaTypeFilter === 'all' ? undefined : mediaTypeFilter,
      limit: 100,
    }),
    staleTime: 60 * 1000,
  });

  return {
    ...query,
    entries: query.data?.entries ?? [],
    total: query.data?.total ?? 0,
    statusFilter,
    setStatusFilter,
    mediaTypeFilter,
    setMediaTypeFilter,
  };
}

export function useWatchlistEntry(mediaType: string, tmdbId: number) {
  return useQuery({
    queryKey: ['watchlist', 'check', mediaType, tmdbId],
    queryFn: () => watchlistApi.checkWatchlistEntry(mediaType, tmdbId),
    staleTime: 60 * 1000,
  });
}

export function useWatchlistMutations() {
  const queryClient = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);

  const addMutation = useMutation({
    mutationFn: watchlistApi.addToWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      addToast('Added to watchlist!', 'success');
    },
    onError: (err: Error & { response?: { data?: { error?: { message?: string } } } }) => {
      addToast(err.response?.data?.error?.message || 'Failed to add', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ entryId, status }: { entryId: string; status: string }) =>
      watchlistApi.updateWatchlistStatus(entryId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      addToast('Status updated!', 'success');
    },
    onError: () => addToast('Failed to update status', 'error'),
  });

  const removeMutation = useMutation({
    mutationFn: watchlistApi.removeFromWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      addToast('Removed from watchlist', 'info');
    },
    onError: () => addToast('Failed to remove', 'error'),
  });

  return { addMutation, updateMutation, removeMutation };
}
