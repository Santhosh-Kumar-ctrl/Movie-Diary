create type public.activity_type as enum (
  'added_to_watchlist',
  'status_changed',
  'reviewed',
  'episode_watched',
  'season_completed'
);

create table public.activity_feed (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles(id) on delete cascade,
  activity_type      public.activity_type not null,
  watchlist_entry_id uuid references public.watchlist_entries(id) on delete cascade,
  metadata           jsonb not null default '{}',
  created_at         timestamptz not null default now()
);

create index idx_activity_user_time on public.activity_feed (user_id, created_at desc);
create index idx_activity_created on public.activity_feed (created_at desc);

alter table public.activity_feed enable row level security;

create policy "Activity visible if user is public or followed"
  on public.activity_feed for select
  using (
    auth.uid() = user_id
    or
    exists (
      select 1 from public.profiles
      where profiles.id = activity_feed.user_id
        and profiles.is_public = true
    )
    or
    exists (
      select 1 from public.follows
      where follows.follower_id = auth.uid()
        and follows.following_id = activity_feed.user_id
    )
  );

create policy "Users can insert their own activity"
  on public.activity_feed for insert
  with check (auth.uid() = user_id);
