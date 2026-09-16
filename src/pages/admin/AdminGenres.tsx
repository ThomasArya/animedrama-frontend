import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, Tags, AlertCircle } from "lucide-react";
import { Genre } from "../../types/index.js";
import { genresApi } from "../../services/api.js";

export const AdminGenres: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGenres = async () => {
    setLoading(true);
    try {
      const res = await genresApi.getAll();
      setGenres(res.data.genres);
    } catch (err) {
      console.error("Failed to load genres:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGenres();
  }, []);

  const openCreateModal = () => {
    setEditingGenre(null);
    setName("");
    setSlug("");
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (g: Genre) => {
    setEditingGenre(g);
    setName(g.name);
    setSlug(g.slug);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingGenre) {
        await genresApi.update(editingGenre.id, { name, slug });
      } else {
        await genresApi.create({ name, slug: slug || undefined });
      }
      setIsModalOpen(false);
      loadGenres();
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal menyimpan genre.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, genreName: string) => {
    if (!window.confirm(`Hapus genre "${genreName}"?`)) return;

    try {
      await genresApi.delete(id);
      setGenres((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      alert("Gagal menghapus genre.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Kelola Genre
          </h1>
          <p className="text-xs text-gray-400">Atur kategori anime dan drama</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Genre Baru</span>
        </button>
      </div>

      <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Memuat daftar genre...
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-850 text-gray-400 uppercase tracking-wider font-semibold border-b border-dark-800">
              <tr>
                <th className="p-4">Nama Genre</th>
                <th className="p-4">Slug URL</th>
                <th className="p-4">Jumlah Konten</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {genres.map((g) => (
                <tr
                  key={g.id}
                  className="hover:bg-dark-850/50 transition-colors"
                >
                  <td className="p-4 font-semibold text-white">{g.name}</td>
                  <td className="p-4 text-gray-400 font-mono text-[11px]">
                    {g.slug}
                  </td>
                  <td className="p-4 text-gray-300">
                    <span className="px-2 py-0.5 rounded-full bg-dark-800 border border-dark-700">
                      {g._count?.movies || 0} Movie/Anime
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(g)}
                      className="p-1.5 bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(g.id, g.name)}
                      className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-900 border border-dark-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Tags className="w-5 h-5 text-brand-400" />
                <span>{editingGenre ? "Edit Genre" : "Tambah Genre Baru"}</span>
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
              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Nama Genre
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingGenre) {
                      setSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^\w ]+/g, "")
                          .replace(/ +/g, "-"),
                      );
                    }
                  }}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-brand-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Slug URL
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-brand-500 text-xs font-mono"
                />
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
                  {submitting ? "Menyimpan..." : "Simpan Genre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
