import { api } from './client';
import type { Review } from '@/types/review';

export async function getMyReview(entryId: string): Promise<Review | null> {
  const { data } = await api.get(`/reviews/entry/${entryId}`);
  return data.data;
}

export async function createReview(entryId: string, review: {
  rating: number;
  review_text?: string | null;
  contains_spoilers?: boolean;
}): Promise<Review> {
  const { data } = await api.post(`/reviews/entry/${entryId}`, review);
  return data.data;
}

export async function updateReview(reviewId: string, review: {
  rating?: number;
  review_text?: string | null;
  contains_spoilers?: boolean;
}): Promise<Review> {
  const { data } = await api.patch(`/reviews/${reviewId}`, review);
  return data.data;
}

export async function deleteReview(reviewId: string): Promise<void> {
  await api.delete(`/reviews/${reviewId}`);
}

export async function getReviewsForTitle(mediaType: string, tmdbId: number, page: number = 1): Promise<{
  reviews: Review[];
  total: number;
}> {
  const { data } = await api.get(`/tmdb/${mediaType}/${tmdbId}/reviews`, { params: { page } });
  return data.data;
}
