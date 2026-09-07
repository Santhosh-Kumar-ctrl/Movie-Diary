create table public.episode_progress (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles(id) on delete cascade,
  watchlist_entry_id uuid not null references public.watchlist_entries(id) on delete cascade,
  season_number      integer not null check (season_number >= 0),
  episode_number     integer not null check (episode_number >= 1),
  watched            boolean not null default false,
  watched_at         timestamptz,

  unique (user_id, watchlist_entry_id, season_number, episode_number)
);

create index idx_episode_progress_entry
  on public.episode_progress (watchlist_entry_id, season_number, episode_number);

alter table public.episode_progress enable row level security;

create policy "Users can manage their own episode progress"
  on public.episode_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Episode progress on public profiles is viewable"
  on public.episode_progress for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = episode_progress.user_id
        and profiles.is_public = true
    )
  );
