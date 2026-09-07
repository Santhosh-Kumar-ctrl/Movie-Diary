import { api } from './client';
import type { Profile, ProfileWithStats, ActivityItem } from '@/types/social';

export async function follow(userId: string): Promise<void> {
  await api.post(`/social/follow/${userId}`);
}

export async function unfollow(userId: string): Promise<void> {
  await api.delete(`/social/follow/${userId}`);
}

export async function getFollowers(page: number = 1, limit: number = 20): Promise<{ users: Profile[]; total: number }> {
  const { data } = await api.get('/social/followers', { params: { page, limit } });
  return data.data;
}

export async function getFollowing(page: number = 1, limit: number = 20): Promise<{ users: Profile[]; total: number }> {
  const { data } = await api.get('/social/following', { params: { page, limit } });
  return data.data;
}

export async function isFollowing(userId: string): Promise<boolean> {
  const { data } = await api.get(`/social/is-following/${userId}`);
  return data.data;
}

export async function getFeed(page: number = 1, limit: number = 20): Promise<{ activities: ActivityItem[]; total: number }> {
  const { data } = await api.get('/social/feed', { params: { page, limit } });
  return data.data;
}

export async function getMyProfile(): Promise<ProfileWithStats> {
  const { data } = await api.get('/profile');
  return data.data;
}

export async function updateProfile(updates: {
  username?: string;
  display_name?: string;
  bio?: string;
  is_public?: boolean;
}): Promise<Profile> {
  const { data } = await api.patch('/profile', updates);
  return data.data;
}

export async function getPublicProfile(userId: string): Promise<ProfileWithStats> {
  const { data } = await api.get(`/users/${userId}`);
  return data.data;
}

export async function searchUsers(query: string, limit: number = 10): Promise<Profile[]> {
  const { data } = await api.get('/profile/search', { params: { q: query, limit } });
  return data.data;
}
