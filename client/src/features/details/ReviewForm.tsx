import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StarRating } from '@/components/ui/StarRating';
import { getMyReview, createReview, updateReview, deleteReview } from '@/api/reviews';
import { useUiStore } from '@/store/uiStore';

interface ReviewFormProps {
  entryId: string;
}

export function ReviewForm({ entryId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [spoilers, setSpoilers] = useState(false);
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();
  const addToast = useUiStore((s) => s.addToast);

  const { data: existingReview } = useQuery({
    queryKey: ['reviews', 'mine', entryId],
    queryFn: () => getMyReview(entryId),
  });

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setText(existingReview.review_text || '');
      setSpoilers(existingReview.contains_spoilers);
    }
  }, [existingReview]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['reviews'] });
  };

  const createMutation = useMutation({
    mutationFn: () => createReview(entryId, { rating, review_text: text || null, contains_spoilers: spoilers }),
    onSuccess: () => { invalidate(); addToast('Review posted!', 'success'); },
    onError: () => addToast('Failed to post review', 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: () => updateReview(existingReview!.id, { rating, review_text: text || null, contains_spoilers: spoilers }),
    onSuccess: () => { invalidate(); setEditing(false); addToast('Review updated!', 'success'); },
    onError: () => addToast('Failed to update review', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteReview(existingReview!.id),
    onSuccess: () => {
      invalidate();
      setRating(0);
      setText('');
      setSpoilers(false);
      addToast('Review deleted', 'info');
    },
    onError: () => addToast('Failed to delete review', 'error'),
  });

  if (existingReview && !editing) {
    return (
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Your Review</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-indigo-400 hover:text-indigo-300"
            >
              Edit
            </button>
            <button
              onClick={() => deleteMutation.mutate()}
              className="text-sm text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        </div>
        <div className="mt-3">
          <StarRating value={existingReview.rating} readonly size="md" />
        </div>
        {existingReview.review_text && (
          <p className="mt-3 text-sm text-gray-300">{existingReview.review_text}</p>
        )}
        {existingReview.contains_spoilers && (
          <span className="mt-2 inline-block rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
            Contains spoilers
          </span>
        )}
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    if (existingReview) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h3 className="font-semibold text-white">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm text-gray-400">Rating</label>
          <div className="mt-1">
            <StarRating value={rating} onChange={setRating} size="lg" />
          </div>
        </div>

        <div>
          <label htmlFor="review-text" className="block text-sm text-gray-400">
            Review (optional)
          </label>
          <textarea
            id="review-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={2000}
            rows={4}
            className="mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="What did you think?"
          />
          <p className="mt-1 text-right text-xs text-gray-600">{text.length}/2000</p>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-400">
          <input
            type="checkbox"
            checked={spoilers}
            onChange={(e) => setSpoilers(e.target.checked)}
            className="rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
          />
          Contains spoilers
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={rating === 0 || isPending}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : existingReview ? 'Update Review' : 'Post Review'}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-sm text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
