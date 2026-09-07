import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, getPublicProfile, follow, unfollow, isFollowing as checkIsFollowing, updateProfile } from '@/api/social';
import { useAuthStore } from '@/store/authStore';
import { useUiStore } from '@/store/uiStore';
import { Spinner } from '@/components/ui/Spinner';
import { useState } from 'react';

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const currentUser = useAuthStore((s) => s.user);
  const isOwnProfile = !userId || userId === currentUser?.id;

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', userId ?? 'me'],
    queryFn: () => (isOwnProfile ? getMyProfile() : getPublicProfile(userId!)),
    staleTime: 60 * 1000,
  });

  if (isLoading || !profile) {
    return (
      <div className="flex justify-center py-16"><Spinner /></div>
    );
  }

  return isOwnProfile ? (
    <OwnProfile profile={profile} />
  ) : (
    <PublicProfile profile={profile} userId={userId!} />
  );
}

function OwnProfile({ profile }: { profile: { id: string; username: string; display_name: string | null; avatar_url: string | null; bio: string | null; is_public: boolean; stats: Record<string, number> } }) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.display_name || '');
  const [bio, setBio] = useState(profile.bio || '');
  const queryClient = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);

  const updateMutation = useMutation({
    mutationFn: () => updateProfile({ display_name: displayName, bio }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditing(false);
      addToast('Profile updated!', 'success');
    },
    onError: () => addToast('Failed to update profile', 'error'),
  });

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-8">
        <div className="flex items-start gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-700 text-2xl font-bold text-white">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              profile.username[0].toUpperCase()
            )}
          </div>

          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display name"
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Bio"
                  maxLength={500}
                  rows={3}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => updateMutation.mutate()}
                    className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white">{profile.display_name || profile.username}</h1>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-gray-500">@{profile.username}</p>
                {profile.bio && <p className="mt-2 text-sm text-gray-300">{profile.bio}</p>}
              </>
            )}
          </div>
        </div>
      </div>

      <StatsGrid stats={profile.stats} />
    </div>
  );
}

function PublicProfile({ profile, userId }: { profile: { id: string; username: string; display_name: string | null; avatar_url: string | null; bio: string | null; stats: Record<string, number> }; userId: string }) {
  const queryClient = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);

  const { data: following } = useQuery({
    queryKey: ['social', 'is-following', userId],
    queryFn: () => checkIsFollowing(userId),
  });

  const followMutation = useMutation({
    mutationFn: () => follow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social'] });
      addToast('Followed!', 'success');
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollow(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social'] });
      addToast('Unfollowed', 'info');
    },
  });

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-8">
        <div className="flex items-start gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-700 text-2xl font-bold text-white">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              profile.username[0].toUpperCase()
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{profile.display_name || profile.username}</h1>
            <p className="text-gray-500">@{profile.username}</p>
            {profile.bio && <p className="mt-2 text-sm text-gray-300">{profile.bio}</p>}
          </div>

          {following !== undefined && (
            following ? (
              <button
                onClick={() => unfollowMutation.mutate()}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:border-red-500 hover:text-red-400"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={() => followMutation.mutate()}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Follow
              </button>
            )
          )}
        </div>
      </div>

      <StatsGrid stats={profile.stats} />
    </div>
  );
}

function StatsGrid({ stats }: { stats: Record<string, number> }) {
  const items = [
    { label: 'Planning', value: stats.planning ?? 0 },
    { label: 'Watching', value: stats.watching ?? 0 },
    { label: 'Watched', value: stats.watched ?? 0 },
    { label: 'Dropped', value: stats.dropped ?? 0 },
    { label: 'Reviews', value: stats.total_reviews ?? 0 },
    { label: 'Followers', value: stats.followers ?? 0 },
    { label: 'Following', value: stats.following ?? 0 },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-center">
          <p className="text-2xl font-bold text-white">{item.value}</p>
          <p className="mt-1 text-xs text-gray-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
