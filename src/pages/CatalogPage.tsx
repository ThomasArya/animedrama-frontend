import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { Movie, Genre } from "../types/index.js";
import { moviesApi, genresApi } from "../services/api.js";
import { MovieCard } from "../components/MovieCard.js";
import { SkeletonCard } from "../components/SkeletonCard.js";

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const querySearch = searchParams.get("search") || "";
  const queryType = (searchParams.get("type") as "anime" | "drama") || "";
  const queryGenre = searchParams.get("genre") || "";
  const queryYear = searchParams.get("year") || "";
  const queryStatus = searchParams.get("status") || "";
  const querySort = (searchParams.get("sort") as any) || "latest";
  const queryPage = parseInt(searchParams.get("page") || "1", 10);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  // Local state for immediate typing in search input
  const [searchInput, setSearchInput] = useState<string>(querySearch);

  // Load genres once
  useEffect(() => {
    genresApi
      .getAll()
      .then((res) => setGenres(res.data.genres))
      .catch((err) => console.error("Failed to load genres:", err));
  }, []);

  // Sync searchInput when URL querySearch changes
  useEffect(() => {
    setSearchInput(querySearch);
  }, [querySearch]);

  // Fetch movies when params change
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const res = await moviesApi.getAll({
          search: querySearch || undefined,
          type: queryType || undefined,
          genre: queryGenre || undefined,
          year: queryYear || undefined,
          status: queryStatus || undefined,
          sort: querySort || "latest",
          page: queryPage,
          limit: 18,
        });

        setMovies(res.data.movies);
        setTotalPages(res.data.pagination.totalPages || 1);
        setTotalCount(res.data.pagination.total || 0);
      } catch (err) {
        console.error("Failed to load catalog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [
    querySearch,
    queryType,
    queryGenre,
    queryYear,
    queryStatus,
    querySort,
    queryPage,
  ]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1"); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("search", searchInput.trim());
  };

  const resetFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    !!querySearch ||
    !!queryType ||
    !!queryGenre ||
    !!queryYear ||
    !!queryStatus ||
    querySort !== "latest";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {queryType === "anime"
              ? "Katalog Anime"
              : queryType === "drama"
                ? "Katalog Drama Korea & Asia"
                : "Jelajah Semua Katalog"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Menampilkan {totalCount} judul tayangan tersedia
          </p>
        </div>

        {/* Search Input */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex gap-2 max-w-md w-full"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari judul atau kata kunci..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-dark-900 border border-dark-700 rounded-xl text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:border-brand-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  updateParam("search", "");
                }}
                className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            Cari
          </button>
          <button
            type="button"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`md:hidden p-2 rounded-xl border ${
              filtersOpen
                ? "bg-brand-600 border-brand-500 text-white"
                : "bg-dark-900 border-dark-700 text-gray-300"
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Filter Toolbar (Desktop always visible, mobile toggleable) */}
      <div
        className={`bg-dark-900 border border-dark-800 rounded-2xl p-4 transition-all ${
          filtersOpen ? "block" : "hidden md:block"
        }`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Type Filter */}
          <div>
            <label className="block text-gray-400 font-medium mb-1">Tipe</label>
            <select
              value={queryType}
              onChange={(e) => updateParam("type", e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg py-1.5 px-2 text-gray-200 focus:outline-none focus:border-brand-500"
            >
              <option value="">Semua Tipe</option>
              <option value="anime">Anime</option>
              <option value="drama">Drama</option>
            </select>
          </div>

          {/* Genre Filter */}
          <div>
            <label className="block text-gray-400 font-medium mb-1">
              Genre
            </label>
            <select
              value={queryGenre}
              onChange={(e) => updateParam("genre", e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg py-1.5 px-2 text-gray-200 focus:outline-none focus:border-brand-500"
            >
              <option value="">Semua Genre</option>
              {genres.map((g) => (
                <option key={g.id} value={g.slug}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-gray-400 font-medium mb-1">
              Status
            </label>
            <select
              value={queryStatus}
              onChange={(e) => updateParam("status", e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg py-1.5 px-2 text-gray-200 focus:outline-none focus:border-brand-500"
            >
              <option value="">Semua Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-gray-400 font-medium mb-1">
              Tahun
            </label>
            <select
              value={queryYear}
              onChange={(e) => updateParam("year", e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg py-1.5 px-2 text-gray-200 focus:outline-none focus:border-brand-500"
            >
              <option value="">Semua Tahun</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2016">2016</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-gray-400 font-medium mb-1">
              Urutkan
            </label>
            <select
              value={querySort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="w-full bg-dark-800 border border-dark-700 rounded-lg py-1.5 px-2 text-gray-200 focus:outline-none focus:border-brand-500"
            >
              <option value="latest">Terbaru</option>
              <option value="popular">Terpopuler</option>
              <option value="year">Tahun Rilis</option>
              <option value="title">Judul A-Z</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="w-full py-1.5 px-3 bg-red-950/40 border border-red-800/60 hover:bg-red-900/60 text-red-300 rounded-lg font-medium transition-colors flex items-center justify-center space-x-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Movie Results Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20 bg-dark-900/50 border border-dark-800/80 rounded-2xl space-y-4">
          <Filter className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-lg font-semibold text-white">
            Tidak ada konten yang sesuai
          </h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian Anda atau reset filter yang sedang
            aktif.
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <button
            disabled={queryPage <= 1}
            onClick={() => updateParam("page", String(queryPage - 1))}
            className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-300 hover:text-white disabled:opacity-40 disabled:hover:text-gray-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-400 px-3">
            Halaman <strong className="text-white">{queryPage}</strong> dari{" "}
            <strong className="text-white">{totalPages}</strong>
          </span>
          <button
            disabled={queryPage >= totalPages}
            onClick={() => updateParam("page", String(queryPage + 1))}
            className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-gray-300 hover:text-white disabled:opacity-40 disabled:hover:text-gray-300 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
