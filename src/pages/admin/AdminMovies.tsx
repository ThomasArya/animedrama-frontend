import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Star,
  Film,
  AlertCircle,
  Check,
} from "lucide-react";
import { Movie, Genre } from "../../types/index.js";
import { moviesApi, genresApi } from "../../services/api.js";

export const AdminMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form inputs
  const [formData, setFormData] = useState({
    title: "",
    alternativeTitle: "",
    description: "",
    poster: "",
    backdrop: "",
    type: "anime",
    year: new Date().getFullYear(),
    rating: 8.5,
    status: "ongoing",
    genreIds: [] as string[],
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [moviesRes, genresRes] = await Promise.all([
        moviesApi.getAll({ limit: 50, search: search || undefined }),
        genresApi.getAll(),
      ]);
      setMovies(moviesRes.data.movies);
      setGenres(genresRes.data.genres);
    } catch (err) {
      console.error("Failed to load movies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const openCreateModal = () => {
    setEditingMovie(null);
    setFormData({
      title: "",
      alternativeTitle: "",
      description: "",
      poster:
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
      backdrop:
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80",
      type: "anime",
      year: new Date().getFullYear(),
      rating: 8.5,
      status: "ongoing",
      genreIds: genres.slice(0, 2).map((g) => g.id),
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      alternativeTitle: movie.alternativeTitle || "",
      description: movie.description,
      poster: movie.poster,
      backdrop: movie.backdrop,
      type: movie.type,
      year: movie.year,
      rating: movie.rating,
      status: movie.status,
      genreIds: movie.genres ? movie.genres.map((g) => g.id) : [],
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleGenreToggle = (id: string) => {
    setFormData((prev) => {
      const exists = prev.genreIds.includes(id);
      return {
        ...prev,
        genreIds: exists
          ? prev.genreIds.filter((gId) => gId !== id)
          : [...prev.genreIds, id],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingMovie) {
        await moviesApi.update(editingMovie.id, formData);
      } else {
        await moviesApi.create(formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal menyimpan data konten.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (
      !window.confirm(
        `Yakin ingin menghapus "${title}" beserta semua episodenya?`,
      )
    )
      return;

    try {
      await moviesApi.delete(id);
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert("Gagal menghapus konten.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Kelola Movie, Anime & Drama
          </h1>
          <p className="text-xs text-gray-400">
            Total {movies.length} judul tersimpan di database
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Konten Baru</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Cari judul konten..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-dark-900 border border-dark-800 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-brand-500"
        />
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
      </div>

      {/* Movies Table / List */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Memuat data konten...
          </div>
        ) : movies.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Tidak ada konten ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-850 text-gray-400 uppercase tracking-wider font-semibold border-b border-dark-800">
                <tr>
                  <th className="p-4">Konten</th>
                  <th className="p-4">Tipe</th>
                  <th className="p-4">Tahun & Rating</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Episode</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {movies.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-dark-850/50 transition-colors"
                  >
                    <td className="p-4 flex items-center space-x-3">
                      <img
                        src={m.poster}
                        alt={m.title}
                        className="w-10 h-14 object-cover rounded-lg bg-dark-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate max-w-xs">
                          {m.title}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate max-w-xs">
                          {m.genres?.map((g) => g.name).join(", ") ||
                            "No genre"}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          m.type === "anime"
                            ? "bg-purple-950/70 text-purple-300 border border-purple-800/60"
                            : "bg-emerald-950/70 text-emerald-300 border border-emerald-800/60"
                        }`}
                      >
                        {m.type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">
                      <div>{m.year}</div>
                      <div className="flex items-center space-x-1 text-yellow-400 font-semibold text-[11px] mt-0.5">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <span>{m.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-gray-300">
                        {m.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">
                      {m._count?.episodes || 0} Episode
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(m)}
                        className="p-1.5 bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id, m.title)}
                        className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-dark-900 border border-dark-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Film className="w-5 h-5 text-brand-400" />
                <span>
                  {editingMovie ? "Edit Konten" : "Tambah Konten Baru"}
                </span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-dark-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Judul Utama
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-brand-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Judul Alternatif (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.alternativeTitle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        alternativeTitle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-brand-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Deskripsi / Sinopsis
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-brand-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Poster Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.poster}
                    onChange={(e) =>
                      setFormData({ ...formData, poster: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-brand-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Backdrop Banner URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.backdrop}
                    onChange={(e) =>
                      setFormData({ ...formData, backdrop: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-brand-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Tipe
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-brand-500 text-xs"
                  >
                    <option value="anime">Anime</option>
                    <option value="drama">Drama</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-brand-500 text-xs"
                  >
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Tahun
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        year: parseInt(e.target.value, 10) || 2024,
                      })
                    }
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-brand-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Rating (0-10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-brand-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-2">
                  Pilih Genre
                </label>
                <div className="flex flex-wrap gap-2">
                  {genres.map((g) => {
                    const selected = formData.genreIds.includes(g.id);
                    return (
                      <button
                        type="button"
                        key={g.id}
                        onClick={() => handleGenreToggle(g.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors flex items-center space-x-1 ${
                          selected
                            ? "bg-brand-600 text-white border-brand-500"
                            : "bg-dark-800 text-gray-400 border-dark-700 hover:text-white"
                        }`}
                      >
                        {selected && <Check className="w-3 h-3" />}
                        <span>{g.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-dark-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-dark-800 hover:bg-dark-700 text-gray-300 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl shadow-md transition-colors disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Konten"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
