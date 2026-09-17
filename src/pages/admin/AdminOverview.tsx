import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Film,
  Tv,
  ListVideo,
  Users,
  Tags,
  PlusCircle,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { AdminStats } from "../../types/index.js";
import { adminApi, syncApi } from "../../services/api.js";

export const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    adminApi
      .getStats()
      .then((res) => setStats(res.data.stats))
      .catch((err) => console.error("Failed to load stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSyncTmdb = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await syncApi.tmdb(2);
      const r = res.data;
      setSyncResult({
        ok: true,
        message: `${r.message} (${r.created} baru, ${r.updated} diperbarui dari ${r.total})`,
      });
      const statsRes = await adminApi.getStats();
      setStats(statsRes.data.stats);
    } catch (err: any) {
      setSyncResult({
        ok: false,
        message:
          err.response?.data?.error ||
          "Gagal sinkronisasi. Periksa TMDB_API_KEY di backend.",
      });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-32 bg-dark-900 rounded-2xl border border-dark-800"
          />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Konten",
      count: stats?.totalMovies || 0,
      icon: Film,
      color: "from-blue-600 to-indigo-600",
      link: "/admin/movies",
    },
    {
      title: "Serial Anime",
      count: stats?.totalAnime || 0,
      icon: Tv,
      color: "from-purple-600 to-pink-600",
      link: "/admin/movies",
    },
    {
      title: "Serial Drama",
      count: stats?.totalDrama || 0,
      icon: Film,
      color: "from-emerald-600 to-teal-600",
      link: "/admin/movies",
    },
    {
      title: "Total Episode",
      count: stats?.totalEpisodes || 0,
      icon: ListVideo,
      color: "from-amber-600 to-orange-600",
      link: "/admin/episodes",
    },
    {
      title: "Total Pengguna",
      count: stats?.totalUsers || 0,
      icon: Users,
      color: "from-cyan-600 to-blue-600",
      link: "/admin/users",
    },
    {
      title: "Total Genre",
      count: stats?.totalGenres || 0,
      icon: Tags,
      color: "from-rose-600 to-red-600",
      link: "/admin/genres",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Ringkasan Sistem
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Pantau metrik utama platform streaming AnimeDrama secara real-time
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="group relative overflow-hidden bg-dark-900 border border-dark-800 hover:border-dark-700 rounded-2xl p-6 transition-all hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  {card.count}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-dark-900 border border-dark-800 rounded-3xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-brand-400" />
          <span>Aksi Cepat Admin</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/movies"
            className="flex items-center space-x-3 p-4 rounded-2xl bg-dark-850 hover:bg-dark-800 border border-dark-750 text-gray-200 hover:text-white transition-colors"
          >
            <PlusCircle className="w-5 h-5 text-brand-400 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-white">Tambah Movie/Anime</p>
              <p className="text-gray-400">Buat entri konten baru</p>
            </div>
          </Link>

          <Link
            to="/admin/episodes"
            className="flex items-center space-x-3 p-4 rounded-2xl bg-dark-850 hover:bg-dark-800 border border-dark-750 text-gray-200 hover:text-white transition-colors"
          >
            <PlusCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-white">Tambah Episode</p>
              <p className="text-gray-400">Upload video link & sub</p>
            </div>
          </Link>

          <Link
            to="/admin/genres"
            className="flex items-center space-x-3 p-4 rounded-2xl bg-dark-850 hover:bg-dark-800 border border-dark-750 text-gray-200 hover:text-white transition-colors"
          >
            <PlusCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-white">Kelola Genre</p>
              <p className="text-gray-400">Kategori tayangan</p>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="flex items-center space-x-3 p-4 rounded-2xl bg-dark-850 hover:bg-dark-800 border border-dark-750 text-gray-200 hover:text-white transition-colors"
          >
            <Users className="w-5 h-5 text-cyan-400 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-white">Hak Akses User</p>
              <p className="text-gray-400">Ubah role admin/user</p>
            </div>
          </Link>

          <button
            onClick={handleSyncTmdb}
            disabled={syncing}
            className="flex items-center space-x-3 p-4 rounded-2xl bg-dark-850 hover:bg-dark-800 border border-dark-750 text-gray-200 hover:text-white transition-colors disabled:opacity-60 text-left"
          >
            <RefreshCw
              className={`w-5 h-5 text-emerald-400 shrink-0 ${
                syncing ? "animate-spin" : ""
              }`}
            />
            <div className="text-xs">
              <p className="font-semibold text-white">
                {syncing ? "Menyinkronkan..." : "Sync Katalog TMDB"}
              </p>
              <p className="text-gray-400">Perbarui poster & data dari TMDB</p>
            </div>
          </button>
        </div>

        {syncResult && (
          <div
            className={`flex items-start space-x-2 p-3 rounded-xl border text-[11px] ${
              syncResult.ok
                ? "bg-emerald-950/50 border-emerald-800/60 text-emerald-300"
                : "bg-red-950/60 border-red-800/60 text-red-300"
            }`}
          >
            {syncResult.ok ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span>{syncResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
