import { useQuery } from '@tanstack/react-query';
import { getReviewsForTitle } from '@/api/reviews';
import { StarRating } from '@/components/ui/StarRating';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';

interface ReviewListProps {
  mediaType: string;
  tmdbId: number;
}

export function ReviewList({ mediaType, tmdbId }: ReviewListProps) {
  const [revealedSpoilers, setRevealedSpoilers] = useState<Set<string>>(new Set());

  const { data } = useQuery({
    queryKey: ['reviews', 'title', mediaType, tmdbId],
    queryFn: () => getReviewsForTitle(mediaType, tmdbId),
    staleTime: 60 * 1000,
  });

  const reviews = data?.reviews ?? [];

  if (reviews.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">
        Reviews ({data?.total ?? 0})
      </h2>

      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-sm font-medium text-white">
                {review.profiles?.avatar_url ? (
                  <img src={review.profiles.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                  (review.profiles?.username?.[0] ?? '?').toUpperCase()
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {review.profiles?.display_name || review.profiles?.username || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-500">{formatDate(review.created_at)}</p>
              </div>
              <div className="ml-auto">
                <StarRating value={review.rating} readonly size="sm" />
              </div>
            </div>

            {review.review_text && (
              <div className="mt-3">
                {review.contains_spoilers && !revealedSpoilers.has(review.id) ? (
                  <button
                    onClick={() => setRevealedSpoilers((prev) => new Set(prev).add(review.id))}
                    className="text-sm text-gray-500 hover:text-gray-300"
                  >
                    This review contains spoilers. Click to reveal.
                  </button>
                ) : (
                  <p className="text-sm text-gray-300">{review.review_text}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
