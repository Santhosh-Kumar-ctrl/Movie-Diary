create type public.watch_status as enum ('planning', 'watching', 'watched', 'dropped');
create type public.media_type as enum ('movie', 'tv');

create table public.watchlist_entries (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  tmdb_id       integer not null,
  media_type    public.media_type not null,
  status        public.watch_status not null default 'planning',
  title         text not null,
  poster_path   text,
  overview      text,
  release_year  smallint,
  added_at      timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  unique (user_id, tmdb_id, media_type)
);

create index idx_watchlist_user_status on public.watchlist_entries (user_id, status);
create index idx_watchlist_tmdb on public.watchlist_entries (tmdb_id, media_type);

create trigger watchlist_entries_updated_at
  before update on public.watchlist_entries
  for each row execute function public.update_updated_at();

alter table public.watchlist_entries enable row level security;

create policy "Users can manage their own watchlist"
  on public.watchlist_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Public watchlists are viewable"
  on public.watchlist_entries for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = watchlist_entries.user_id
        and profiles.is_public = true
    )
  );
