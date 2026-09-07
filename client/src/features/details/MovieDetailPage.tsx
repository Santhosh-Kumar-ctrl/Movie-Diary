import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMovie } from '@/api/tmdb';
import { tmdbImage, yearFromDate } from '@/lib/utils';
import { Spinner } from '@/components/ui/Spinner';
import { MediaGrid } from '@/components/media/MediaGrid';
import { StatusSelector } from '@/features/watchlist/StatusSelector';
import { useWatchlistEntry } from '@/features/watchlist/useWatchlist';
import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';

export default function MovieDetailPage() {
  const { tmdbId } = useParams<{ tmdbId: string }>();
  const { data: watchlistEntry } = useWatchlistEntry('movie', Number(tmdbId));

  const { data: movie, isLoading } = useQuery({
    queryKey: ['tmdb', 'movie', tmdbId],
    queryFn: () => getMovie(Number(tmdbId)),
    staleTime: 30 * 60 * 1000,
  });

  if (isLoading || !movie) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const year = yearFromDate(movie.release_date);
  const hours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const mins = movie.runtime ? movie.runtime % 60 : 0;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl">
        {movie.backdrop_path && (
          <div className="absolute inset-0">
            <img
              src={tmdbImage(movie.backdrop_path, 'w780')}
              alt=""
              className="h-full w-full object-cover opacity-20 blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
          </div>
        )}

        <div className="relative flex flex-col gap-8 p-8 md:flex-row">
          <div className="w-48 shrink-0 self-start">
            <img
              src={tmdbImage(movie.poster_path, 'w342')}
              alt={movie.title}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                {year && <span>{year}</span>}
                {movie.runtime && (
                  <>
                    <span>&middot;</span>
                    <span>{hours}h {mins}m</span>
                  </>
                )}
                {movie.vote_average > 0 && (
                  <>
                    <span>&middot;</span>
                    <span className="text-yellow-400">{movie.vote_average.toFixed(1)}/10</span>
                  </>
                )}
              </div>
            </div>

            {movie.genres && movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {movie.overview && (
              <p className="leading-relaxed text-gray-300">{movie.overview}</p>
            )}

            <StatusSelector
              tmdbId={movie.id}
              mediaType="movie"
              title={movie.title}
              posterPath={movie.poster_path}
              overview={movie.overview}
              releaseDate={movie.release_date}
            />
          </div>
        </div>
      </div>

      {movie.credits?.cast && movie.credits.cast.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {movie.credits.cast.slice(0, 10).map((person) => (
              <div key={person.id} className="w-24 shrink-0 text-center">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-gray-800">
                  {person.profile_path ? (
                    <img
                      src={tmdbImage(person.profile_path, 'w185')}
                      alt={person.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl text-gray-600">
                      {person.name[0]}
                    </div>
                  )}
                </div>
                <p className="mt-2 truncate text-xs font-medium text-white">{person.name}</p>
                <p className="truncate text-xs text-gray-500">{person.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {watchlistEntry && (
        <ReviewForm entryId={watchlistEntry.id} />
      )}

      <ReviewList mediaType="movie" tmdbId={movie.id} />

      {movie.similar?.results && movie.similar.results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Similar Movies</h2>
          <MediaGrid items={movie.similar.results.slice(0, 6).map((m) => ({ ...m, media_type: 'movie' as const }))} />
        </div>
      )}
    </div>
  );
}
