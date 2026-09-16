import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  ListVideo,
  AlertCircle,
  Play,
} from "lucide-react";
import { Movie, Episode } from "../../types/index.js";
import { moviesApi, episodesApi } from "../../services/api.js";

export const AdminEpisodes: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<string>("");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    episodeNumber: 1,
    title: "",
    videoUrl: "",
    subtitleUrl: "",
  });

  // Load all movies for selector
  useEffect(() => {
    moviesApi
      .getAll({ limit: 100 })
      .then((res) => {
        setMovies(res.data.movies);
        if (res.data.movies.length > 0 && !selectedMovieId) {
          setSelectedMovieId(res.data.movies[0].id);
        }
      })
      .catch((err) => console.error("Failed to load movies:", err));
  }, []);

  // Load episodes when selected movie changes
  const loadEpisodes = async () => {
    if (!selectedMovieId) return;
    setLoading(true);
    try {
      const res = await episodesApi.getByMovieId(selectedMovieId);
      setEpisodes(res.data.episodes);
    } catch (err) {
      console.error("Failed to load episodes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEpisodes();
  }, [selectedMovieId]);

  const openCreateModal = () => {
    setEditingEpisode(null);
    const nextNumber =
      episodes.length > 0
        ? Math.max(...episodes.map((e) => e.episodeNumber)) + 1
        : 1;

    setFormData({
      episodeNumber: nextNumber,
      title: `Episode ${nextNumber}`,
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      subtitleUrl: "",
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (ep: Episode) => {
    setEditingEpisode(ep);
    setFormData({
      episodeNumber: ep.episodeNumber,
      title: ep.title,
      videoUrl: ep.videoUrl,
      subtitleUrl: ep.subtitleUrl || "",
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editingEpisode) {
        await episodesApi.update(editingEpisode.id, {
          episodeNumber: formData.episodeNumber,
          title: formData.title,
          videoUrl: formData.videoUrl,
          subtitleUrl: formData.subtitleUrl || null,
        });
      } else {
        await episodesApi.create(selectedMovieId, {
          episodeNumber: formData.episodeNumber,
          title: formData.title,
          videoUrl: formData.videoUrl,
          subtitleUrl: formData.subtitleUrl || null,
        });
      }
      setIsModalOpen(false);
      loadEpisodes();
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal menyimpan episode.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Hapus episode "${title}"?`)) return;

    try {
      await episodesApi.delete(id);
      setEpisodes((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      alert("Gagal menghapus episode.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Kelola Episode
          </h1>
          <p className="text-xs text-gray-400">
            Atur nomor episode, link pemutar video legal, dan subtitle
          </p>
        </div>
        <button
          onClick={openCreateModal}
          disabled={!selectedMovieId}
          className="flex items-center space-x-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-xl shadow-md transition-colors w-fit disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Episode Baru</span>
        </button>
      </div>

      {/* Movie Selector */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <label className="text-xs font-semibold text-gray-300 shrink-0">
          Pilih Judul Film / Anime:
        </label>
        <select
          value={selectedMovieId}
          onChange={(e) => setSelectedMovieId(e.target.value)}
          className="flex-1 bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
        >
          {movies.map((m) => (
            <option key={m.id} value={m.id}>
              [{m.type.toUpperCase()}] {m.title} ({m.year})
            </option>
          ))}
        </select>
      </div>

      {/* Episodes Table */}
      <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Memuat daftar episode...
          </div>
        ) : episodes.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm space-y-2">
            <p>Belum ada episode untuk judul ini.</p>
            <button
              onClick={openCreateModal}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
            >
              + Tambah episode pertama
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-850 text-gray-400 uppercase tracking-wider font-semibold border-b border-dark-800">
                <tr>
                  <th className="p-4 w-16">No</th>
                  <th className="p-4">Judul Episode</th>
                  <th className="p-4">Video URL</th>
                  <th className="p-4">Subtitle</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-800">
                {episodes.map((ep) => (
                  <tr
                    key={ep.id}
                    className="hover:bg-dark-850/50 transition-colors"
                  >
                    <td className="p-4 font-bold text-brand-400">
                      EP {ep.episodeNumber}
                    </td>
                    <td className="p-4 font-semibold text-white">{ep.title}</td>
                    <td
                      className="p-4 text-gray-400 max-w-xs truncate"
                      title={ep.videoUrl}
                    >
                      {ep.videoUrl}
                    </td>
                    <td className="p-4">
                      {ep.subtitleUrl ? (
                        <span className="text-emerald-400 text-[11px]">
                          Tersedia (.vtt)
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <a
                        href={ep.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white rounded-lg inline-block"
                        title="Pratinjau Video"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => openEditModal(ep)}
                        className="p-1.5 bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white rounded-lg"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ep.id, ep.title)}
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
          </div>
        )}
      </div>

      {/* Modal Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-900 border border-dark-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <ListVideo className="w-5 h-5 text-brand-400" />
                <span>
                  {editingEpisode ? "Edit Episode" : "Tambah Episode Baru"}
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
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    Nomor Ep
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.episodeNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        episodeNumber: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-brand-500 text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-300 font-semibold mb-1">
                    Judul Episode
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
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Video Stream URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  placeholder="https://.../video.mp4"
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-brand-500 text-xs"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Harus link direct video legal (MP4 / WebM / HLS stream).
                </p>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">
                  Subtitle URL (.vtt) (Opsional)
                </label>
                <input
                  type="url"
                  value={formData.subtitleUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitleUrl: e.target.value })
                  }
                  placeholder="https://.../subtitles.vtt"
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-700 rounded-xl text-white focus:outline-none focus:border-brand-500 text-xs"
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
                  {submitting ? "Menyimpan..." : "Simpan Episode"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
