import { Link } from 'react-router-dom';
import { tmdbImage, yearFromDate } from '@/lib/utils';
import type { TmdbSearchResult } from '@/types/media';

interface MediaCardProps {
  item: TmdbSearchResult;
}

export function MediaCard({ item }: MediaCardProps) {
  const title = item.title || item.name || 'Unknown';
  const date = item.release_date || item.first_air_date;
  const year = yearFromDate(date);
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const linkTo = mediaType === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;

  return (
    <Link to={linkTo} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800">
        {item.poster_path ? (
          <img
            src={tmdbImage(item.poster_path, 'w342')}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-600">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
            </svg>
          </div>
        )}

        <div className="absolute top-2 right-2">
          <span className="rounded bg-gray-900/80 px-1.5 py-0.5 text-xs font-medium text-gray-200 uppercase">
            {mediaType}
          </span>
        </div>

        {item.vote_average > 0 && (
          <div className="absolute bottom-2 left-2">
            <span className="rounded bg-gray-900/80 px-1.5 py-0.5 text-xs font-medium text-yellow-400">
              {item.vote_average.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-2">
        <h3 className="truncate text-sm font-medium text-white group-hover:text-indigo-400">
          {title}
        </h3>
        {year && <p className="text-xs text-gray-500">{year}</p>}
      </div>
    </Link>
  );
}
