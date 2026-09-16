import React, { useEffect, useState } from "react";
import { Users, Trash2, Shield, UserCheck } from "lucide-react";
import { User } from "../../types/index.js";
import { adminApi } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.js";

export const AdminUsers: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers();
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Ubah role pengguna ini menjadi "${newRole}"?`)) return;

    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u)),
      );
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal mengubah role pengguna.");
    }
  };

  const handleDelete = async (userId: string, username: string) => {
    if (
      !window.confirm(
        `Hapus akun pengguna "${username}"? Tindakan ini permanen.`,
      )
    )
      return;

    try {
      await adminApi.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal menghapus pengguna.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Kelola Pengguna
        </h1>
        <p className="text-xs text-gray-400">
          Daftar semua pengguna terdaftar dan pengaturan hak akses role
        </p>
      </div>

      <div className="bg-dark-900 border border-dark-800 rounded-2xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Memuat daftar pengguna...
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-850 text-gray-400 uppercase tracking-wider font-semibold border-b border-dark-800">
              <tr>
                <th className="p-4">Pengguna</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role Saat Ini</th>
                <th className="p-4">Aktivitas</th>
                <th className="p-4">Terdaftar</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {users.map((u) => {
                const isSelf = currentUser?.id === u.id;
                return (
                  <tr
                    key={u.id}
                    className="hover:bg-dark-850/50 transition-colors"
                  >
                    <td className="p-4 flex items-center space-x-3">
                      <img
                        src={
                          u.avatar ||
                          `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`
                        }
                        alt={u.username}
                        className="w-8 h-8 rounded-full border border-dark-700 bg-dark-800 object-cover"
                      />
                      <div>
                        <p className="font-semibold text-white">
                          {u.username}{" "}
                          {isSelf && (
                            <span className="text-[10px] text-brand-400">
                              (Anda)
                            </span>
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 font-mono text-[11px]">
                      {u.email}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === "admin"
                            ? "bg-purple-950/70 text-purple-300 border border-purple-800/60"
                            : "bg-dark-800 text-gray-300 border border-dark-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-[11px]">
                      {u._count?.watchlist || 0} Watchlist •{" "}
                      {u._count?.history || 0} Riwayat
                    </td>
                    <td className="p-4 text-gray-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleRoleChange(u.id, u.role)}
                        disabled={isSelf}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSelf
                            ? "opacity-30 cursor-not-allowed bg-dark-800 text-gray-400"
                            : u.role === "admin"
                              ? "bg-dark-800 hover:bg-dark-700 text-gray-300 hover:text-white"
                              : "bg-purple-950/60 hover:bg-purple-900 text-purple-300"
                        }`}
                        title={
                          u.role === "admin"
                            ? "Ubah jadi Member biasa"
                            : "Jadikan Admin"
                        }
                      >
                        <Shield className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id, u.username)}
                        disabled={isSelf}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isSelf
                            ? "opacity-30 cursor-not-allowed bg-dark-800 text-gray-400"
                            : "bg-red-950/60 hover:bg-red-900 text-red-300"
                        }`}
                        title="Hapus Akun"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
