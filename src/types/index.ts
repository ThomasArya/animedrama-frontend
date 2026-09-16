export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  avatar?: string | null;
  createdAt: string;
  _count?: {
    watchlist: number;
    history: number;
  };
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  _count?: {
    movies: number;
  };
}

export interface Episode {
  id: string;
  movieId: string;
  episodeNumber: number;
  title: string;
  videoUrl: string;
  subtitleUrl?: string | null;
  createdAt?: string;
  movie?: Movie;
}

export interface Movie {
  id: string;
  title: string;
  alternativeTitle?: string | null;
  description: string;
  poster: string;
  backdrop: string;
  type: "anime" | "drama";
  year: number;
  rating: number;
  status: "ongoing" | "completed" | "upcoming";
  genres: Genre[];
  episodes?: Episode[];
  createdAt?: string;
  _count?: {
    episodes: number;
  };
}

export interface WatchlistItem {
  id: string;
  userId: string;
  movieId: string;
  createdAt: string;
  movie: Movie;
}

export interface WatchHistoryItem {
  id: string;
  userId: string;
  movieId: string;
  episodeId: string;
  progress: number;
  duration: number;
  completed: boolean;
  lastWatched: string;
  episode: Episode & {
    movie: Movie;
  };
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminStats {
  totalMovies: number;
  totalAnime: number;
  totalDrama: number;
  totalUsers: number;
  totalEpisodes: number;
  totalGenres: number;
}
