import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Info, Bookmark, Check, RefreshCw } from "lucide-react";
import { Movie, Genre, WatchHistoryItem } from "../types/index.js";
import {
  moviesApi,
  genresApi,
  historyApi,
  watchlistApi,
} from "../services/api.js";
import { MovieSlider } from "../components/MovieSlider.js";
import { SkeletonHero, SkeletonCard } from "../components/SkeletonCard.js";
import { useAuth } from "../context/AuthContext.js";

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [latestAnime, setLatestAnime] = useState<Movie[]>([]);
  const [latestDrama, setLatestDrama] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [continueWatching, setContinueWatching] = useState<WatchHistoryItem[]>(
    [],
  );
  const [inWatchlist, setInWatchlist] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allMoviesRes, animeRes, dramaRes, genresRes] = await Promise.all([
        moviesApi.getAll({ limit: 12, sort: "popular" }),
        moviesApi.getAll({ type: "anime", limit: 10, sort: "latest" }),
        moviesApi.getAll({ type: "drama", limit: 10, sort: "latest" }),
        genresApi.getAll(),
      ]);

      const movies = allMoviesRes.data.movies;
      if (movies.length > 0) {
        setHeroMovie(movies[0]);
        setTrendingMovies(movies);
        setPopularMovies(movies.slice().sort((a, b) => b.rating - a.rating));
      }

      setLatestAnime(animeRes.data.movies);
      setLatestDrama(dramaRes.data.movies);
      setGenres(genresRes.data.genres);

      // If user is logged in, fetch Continue Watching and watchlist state
      if (isAuthenticated) {
        try {
          const histRes = await historyApi.getAll();
          setContinueWatching(histRes.data.history.slice(0, 6));

          if (movies.length > 0) {
            const detailRes = await moviesApi.getById(movies[0].id);
            setInWatchlist(detailRes.data.userState?.inWatchlist || false);
          }
        } catch (e) {
          console.error("Failed to fetch user state for homepage:", e);
        }
      }
    } catch (err: any) {
      console.error("Failed to load homepage data:", err);
      setError(
        "Gagal memuat katalog konten. Pastikan server backend sedang aktif.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  const handleHeroWatchlist = async () => {
    if (!heroMovie) return;
    if (!isAuthenticated) {
      alert(
        "Silakan masuk (login) untuk menambahkan konten ke Watchlist Anda.",
      );
      return;
    }

    try {
      if (inWatchlist) {
        await watchlistApi.remove(heroMovie.id);
        setInWatchlist(false);
      } else {
        await watchlistApi.add(heroMovie.id);
        setInWatchlist(true);
      }
    } catch (err) {
      console.error("Watchlist toggle error:", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 pb-16">
        <SkeletonHero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-2xl max-w-md w-full space-y-4">
          <p className="text-red-300 text-sm font-medium">{error}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-dark-800 hover:bg-dark-700 text-white rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Coba Lagi</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Hero Section */}
      {heroMovie && (
        <section className="relative w-full h-[65vh] min-h-[440px] max-h-[640px] flex items-end">
          {/* Backdrop image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={heroMovie.backdrop}
              alt={heroMovie.title}
              className="w-full h-full object-cover object-center scale-105 filter brightness-75"
            />
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-950/90 via-dark-950/40 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <div className="max-w-2xl space-y-4">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-600 text-white shadow-md">
                  {heroMovie.type === "anime"
                    ? "Featured Anime"
                    : "Featured Drama"}
                </span>
                <span className="text-xs text-gray-300 font-medium">
                  ★ {heroMovie.rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">
                  • {heroMovie.year}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                {heroMovie.title}
              </h1>

              {heroMovie.alternativeTitle && (
                <p className="text-sm text-gray-400 font-medium -mt-2">
                  {heroMovie.alternativeTitle}
                </p>
              )}

              <p className="text-sm sm:text-base text-gray-300 line-clamp-3 leading-relaxed drop-shadow">
                {heroMovie.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={`/detail/${heroMovie.id}`}
                  className="flex items-center space-x-2 px-6 py-3 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-lg shadow-brand-600/30 transition-all hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Nonton Sekarang</span>
                </Link>

                <button
                  onClick={handleHeroWatchlist}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-full border text-sm font-medium transition-all ${
                    inWatchlist
                      ? "bg-dark-800 text-emerald-400 border-emerald-500/50"
                      : "bg-dark-900/80 hover:bg-dark-800 text-white border-dark-700"
                  }`}
                >
                  {inWatchlist ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                  <span>{inWatchlist ? "Tersimpan" : "Watchlist"}</span>
                </button>

                <Link
                  to={`/detail/${heroMovie.id}`}
                  className="flex items-center space-x-2 px-4 py-3 rounded-full bg-dark-900/60 hover:bg-dark-800 text-gray-300 hover:text-white text-sm font-medium border border-dark-700 transition-colors"
                >
                  <Info className="w-4 h-4" />
                  <span>Detail</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Continue Watching (Only for logged-in user with history) */}
        {isAuthenticated && continueWatching.length > 0 && (
          <section className="py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
                <span className="w-2 h-6 bg-brand-500 rounded-full inline-block" />
                <span>Lanjutkan Menonton</span>
              </h2>
              <Link
                to="/profile#history"
                className="text-xs sm:text-sm font-medium text-brand-400 hover:text-brand-300"
              >
                Riwayat Lengkap →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {continueWatching.map((item) => {
                const percent =
                  item.duration > 0
                    ? Math.min(
                        100,
                        Math.round((item.progress / item.duration) * 100),
                      )
                    : 0;

                return (
                  <Link
                    key={item.id}
                    to={`/watch/${item.episodeId}`}
                    className="group flex space-x-3 bg-dark-900 border border-dark-800 hover:border-dark-700 rounded-xl p-2.5 transition-all hover:bg-dark-850"
                  >
                    <div className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-dark-800">
                      <img
                        src={item.episode.movie?.poster}
                        alt={item.episode.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-dark-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-6 h-6 fill-white text-white" />
                      </div>
                      {/* Progress Bar overlay at bottom of thumb */}
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-dark-950">
                        <div
                          className="h-full bg-brand-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-sm font-semibold text-white truncate group-hover:text-brand-400 transition-colors">
                        {item.episode.movie?.title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        Ep {item.episode.episodeNumber}: {item.episode.title}
                      </p>
                      <div className="mt-2 flex items-center space-x-2 text-[11px] text-gray-400">
                        <span>Progress {percent}%</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Trending Now Slider */}
        <MovieSlider
          title="🔥 Sedang Tren"
          subtitle="Judul paling banyak ditonton minggu ini"
          movies={trendingMovies}
          viewAllLink="/catalog?sort=popular"
        />

        {/* Latest Anime Slider */}
        <MovieSlider
          title="⚡ Anime Terbaru"
          subtitle="Episode dan seri anime terkini"
          movies={latestAnime}
          viewAllLink="/catalog?type=anime"
        />

        {/* Latest Drama Slider */}
        <MovieSlider
          title="🎭 Drama Pilihan"
          subtitle="Serial drama Korea & Asia terpopuler"
          movies={latestDrama}
          viewAllLink="/catalog?type=drama"
        />

        {/* Popular Content Slider */}
        <MovieSlider
          title="⭐ Nilai Tertinggi"
          subtitle="Anime dan drama dengan rating komunitas tertinggi"
          movies={popularMovies}
          viewAllLink="/catalog?sort=popular"
        />

        {/* Genre Section */}
        <section className="py-6 border-t border-dark-850">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-4">
            Jelajahi Berdasarkan Genre
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {genres.map((g) => (
              <Link
                key={g.id}
                to={`/catalog?genre=${g.slug}`}
                className="px-4 py-2 rounded-xl bg-dark-900 border border-dark-800 hover:border-brand-500/60 hover:bg-dark-850 text-gray-300 hover:text-white text-sm font-medium transition-all group flex items-center space-x-2"
              >
                <span>{g.name}</span>
                {g._count && g._count.movies > 0 && (
                  <span className="text-xs text-gray-400 bg-dark-800 px-1.5 py-0.5 rounded-full group-hover:text-brand-300">
                    {g._count.movies}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
