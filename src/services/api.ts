import axios from "axios";
import {
  Movie,
  Genre,
  Episode,
  WatchlistItem,
  WatchHistoryItem,
  Pagination,
  User,
  AdminStats,
} from "../types/index.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to all requests if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("animedrama_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token expiry handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401 unauthorized and route is not login/register, clear token
      const isAuthPath =
        error.config?.url?.includes("/auth/login") ||
        error.config?.url?.includes("/auth/register");
      if (!isAuthPath) {
        localStorage.removeItem("animedrama_token");
        localStorage.removeItem("animedrama_user");
      }
    }
    return Promise.reject(error);
  },
);

// =====================
// AUTH API
// =====================
export const authApi = {
  register: (data: any) =>
    api.post<{ message: string; token: string; user: User }>(
      "/auth/register",
      data,
    ),
  login: (data: any) =>
    api.post<{ message: string; token: string; user: User }>(
      "/auth/login",
      data,
    ),
  getMe: () => api.get<{ user: User }>("/auth/me"),
  updateProfile: (data: any) =>
    api.put<{ message: string; user: User }>("/auth/profile", data),
};

// =====================
// MOVIES API
// =====================
export interface MovieQueryParams {
  search?: string;
  type?: "anime" | "drama";
  genre?: string;
  year?: number | string;
  status?: string;
  sort?: "latest" | "popular" | "trending" | "year" | "title";
  page?: number;
  limit?: number;
}

export const moviesApi = {
  getAll: (params?: MovieQueryParams) =>
    api.get<{ movies: Movie[]; pagination: Pagination }>("/movies", { params }),
  getById: (id: string) =>
    api.get<{
      movie: Movie;
      userState: {
        inWatchlist: boolean;
        lastWatched: WatchHistoryItem | null;
      };
    }>(`/movies/${id}`),
  create: (data: any) =>
    api.post<{ message: string; movie: Movie }>("/movies", data),
  update: (id: string, data: any) =>
    api.put<{ message: string; movie: Movie }>(`/movies/${id}`, data),
  delete: (id: string) => api.delete<{ message: string }>(`/movies/${id}`),
};

// =====================
// GENRES API
// =====================
export const genresApi = {
  getAll: () => api.get<{ genres: Genre[] }>("/genres"),
  create: (data: { name: string; slug?: string }) =>
    api.post<{ message: string; genre: Genre }>("/genres", data),
  update: (id: string, data: { name: string; slug?: string }) =>
    api.put<{ message: string; genre: Genre }>(`/genres/${id}`, data),
  delete: (id: string) => api.delete<{ message: string }>(`/genres/${id}`),
};

// =====================
// EPISODES API
// =====================
export const episodesApi = {
  getById: (id: string) =>
    api.get<{ episode: Episode & { movie: Movie } }>(`/episodes/${id}`),
  getByMovieId: (movieId: string) =>
    api.get<{ episodes: Episode[] }>(`/movies/${movieId}/episodes`),
  create: (movieId: string, data: any) =>
    api.post<{ message: string; episode: Episode }>(
      `/movies/${movieId}/episodes`,
      data,
    ),
  update: (id: string, data: any) =>
    api.put<{ message: string; episode: Episode }>(`/episodes/${id}`, data),
  delete: (id: string) => api.delete<{ message: string }>(`/episodes/${id}`),
};

// =====================
// WATCHLIST API
// =====================
export const watchlistApi = {
  getAll: () => api.get<{ watchlist: WatchlistItem[] }>("/watchlist"),
  add: (movieId: string) =>
    api.post<{ message: string; watchlist: WatchlistItem }>("/watchlist", {
      movieId,
    }),
  remove: (movieId: string) =>
    api.delete<{ message: string }>(`/watchlist/${movieId}`),
};

// =====================
// HISTORY API
// =====================
export const historyApi = {
  getAll: () => api.get<{ history: WatchHistoryItem[] }>("/history"),
  saveProgress: (data: {
    movieId: string;
    episodeId: string;
    progress: number;
    duration: number;
    completed?: boolean;
  }) =>
    api.post<{
      message: string;
      history: WatchHistoryItem;
      progression: Pick<
        User,
        | "experience"
        | "level"
        | "currentLevelExperience"
        | "nextLevelExperience"
        | "experienceToNextLevel"
        | "progressPercent"
        | "watchTimeSeconds"
      >;
    }>("/history", data),
  delete: (episodeId: string) =>
    api.delete<{ message: string }>(`/history/${episodeId}`),
};

// =====================
// ADMIN API
// =====================
export const syncApi = {
  tmdb: (pages?: number) =>
    api.post<{
      message: string;
      created: number;
      updated: number;
      total: number;
    }>("/sync/tmdb", null, { params: { pages: pages ?? 2 } }),
};

export const adminApi = {
  getStats: () => api.get<{ stats: AdminStats }>("/stats/overview"),
  getUsers: () => api.get<{ users: User[] }>("/users"),
  updateUserRole: (id: string, role: "user" | "admin") =>
    api.put<{ message: string; user: User }>(`/users/${id}/role`, { role }),
  deleteUser: (id: string) => api.delete<{ message: string }>(`/users/${id}`),
};

export default api;
