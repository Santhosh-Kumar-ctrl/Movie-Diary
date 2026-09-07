import type { TmdbSearchResult } from '@/types/media';
import { MediaCard } from './MediaCard';

interface MediaGridProps {
  items: TmdbSearchResult[];
}

export function MediaGrid({ items }: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">No results found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <MediaCard key={`${item.id}-${item.media_type}`} item={item} />
      ))}
    </div>
  );
}
