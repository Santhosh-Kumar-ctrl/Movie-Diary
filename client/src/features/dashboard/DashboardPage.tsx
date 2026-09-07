import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { getWatchlist } from '@/api/watchlist';
import { getFeed } from '@/api/social';
import { tmdbImage, formatDate } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/constants';
import { Skeleton } from '@/components/ui/Skeleton';
import type { ActivityItem } from '@/types/social';

function activityText(item: ActivityItem): string {
  const title = (item.metadata.title as string) || 'a title';
  switch (item.activity_type) {
    case 'status_changed': {
      const s = item.metadata.new_status as string;
      if (s === 'watching') return `started watching ${title}`;
      if (s === 'watched') return `finished ${title}`;
      if (s === 'dropped') return `dropped ${title}`;
      return `updated ${title}`;
    }
    case 'reviewed':
      return `rated ${title} ${item.metadata.rating as number}/10`;
    case 'season_completed':
      return `completed S${item.metadata.season_number as number} of ${title}`;
    default:
      return `added ${title}`;
  }
}

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: watchingData, isLoading: watchingLoading } = useQuery({
    queryKey: ['watchlist', { status: 'watching' }],
    queryFn: () => getWatchlist({ status: 'watching', limit: 6 }),
    staleTime: 60 * 1000,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['watchlist', { stats: true }],
    queryFn: async () => {
      const [planning, watching, watched, dropped] = await Promise.all([
        getWatchlist({ status: 'planning', limit: 1 }),
        getWatchlist({ status: 'watching', limit: 1 }),
        getWatchlist({ status: 'watched', limit: 1 }),
        getWatchlist({ status: 'dropped', limit: 1 }),
      ]);
      return {
        planning: planning.total,
        watching: watching.total,
        watched: watched.total,
        dropped: dropped.total,
      };
    },
    staleTime: 60 * 1000,
  });

  const { data: feedData, isLoading: feedLoading } = useQuery({
    queryKey: ['social', 'feed', { limit: 5 }],
    queryFn: () => getFeed(1, 5),
    staleTime: 30 * 1000,
  });

  const stats = [
    { label: 'Planning', value: statsData?.planning ?? 0, color: 'text-blue-400' },
    { label: 'Watching', value: statsData?.watching ?? 0, color: 'text-green-400' },
    { label: 'Watched', value: statsData?.watched ?? 0, color: 'text-purple-400' },
    { label: 'Dropped', value: statsData?.dropped ?? 0, color: 'text-red-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back{user?.user_metadata?.display_name ? `, ${user.user_metadata.display_name}` : ''}
        </h1>
        <p className="mt-1 text-gray-400">Here&apos;s what&apos;s happening with your watchlist.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-800 bg-gray-900 p-4 sm:p-6">
            <p className="text-sm text-gray-400">{stat.label}</p>
            {statsLoading ? (
              <Skeleton className="mt-2 h-9 w-12" />
            ) : (
              <p className={`mt-2 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Continue Watching</h2>
            <Link to="/watchlist" className="text-sm text-indigo-400 hover:text-indigo-300">View all</Link>
          </div>

          {watchingLoading ? (
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-14 w-10 rounded" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : !watchingData?.entries.length ? (
            <div className="mt-4 py-6 text-center">
              <p className="text-gray-500">No shows in progress.</p>
              <Link to="/search" className="mt-1 inline-block text-sm text-indigo-400 hover:text-indigo-300">
                Search for something to watch
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {watchingData.entries.map((entry) => {
                const link = entry.media_type === 'movie' ? `/movie/${entry.tmdb_id}` : `/tv/${entry.tmdb_id}`;
                return (
                  <Link key={entry.id} to={link} className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-800/50">
                    <div className="h-14 w-10 shrink-0 overflow-hidden rounded bg-gray-800">
                      {entry.poster_path ? (
                        <img src={tmdbImage(entry.poster_path, 'w185')} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-600">N/A</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{entry.title}</p>
                      <p className="text-xs text-gray-500 uppercase">{entry.media_type}</p>
                    </div>
                    <span className="text-xs text-green-400">{STATUS_LABELS[entry.status as keyof typeof STATUS_LABELS]}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Friend Activity</h2>
            <Link to="/feed" className="text-sm text-indigo-400 hover:text-indigo-300">View all</Link>
          </div>

          {feedLoading ? (
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : !feedData?.activities.length ? (
            <div className="mt-4 py-6 text-center">
              <p className="text-gray-500">No recent activity.</p>
              <Link to="/friends" className="mt-1 inline-block text-sm text-indigo-400 hover:text-indigo-300">
                Follow friends to see their activity
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {feedData.activities.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg p-2">
                  <Link to={`/user/${item.user_id}`} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-700">
                    <span className="text-xs font-medium text-white">
                      {(item.profiles?.username?.[0] ?? '?').toUpperCase()}
                    </span>
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-gray-300">
                      <span className="font-medium text-white">
                        {item.profiles?.display_name || item.profiles?.username || 'Someone'}
                      </span>{' '}
                      {activityText(item)}
                    </p>
                    <p className="text-xs text-gray-600">{formatDate(item.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
