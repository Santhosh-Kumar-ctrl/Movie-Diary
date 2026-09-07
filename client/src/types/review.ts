export interface Review {
  id: string;
  user_id: string;
  watchlist_entry_id: string;
  rating: number;
  review_text: string | null;
  contains_spoilers: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  watchlist_entries?: {
    title: string;
    poster_path: string | null;
    tmdb_id: number;
    media_type: string;
  };
}
