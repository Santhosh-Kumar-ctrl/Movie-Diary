import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTvShow } from '@/api/tmdb';
import { tmdbImage, yearFromDate } from '@/lib/utils';
import { Spinner } from '@/components/ui/Spinner';
import { MediaGrid } from '@/components/media/MediaGrid';
import { StatusSelector } from '@/features/watchlist/StatusSelector';
import { useWatchlistEntry } from '@/features/watchlist/useWatchlist';
import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';
import { SeasonAccordion } from './SeasonAccordion';

export default function TvDetailPage() {
  const { tmdbId } = useParams<{ tmdbId: string }>();
  const { data: watchlistEntry } = useWatchlistEntry('tv', Number(tmdbId));

  const { data: show, isLoading } = useQuery({
    queryKey: ['tmdb', 'tv', tmdbId],
    queryFn: () => getTvShow(Number(tmdbId)),
    staleTime: 30 * 60 * 1000,
  });

  if (isLoading || !show) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const year = yearFromDate(show.first_air_date);

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl">
        {show.backdrop_path && (
          <div className="absolute inset-0">
            <img
              src={tmdbImage(show.backdrop_path, 'w780')}
              alt=""
              className="h-full w-full object-cover opacity-20 blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent" />
          </div>
        )}

        <div className="relative flex flex-col gap-8 p-8 md:flex-row">
          <div className="w-48 shrink-0 self-start">
            <img
              src={tmdbImage(show.poster_path, 'w342')}
              alt={show.name}
              className="w-full rounded-lg shadow-2xl"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{show.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
                {year && <span>{year}</span>}
                <span>&middot;</span>
                <span>{show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}</span>
                <span>&middot;</span>
                <span>{show.number_of_episodes} Episodes</span>
                {show.vote_average > 0 && (
                  <>
                    <span>&middot;</span>
                    <span className="text-yellow-400">{show.vote_average.toFixed(1)}/10</span>
                  </>
                )}
              </div>
            </div>

            {show.genres && show.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {show.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {show.overview && (
              <p className="leading-relaxed text-gray-300">{show.overview}</p>
            )}

            <StatusSelector
              tmdbId={show.id}
              mediaType="tv"
              title={show.name}
              posterPath={show.poster_path}
              overview={show.overview}
              releaseDate={show.first_air_date}
            />
          </div>
        </div>
      </div>

      {show.seasons && show.seasons.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Seasons</h2>
          <div className="space-y-3">
            {show.seasons
              .filter((s) => s.season_number > 0)
              .map((season) =>
                watchlistEntry ? (
                  <SeasonAccordion
                    key={season.id}
                    tmdbId={show.id}
                    season={season}
                    entryId={watchlistEntry.id}
                  />
                ) : (
                  <div
                    key={season.id}
                    className="flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900 p-4"
                  >
                    <div className="h-20 w-14 shrink-0 overflow-hidden rounded bg-gray-800">
                      {season.poster_path ? (
                        <img
                          src={tmdbImage(season.poster_path, 'w185')}
                          alt={season.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-gray-600">
                          S{season.season_number}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{season.name}</h3>
                      <p className="text-sm text-gray-400">
                        {season.episode_count} episode{season.episode_count !== 1 ? 's' : ''}
                        {season.air_date && ` · ${yearFromDate(season.air_date)}`}
                      </p>
                    </div>
                  </div>
                ),
              )}
          </div>
        </div>
      )}

      {show.credits?.cast && show.credits.cast.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {show.credits.cast.slice(0, 10).map((person) => (
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

      <ReviewList mediaType="tv" tmdbId={show.id} />

      {show.similar?.results && show.similar.results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Similar Shows</h2>
          <MediaGrid items={show.similar.results.slice(0, 6).map((s) => ({ ...s, media_type: 'tv' as const }))} />
        </div>
      )}
    </div>
  );
}
