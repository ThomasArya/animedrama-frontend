import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  User as UserIcon,
  Bookmark,
  History,
  Settings,
  Trash2,
  Play,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { WatchlistItem, WatchHistoryItem } from "../types/index.js";
import { watchlistApi, historyApi, authApi } from "../services/api.js";
import { useAuth } from "../context/AuthContext.js";
import { MovieCard } from "../components/MovieCard.js";

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const location = useLocation();

  // Tab selection: 'watchlist' | 'history' | 'settings'
  const [activeTab, setActiveTab] = useState<
    "watchlist" | "history" | "settings"
  >("watchlist");

  // Watchlist & History state
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [loadingWatchlist, setLoadingWatchlist] = useState<boolean>(true);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);

  // Settings form state
  const [usernameInput, setUsernameInput] = useState<string>(
    user?.username || "",
  );
  const [avatarInput, setAvatarInput] = useState<string>(user?.avatar || "");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [settingsMessage, setSettingsMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Parse hash on load
  useEffect(() => {
    if (location.hash === "#history") {
      setActiveTab("history");
    } else if (location.hash === "#settings") {
      setActiveTab("settings");
    } else {
      setActiveTab("watchlist");
    }
  }, [location.hash]);

  // Load Watchlist
  const loadWatchlist = async () => {
    setLoadingWatchlist(true);
    try {
      const res = await watchlistApi.getAll();
      setWatchlist(res.data.watchlist);
    } catch (e) {
      console.error("Failed to load watchlist:", e);
    } finally {
      setLoadingWatchlist(false);
    }
  };

  // Load History
  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await historyApi.getAll();
      setHistory(res.data.history);
    } catch (e) {
      console.error("Failed to load history:", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
    loadHistory();
  }, []);

  const handleRemoveWatchlist = async (movieId: string) => {
    try {
      await watchlistApi.remove(movieId);
      setWatchlist((prev) => prev.filter((item) => item.movieId !== movieId));
    } catch (e) {
      console.error("Failed to remove from watchlist:", e);
    }
  };

  const handleDeleteHistory = async (episodeId: string) => {
    try {
      await historyApi.delete(episodeId);
      setHistory((prev) => prev.filter((item) => item.episodeId !== episodeId));
    } catch (e) {
      console.error("Failed to delete history item:", e);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsMessage(null);

    try {
      const payload: any = {
        username: usernameInput,
        avatar: avatarInput,
      };
      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await authApi.updateProfile(payload);
      updateUser(res.data.user);
      setSettingsMessage({
        type: "success",
        text: "Profil berhasil diperbarui!",
      });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setSettingsMessage({
        type: "error",
        text: err.response?.data?.error || "Gagal memperbarui profil.",
      });
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xl">
        <img
          src={
            user?.avatar ||
            `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`
          }
          alt={user?.username}
          className="w-24 h-24 rounded-full border-2 border-brand-500 shadow-lg object-cover bg-dark-800"
        />
        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {user?.username}
            </h1>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit mx-auto sm:mx-0 ${
                user?.role === "admin"
                  ? "bg-purple-600/30 text-purple-300 border border-purple-500/40"
                  : "bg-brand-600/30 text-brand-300 border border-brand-500/40"
              }`}
            >
              {user?.role === "admin" ? "Administrator" : "Member Pengguna"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">{user?.email}</p>
          <div className="flex items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-gray-300">
            <div>
              <strong className="text-white font-bold">
                {watchlist.length}
              </strong>{" "}
              Dalam Watchlist
            </div>
            <span>•</span>
            <div>
              <strong className="text-white font-bold">{history.length}</strong>{" "}
              Riwayat Ditonton
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-dark-800 pb-2">
        <button
          onClick={() => setActiveTab("watchlist")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === "watchlist"
              ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
              : "text-gray-400 hover:text-white hover:bg-dark-900"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Watchlist Saya ({watchlist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === "history"
              ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
              : "text-gray-400 hover:text-white hover:bg-dark-900"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Riwayat Tontonan ({history.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            activeTab === "settings"
              ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
              : "text-gray-400 hover:text-white hover:bg-dark-900"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan Akun</span>
        </button>
      </div>

      {/* TAB 1: WATCHLIST */}
      {activeTab === "watchlist" && (
        <div>
          {loadingWatchlist ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] bg-dark-900 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : watchlist.length === 0 ? (
            <div className="text-center py-16 bg-dark-900 border border-dark-800 rounded-2xl space-y-3">
              <Bookmark className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="text-base font-semibold text-white">
                Watchlist Masih Kosong
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Anda belum menyimpan anime atau drama apa pun. Tambahkan judul
                favorit Anda untuk ditonton nanti.
              </p>
              <Link
                to="/catalog"
                className="inline-block px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Cari Konten Menarik
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {watchlist.map((item) => (
                <div key={item.id} className="relative group">
                  <MovieCard
                    movie={item.movie}
                    inWatchlistInitial={true}
                    onWatchlistToggle={(id) => handleRemoveWatchlist(id)}
                  />
                  <button
                    onClick={() => handleRemoveWatchlist(item.movieId)}
                    title="Hapus dari Watchlist"
                    className="absolute bottom-2 right-2 p-1.5 bg-red-950/80 hover:bg-red-800 text-red-300 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: HISTORY */}
      {activeTab === "history" && (
        <div>
          {loadingHistory ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-dark-900 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-16 bg-dark-900 border border-dark-800 rounded-2xl space-y-3">
              <History className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="text-base font-semibold text-white">
                Belum Ada Riwayat Tontonan
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                Setiap episode yang Anda tonton akan otomatis tersimpan di sini
                beserta progresnya.
              </p>
              <Link
                to="/"
                className="inline-block px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Mulai Nonton Sekarang
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                const percent =
                  item.duration > 0
                    ? Math.min(
                        100,
                        Math.round((item.progress / item.duration) * 100),
                      )
                    : 0;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-dark-900 border border-dark-800 hover:border-dark-700 rounded-2xl transition-all"
                  >
                    <Link
                      to={`/watch/${item.episodeId}`}
                      className="flex items-center space-x-4 flex-1 min-w-0"
                    >
                      <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-dark-800 shrink-0">
                        <img
                          src={item.episode.movie?.poster}
                          alt={item.episode.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-dark-950/40 flex items-center justify-center">
                          <Play className="w-5 h-5 fill-white text-white" />
                        </div>
                        {/* Progress line */}
                        <div className="absolute bottom-0 inset-x-0 h-1 bg-dark-950">
                          <div
                            className="h-full bg-brand-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-white truncate">
                          {item.episode.movie?.title}
                        </h4>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          Episode {item.episode.episodeNumber}:{" "}
                          {item.episode.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1 text-[11px] text-gray-400">
                          <span>Progres: {percent}%</span>
                          <span>•</span>
                          <span>
                            {new Date(item.lastWatched).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="flex items-center space-x-2 pl-3">
                      <Link
                        to={`/watch/${item.episodeId}`}
                        className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        Lanjut
                      </Link>
                      <button
                        onClick={() => handleDeleteHistory(item.episodeId)}
                        title="Hapus dari Riwayat"
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-dark-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SETTINGS */}
      {activeTab === "settings" && (
        <div className="max-w-xl bg-dark-900 border border-dark-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Perbarui Informasi Akun
          </h2>

          {settingsMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                settingsMessage.type === "success"
                  ? "bg-emerald-950/60 border border-emerald-800/60 text-emerald-300"
                  : "bg-red-950/60 border border-red-800/60 text-red-300"
              }`}
            >
              {settingsMessage.type === "success" ? (
                <CheckCircle className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{settingsMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                required
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatarInput}
                onChange={(e) => setAvatarInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="pt-4 border-t border-dark-800 space-y-4">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Ganti Password (Opsional)
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Password Saat Ini
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password lama"
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-sm text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md shadow-brand-600/30 disabled:opacity-50"
            >
              {savingSettings ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
