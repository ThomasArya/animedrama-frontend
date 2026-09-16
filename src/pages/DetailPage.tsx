import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Play,
  Star,
  Bookmark,
  Check,
  Calendar,
  Layers,
  ArrowLeft,
  Tv,
} from "lucide-react";
import { Movie, Episode, WatchHistoryItem } from "../types/index.js";
import { moviesApi, watchlistApi } from "../services/api.js";
import { useAuth } from "../context/AuthContext.js";

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);
  const [lastWatched, setLastWatched] = useState<WatchHistoryItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingWatchlist, setLoadingWatchlist] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await moviesApi.getById(id);
        setMovie(res.data.movie);
        setInWatchlist(res.data.userState?.inWatchlist || false);
        setLastWatched(res.data.userState?.lastWatched || null);
      } catch (err: any) {
        console.error("Failed to load detail:", err);
        setError(
          "Gagal memuat detail konten. Kemungkinan ID konten tidak valid.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, isAuthenticated]);

  const handleWatchlistToggle = async () => {
    if (!movie) return;
    if (!isAuthenticated) {
      alert("Silakan login terlebih dahulu untuk menyimpan ke Watchlist.");
      navigate("/login");
      return;
    }

    setLoadingWatchlist(true);
    try {
      if (inWatchlist) {
        await watchlistApi.remove(movie.id);
        setInWatchlist(false);
      } else {
        await watchlistApi.add(movie.id);
        setInWatchlist(true);
      }
    } catch (err) {
      console.error("Watchlist toggle error:", err);
    } finally {
      setLoadingWatchlist(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-[40vh] bg-dark-900 rounded-3xl" />
          <div className="h-8 bg-dark-900 rounded w-1/3" />
          <div className="h-4 bg-dark-900 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="p-6 bg-dark-900 border border-dark-800 rounded-2xl max-w-md space-y-4">
          <p className="text-red-400 text-sm">
            {error || "Konten tidak ditemukan."}
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </Link>
        </div>
      </div>
    );
  }

  const episodes = movie.episodes || [];
  // Determine start episode (either resume last watched episode or episode 1)
  const resumeEpisodeId =
    lastWatched?.episodeId || (episodes.length > 0 ? episodes[0].id : null);

  return (
    <div className="space-y-8 pb-20">
      {/* Backdrop Hero Header */}
      <div className="relative w-full h-[50vh] min-h-[380px] max-h-[550px] overflow-hidden">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover object-center filter brightness-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/90 via-dark-950/50 to-transparent" />

        <div className="absolute top-4 left-4 sm:left-8 z-20">
          <Link
            to="/catalog"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-dark-900/80 backdrop-blur-md text-gray-300 hover:text-white text-xs font-medium border border-dark-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Link>
        </div>
      </div>

      {/* Main Metadata Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 relative z-20">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Column */}
          <div className="w-48 sm:w-64 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-dark-700 bg-dark-900 mx-auto md:mx-0">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover aspect-[2/3]"
            />
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                  movie.type === "anime"
                    ? "bg-purple-600/90 text-purple-100"
                    : "bg-emerald-600/90 text-emerald-100"
                }`}
              >
                {movie.type}
              </span>

              <span
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold capitalize ${
                  movie.status === "ongoing"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                }`}
              >
                {movie.status}
              </span>

              <div className="flex items-center space-x-1 text-yellow-400 text-xs font-semibold bg-dark-900 px-2.5 py-1 rounded-md border border-dark-800">
                <Star className="w-3.5 h-3.5 fill-yellow-400" />
                <span>{movie.rating.toFixed(1)} / 10</span>
              </div>

              <div className="flex items-center space-x-1 text-gray-300 text-xs bg-dark-900 px-2.5 py-1 rounded-md border border-dark-800">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{movie.year}</span>
              </div>

              <div className="flex items-center space-x-1 text-gray-300 text-xs bg-dark-900 px-2.5 py-1 rounded-md border border-dark-800">
                <Layers className="w-3.5 h-3.5 text-gray-400" />
                <span>{episodes.length} Episode</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {movie.title}
            </h1>

            {movie.alternativeTitle && (
              <p className="text-base text-gray-400 font-medium">
                {movie.alternativeTitle}
              </p>
            )}

            {/* Genre Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {movie.genres?.map((genre) => (
                <Link
                  key={genre.id}
                  to={`/catalog?genre=${genre.slug}`}
                  className="px-3 py-1 bg-dark-850 hover:bg-dark-800 border border-dark-700 text-xs text-brand-300 rounded-full transition-colors"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {resumeEpisodeId ? (
                <Link
                  to={`/watch/${resumeEpisodeId}`}
                  className="flex items-center space-x-2 px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-lg shadow-brand-600/30 transition-all hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>
                    {lastWatched
                      ? `Lanjut Ep ${lastWatched.episode.episodeNumber}`
                      : "Mulai Menonton (Ep 1)"}
                  </span>
                </Link>
              ) : (
                <button
                  disabled
                  className="px-6 py-3 rounded-full bg-dark-800 text-gray-400 font-medium text-sm cursor-not-allowed"
                >
                  Episode Belum Tersedia
                </button>
              )}

              <button
                onClick={handleWatchlistToggle}
                disabled={loadingWatchlist}
                className={`flex items-center space-x-2 px-5 py-3 rounded-full border text-sm font-medium transition-all ${
                  inWatchlist
                    ? "bg-dark-800 text-emerald-400 border-emerald-500/50"
                    : "bg-dark-900 hover:bg-dark-800 text-white border-dark-700"
                }`}
              >
                {inWatchlist ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span>
                  {inWatchlist ? "Ada di Watchlist" : "Tambah ke Watchlist"}
                </span>
              </button>
            </div>

            {/* Last watched progress banner */}
            {lastWatched && (
              <div className="p-3 bg-dark-900/90 border border-brand-500/30 rounded-xl max-w-md flex items-center justify-between text-xs text-gray-300">
                <div>
                  <span className="text-brand-400 font-semibold">
                    Terakhir ditonton:{" "}
                  </span>
                  <span>
                    Ep {lastWatched.episode.episodeNumber}:{" "}
                    {lastWatched.episode.title}
                  </span>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {lastWatched.duration > 0
                      ? `${Math.round((lastWatched.progress / lastWatched.duration) * 100)}% selesai`
                      : "Baru ditonton"}
                  </div>
                </div>
                <Link
                  to={`/watch/${lastWatched.episodeId}`}
                  className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-medium transition-colors ml-3 shrink-0"
                >
                  Lanjut
                </Link>
              </div>
            )}

            {/* Synopsis */}
            <div className="pt-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Sinopsis
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-3xl">
                {movie.description}
              </p>
            </div>
          </div>
        </div>

        {/* Episode List Section */}
        <section className="mt-14 pt-8 border-t border-dark-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <Tv className="w-6 h-6 text-brand-400" />
              <span>Daftar Episode ({episodes.length})</span>
            </h2>
          </div>

          {episodes.length === 0 ? (
            <div className="text-center py-12 bg-dark-900 rounded-2xl border border-dark-800">
              <p className="text-sm text-gray-400">
                Belum ada episode yang diunggah untuk judul ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {episodes.map((ep: Episode) => {
                const isWatched = lastWatched?.episodeId === ep.id;
                return (
                  <Link
                    key={ep.id}
                    to={`/watch/${ep.id}`}
                    className={`group relative p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                      isWatched
                        ? "bg-dark-850 border-brand-500/50 hover:border-brand-500"
                        : "bg-dark-900 border-dark-800 hover:border-dark-700 hover:bg-dark-850"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2 py-1 rounded bg-dark-800 text-brand-400 font-bold text-xs border border-dark-700">
                        EP {ep.episodeNumber}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-brand-600/20 text-brand-400 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition-colors">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>

                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-2">
                        {ep.title}
                      </h4>
                      {isWatched && (
                        <span className="inline-block mt-2 text-[11px] text-brand-400 font-medium">
                          Sedang ditonton
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
