import { useInfiniteQuery } from '@tanstack/react-query';
import { searchTmdb } from '@/api/tmdb';
import { useDebounce } from '@/hooks/useDebounce';
import { useState } from 'react';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [mediaType, setMediaType] = useState<'multi' | 'movie' | 'tv'>('multi');
  const debouncedQuery = useDebounce(query, 300);

  const searchQuery = useInfiniteQuery({
    queryKey: ['tmdb', 'search', { query: debouncedQuery, type: mediaType }],
    queryFn: ({ pageParam }) => searchTmdb(debouncedQuery, mediaType, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  const results = searchQuery.data?.pages.flatMap((page) => page.results) ?? [];

  return {
    query,
    setQuery,
    mediaType,
    setMediaType,
    results,
    ...searchQuery,
  };
}
