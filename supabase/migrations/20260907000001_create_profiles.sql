create extension if not exists pg_trgm;

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique not null,
  display_name text,
  avatar_url  text,
  bio         text check (char_length(bio) <= 500),
  is_public   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_profiles_username on public.profiles using gin (username gin_trgm_ops);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || left(new.id::text, 8)),
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (is_public = true);

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
