import { useSearch } from './useSearch';
import { SearchBar } from './SearchBar';
import { SearchResults } from './SearchResults';
import { useQuery } from '@tanstack/react-query';
import { getTrending } from '@/api/tmdb';
import { MediaGrid } from '@/components/media/MediaGrid';

export default function SearchPage() {
  const search = useSearch();

  const { data: trending } = useQuery({
    queryKey: ['tmdb', 'trending', 'all', 'week'],
    queryFn: () => getTrending('all', 'week'),
    staleTime: 30 * 60 * 1000,
  });

  const showTrending = search.query.length < 2;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Search</h1>
        <p className="mt-1 text-gray-400">Find movies and TV shows to track.</p>
      </div>

      <SearchBar
        query={search.query}
        onQueryChange={search.setQuery}
        mediaType={search.mediaType}
        onMediaTypeChange={search.setMediaType}
      />

      {showTrending && trending ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Trending This Week</h2>
          <MediaGrid items={trending.results.slice(0, 12)} />
        </div>
      ) : (
        <SearchResults
          results={search.results}
          isLoading={search.isLoading}
          isFetchingNextPage={search.isFetchingNextPage}
          hasNextPage={search.hasNextPage ?? false}
          fetchNextPage={search.fetchNextPage}
          query={search.query}
        />
      )}
    </div>
  );
}
