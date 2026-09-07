create or replace function public.log_watchlist_activity()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    insert into public.activity_feed (user_id, activity_type, watchlist_entry_id, metadata)
    values (
      new.user_id,
      'added_to_watchlist',
      new.id,
      jsonb_build_object('status', new.status, 'title', new.title, 'media_type', new.media_type, 'poster_path', new.poster_path)
    );
  elsif (TG_OP = 'UPDATE' and old.status != new.status) then
    insert into public.activity_feed (user_id, activity_type, watchlist_entry_id, metadata)
    values (
      new.user_id,
      'status_changed',
      new.id,
      jsonb_build_object('old_status', old.status, 'new_status', new.status, 'title', new.title, 'media_type', new.media_type, 'poster_path', new.poster_path)
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger watchlist_activity_trigger
  after insert or update on public.watchlist_entries
  for each row execute function public.log_watchlist_activity();

create or replace function public.log_review_activity()
returns trigger as $$
declare
  entry record;
begin
  select title, media_type, poster_path into entry
    from public.watchlist_entries where id = new.watchlist_entry_id;

  insert into public.activity_feed (user_id, activity_type, watchlist_entry_id, metadata)
  values (
    new.user_id,
    'reviewed',
    new.watchlist_entry_id,
    jsonb_build_object('rating', new.rating, 'title', entry.title, 'media_type', entry.media_type, 'poster_path', entry.poster_path)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger review_activity_trigger
  after insert on public.reviews
  for each row execute function public.log_review_activity();
