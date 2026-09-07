create table public.reviews (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles(id) on delete cascade,
  watchlist_entry_id uuid not null references public.watchlist_entries(id) on delete cascade,
  rating             smallint not null check (rating >= 1 and rating <= 10),
  review_text        text check (char_length(review_text) <= 2000),
  contains_spoilers  boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  unique (user_id, watchlist_entry_id)
);

create index idx_reviews_entry on public.reviews (watchlist_entry_id);
create index idx_reviews_user on public.reviews (user_id, created_at desc);

create trigger reviews_updated_at
  before update on public.reviews
  for each row execute function public.update_updated_at();

alter table public.reviews enable row level security;

create policy "Users can manage their own reviews"
  on public.reviews for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Reviews on public profiles are viewable"
  on public.reviews for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = reviews.user_id
        and profiles.is_public = true
    )
  );
