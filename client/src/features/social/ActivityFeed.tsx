import { useInfiniteQuery } from '@tanstack/react-query';
import { getFeed } from '@/api/social';
import { Spinner } from '@/components/ui/Spinner';
import { Link } from 'react-router-dom';
import { tmdbImage, formatDate } from '@/lib/utils';
import type { ActivityItem as ActivityItemType } from '@/types/social';

function activityText(item: ActivityItemType): string {
  const title = (item.metadata.title as string) || 'a title';
  switch (item.activity_type) {
    case 'added_to_watchlist':
      return `added ${title} to their watchlist`;
    case 'status_changed': {
      const newStatus = item.metadata.new_status as string;
      if (newStatus === 'watching') return `started watching ${title}`;
      if (newStatus === 'watched') return `finished ${title}`;
      if (newStatus === 'dropped') return `dropped ${title}`;
      return `updated ${title} status`;
    }
    case 'reviewed': {
      const rating = item.metadata.rating as number;
      return `rated ${title} ${rating}/10`;
    }
    case 'season_completed': {
      const season = item.metadata.season_number as number;
      return `completed Season ${season} of ${title}`;
    }
    default:
      return `interacted with ${title}`;
  }
}

function activityLink(item: ActivityItemType): string {
  const mediaType = item.metadata.media_type as string;
  const tmdbId = item.metadata.tmdb_id as number;
  if (mediaType && tmdbId) {
    return `/${mediaType}/${tmdbId}`;
  }
  return '#';
}

export default function ActivityFeedPage() {
  const {
    data,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['social', 'feed'],
    queryFn: ({ pageParam }) => getFeed(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.activities.length >= 20 ? lastPageParam + 1 : undefined,
    staleTime: 30 * 1000,
  });

  const activities = data?.pages.flatMap((p) => p.activities) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Activity Feed</h1>
        <p className="mt-1 text-gray-400">See what your friends are watching.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : activities.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-gray-500">No activity yet.</p>
          <Link to="/friends" className="mt-2 inline-block text-indigo-400 hover:text-indigo-300">
            Find friends to follow
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((item) => (
            <div key={item.id} className="flex items-start gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4">
              <Link
                to={`/user/${item.user_id}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-700"
              >
                {item.profiles?.avatar_url ? (
                  <img src={item.profiles.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span className="text-sm font-medium text-white">
                    {(item.profiles?.username?.[0] ?? '?').toUpperCase()}
                  </span>
                )}
              </Link>

              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-300">
                  <Link to={`/user/${item.user_id}`} className="font-medium text-white hover:text-indigo-400">
                    {item.profiles?.display_name || item.profiles?.username || 'Someone'}
                  </Link>{' '}
                  {activityText(item)}
                </p>
                <p className="mt-1 text-xs text-gray-600">{formatDate(item.created_at)}</p>
              </div>

              {typeof item.metadata.poster_path === 'string' && (
                <Link to={activityLink(item)} className="h-16 w-11 shrink-0 overflow-hidden rounded bg-gray-800">
                  <img
                    src={tmdbImage(item.metadata.poster_path as string, 'w185')}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </Link>
              )}
            </div>
          ))}

          {hasNextPage && (
            <div className="flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-lg bg-gray-800 px-6 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
