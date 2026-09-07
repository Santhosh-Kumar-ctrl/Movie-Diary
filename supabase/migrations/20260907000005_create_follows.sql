create table public.follows (
  follower_id  uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at   timestamptz not null default now(),

  primary key (follower_id, following_id),
  check (follower_id != following_id)
);

create index idx_follows_following on public.follows (following_id);

alter table public.follows enable row level security;

create policy "Anyone authenticated can see follow relationships"
  on public.follows for select
  using (auth.role() = 'authenticated');

create policy "Users can follow others"
  on public.follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on public.follows for delete
  using (auth.uid() = follower_id);
