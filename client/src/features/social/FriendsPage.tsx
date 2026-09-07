import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFollowers, getFollowing, searchUsers, follow, unfollow } from '@/api/social';
import { useDebounce } from '@/hooks/useDebounce';
import { useUiStore } from '@/store/uiStore';
import { Link } from 'react-router-dom';
import { Spinner } from '@/components/ui/Spinner';
import type { Profile } from '@/types/social';

export default function FriendsPage() {
  const [tab, setTab] = useState<'following' | 'followers'>('following');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const queryClient = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);

  const { data: followingData } = useQuery({
    queryKey: ['social', 'following'],
    queryFn: () => getFollowing(),
  });

  const { data: followersData } = useQuery({
    queryKey: ['social', 'followers'],
    queryFn: () => getFollowers(),
  });

  const { data: searchResults } = useQuery({
    queryKey: ['users', 'search', debouncedSearch],
    queryFn: () => searchUsers(debouncedSearch),
    enabled: debouncedSearch.length >= 2,
  });

  const followMutation = useMutation({
    mutationFn: follow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social'] });
      addToast('Followed!', 'success');
    },
    onError: () => addToast('Failed to follow', 'error'),
  });

  const unfollowMutation = useMutation({
    mutationFn: unfollow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social'] });
      addToast('Unfollowed', 'info');
    },
    onError: () => addToast('Failed to unfollow', 'error'),
  });

  const followingIds = new Set(followingData?.users.map((u) => u.id) ?? []);

  const renderUserCard = (user: Profile, showFollowButton: boolean = true) => (
    <div key={user.id} className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4">
      <Link to={`/user/${user.id}`} className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700">
        {user.avatar_url ? (
          <img src={user.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
        ) : (
          <span className="text-lg font-medium text-white">
            {(user.username[0] ?? '?').toUpperCase()}
          </span>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link to={`/user/${user.id}`} className="font-medium text-white hover:text-indigo-400">
          {user.display_name || user.username}
        </Link>
        <p className="text-sm text-gray-500">@{user.username}</p>
      </div>

      {showFollowButton && (
        followingIds.has(user.id) ? (
          <button
            onClick={() => unfollowMutation.mutate(user.id)}
            className="rounded-lg border border-gray-700 px-4 py-1.5 text-sm text-gray-300 hover:border-red-500 hover:text-red-400"
          >
            Unfollow
          </button>
        ) : (
          <button
            onClick={() => followMutation.mutate(user.id)}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Follow
          </button>
        )
      )}
    </div>
  );

  const users = tab === 'following' ? followingData?.users : followersData?.users;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Friends</h1>
        <p className="mt-1 text-gray-400">Find and connect with other watchers.</p>
      </div>

      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by username..."
          className="w-full rounded-xl border border-gray-700 bg-gray-800 py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {debouncedSearch.length >= 2 && searchResults ? (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-400">Search Results</h2>
          {searchResults.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            searchResults.map((user) => renderUserCard(user))
          )}
        </div>
      ) : (
        <>
          <div className="flex gap-1 rounded-lg bg-gray-900 p-1">
            {(['following', 'followers'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  tab === t ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {t} ({t === 'following' ? followingData?.total ?? 0 : followersData?.total ?? 0})
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {!users ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : users.length === 0 ? (
              <p className="py-8 text-center text-gray-500">
                {tab === 'following' ? "You're not following anyone yet." : 'No followers yet.'}
              </p>
            ) : (
              users.map((user) => renderUserCard(user))
            )}
          </div>
        </>
      )}
    </div>
  );
}
