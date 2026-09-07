export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileWithStats extends Profile {
  stats: {
    planning: number;
    watching: number;
    watched: number;
    dropped: number;
    total_reviews: number;
    followers: number;
    following: number;
  };
}

export interface ActivityItem {
  id: string;
  user_id: string;
  activity_type: 'added_to_watchlist' | 'status_changed' | 'reviewed' | 'episode_watched' | 'season_completed';
  watchlist_entry_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  profiles?: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}
