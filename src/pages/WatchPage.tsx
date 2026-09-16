import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Tv,
  AlertCircle,
  Play,
} from "lucide-react";
import { Episode, Movie } from "../types/index.js";
import { episodesApi, historyApi } from "../services/api.js";
import { useAuth } from "../context/AuthContext.js";

export const WatchPage: React.FC = () => {
  const { episodeId } = useParams<{ episodeId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [episode, setEpisode] = useState<(Episode & { movie: Movie }) | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [savedTime, setSavedTime] = useState<number>(0);
  const [initialSeekDone, setInitialSeekDone] = useState<boolean>(false);

  // Load episode data
  useEffect(() => {
    if (!episodeId) return;

    const fetchEpisode = async () => {
      setLoading(true);
      setError(null);
      setInitialSeekDone(false);

      try {
        const res = await episodesApi.getById(episodeId);
        setEpisode(res.data.episode);

        // If authenticated, check previous progress
        if (isAuthenticated) {
          try {
            const histRes = await historyApi.getAll();
            const existing = histRes.data.history.find(
              (h) => h.episodeId === episodeId,
            );
            if (existing && existing.progress > 0 && !existing.completed) {
              setSavedTime(existing.progress);
            }
          } catch (e) {
            console.error("Failed to get existing history for episode:", e);
          }
        }
      } catch (err: any) {
        console.error("Failed to load episode:", err);
        setError(
          "Gagal memuat video episode. Kemungkinan URL tidak valid atau sudah dihapus.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [episodeId, isAuthenticated]);

  // Set initial seek once video metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current && savedTime > 0 && !initialSeekDone) {
      videoRef.current.currentTime = savedTime;
      setInitialSeekDone(true);
    }
  };

  // Sync watch progress to server periodically
  const syncProgress = async (
    currentTime: number,
    duration: number,
    isCompleted: boolean = false,
  ) => {
    if (!isAuthenticated || !episode) return;
    if (duration <= 0) return;

    try {
      await historyApi.saveProgress({
        movieId: episode.movieId,
        episodeId: episode.id,
        progress: currentTime,
        duration: duration,
        completed: isCompleted,
      });
    } catch (e) {
      // Background sync errors shouldn't crash the video
      console.debug("Failed to sync watch progress:", e);
    }
  };

  // Sync every 5 seconds while playing
  const lastSyncRef = useRef<number>(0);
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;

    if (Date.now() - lastSyncRef.current > 5000) {
      lastSyncRef.current = Date.now();
      syncProgress(current, duration, false);
    }
  };

  const handleEnded = () => {
    if (!videoRef.current || !episode) return;
    syncProgress(videoRef.current.duration, videoRef.current.duration, true);

    // Auto next episode if available
    if (nextEpisode) {
      navigate(`/watch/${nextEpisode.id}`);
    }
  };

  const handlePause = () => {
    if (!videoRef.current || !episode) return;
    syncProgress(
      videoRef.current.currentTime,
      videoRef.current.duration,
      false,
    );
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-dark-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500" />
          <p className="text-gray-400 text-sm">Menyiapkan pemutar video...</p>
        </div>
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="p-6 bg-dark-900 border border-dark-800 rounded-2xl max-w-md space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-red-400 text-sm">
            {error || "Episode tidak ditemukan."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-xl text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>
      </div>
    );
  }

  const allEpisodes = episode.movie?.episodes || [];
  const currentIndex = allEpisodes.findIndex((e) => e.id === episode.id);
  const prevEpisode = currentIndex > 0 ? allEpisodes[currentIndex - 1] : null;
  const nextEpisode =
    currentIndex >= 0 && currentIndex < allEpisodes.length - 1
      ? allEpisodes[currentIndex + 1]
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Bar with back to detail */}
      <div className="flex items-center justify-between">
        <Link
          to={`/detail/${episode.movieId}`}
          className="inline-flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Konten</span>
        </Link>
        <span className="text-xs text-brand-400 font-semibold px-2.5 py-1 bg-brand-500/10 border border-brand-500/20 rounded-md">
          {episode.movie?.title}
        </span>
      </div>

      {/* Main Player Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 cols: Video & Controls */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-dark-800">
            <video
              ref={videoRef}
              src={episode.videoUrl}
              controls
              autoPlay
              playsInline
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onPause={handlePause}
              onEnded={handleEnded}
              className="w-full h-full object-contain"
            >
              {episode.subtitleUrl && (
                <track
                  label="Indonesia"
                  kind="subtitles"
                  srcLang="id"
                  src={episode.subtitleUrl}
                  default
                />
              )}
              Browser Anda tidak mendukung pemutar video HTML5.
            </video>
          </div>

          {/* Navigation Controls: Prev & Next */}
          <div className="flex items-center justify-between bg-dark-900 border border-dark-800 rounded-xl p-3">
            <div>
              {prevEpisode ? (
                <Link
                  to={`/watch/${prevEpisode.id}`}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-xs font-medium text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Ep {prevEpisode.episodeNumber} Sebelumnya</span>
                </Link>
              ) : (
                <button
                  disabled
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-dark-850 text-xs font-medium text-gray-400 cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Episode Pertama</span>
                </button>
              )}
            </div>

            <div className="text-center">
              <span className="text-xs text-gray-400">
                Episode {episode.episodeNumber} dari {allEpisodes.length}
              </span>
            </div>

            <div>
              {nextEpisode ? (
                <Link
                  to={`/watch/${nextEpisode.id}`}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white transition-colors shadow-md shadow-brand-600/20"
                >
                  <span>Ep {nextEpisode.episodeNumber} Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  disabled
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-dark-850 text-xs font-medium text-gray-400 cursor-not-allowed"
                >
                  <span>Episode Terakhir</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Video Metadata */}
          <div className="space-y-2 bg-dark-900 border border-dark-800 rounded-2xl p-5">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Episode {episode.episodeNumber}: {episode.title}
            </h1>
            <p className="text-sm text-gray-400">
              Bagian dari serial{" "}
              <strong className="text-gray-200">{episode.movie?.title}</strong>
            </p>
            {episode.subtitleUrl && (
              <p className="text-xs text-emerald-400 flex items-center space-x-1 pt-1">
                <span>
                  ✓ Subtitle tersedia dan dapat diaktifkan melalui menu pemutar
                  video.
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Right 1 col: Episode Sidebar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Tv className="w-5 h-5 text-brand-400" />
              <span>Daftar Episode</span>
            </h3>
            <span className="text-xs text-gray-400">
              {allEpisodes.length} Episode
            </span>
          </div>

          <div className="bg-dark-900 border border-dark-800 rounded-2xl p-2 max-h-[600px] overflow-y-auto space-y-2">
            {allEpisodes.map((ep) => {
              const isCurrent = ep.id === episode.id;
              return (
                <Link
                  key={ep.id}
                  to={`/watch/${ep.id}`}
                  className={`flex items-center space-x-3 p-2.5 rounded-xl text-xs transition-all ${
                    isCurrent
                      ? "bg-brand-600 text-white font-semibold shadow-md shadow-brand-600/30"
                      : "hover:bg-dark-800 text-gray-300 hover:text-white"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isCurrent
                        ? "bg-white/20 text-white"
                        : "bg-dark-800 text-brand-400"
                    }`}
                  >
                    {isCurrent ? (
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    ) : (
                      ep.episodeNumber
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{ep.title}</p>
                    <p className="text-[10px] opacity-75">
                      Episode {ep.episodeNumber}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
