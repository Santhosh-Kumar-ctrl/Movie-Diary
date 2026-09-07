import { MediaGrid } from '@/components/media/MediaGrid';
import { Spinner } from '@/components/ui/Spinner';
import type { TmdbSearchResult } from '@/types/media';

interface SearchResultsProps {
  results: TmdbSearchResult[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  query: string;
}

export function SearchResults({
  results,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  query,
}: SearchResultsProps) {
  if (query.length < 2) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-gray-500">Type at least 2 characters to search</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MediaGrid items={results} />

      {hasNextPage && (
        <div className="flex justify-center">
          <button
            onClick={fetchNextPage}
            disabled={isFetchingNextPage}
            className="rounded-lg bg-gray-800 px-6 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
          >
            {isFetchingNextPage ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-4 w-4" /> Loading...
              </span>
            ) : (
              'Load more'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
