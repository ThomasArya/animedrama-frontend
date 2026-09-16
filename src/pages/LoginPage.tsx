import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PlaySquare, Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.js";

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Gagal masuk. Periksa kembali email dan password Anda.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-dark-900 border border-dark-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 group mb-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-accent flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <PlaySquare className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Selamat Datang Kembali
          </h2>
          <p className="text-xs text-gray-400">
            Masuk ke akun AnimeDrama Anda untuk melanjutkan tontonan favorit
          </p>
        </div>

        {/* Demo Credentials Tip */}
        <div className="p-3 bg-brand-950/40 border border-brand-800/40 rounded-xl text-xs text-brand-300 space-y-1">
          <p className="font-semibold text-white">Akun Demo Siap Pakai:</p>
          <div className="flex justify-between">
            <span>
              Admin:{" "}
              <strong className="text-white">admin@animedrama.com</strong>
            </span>
            <span>
              Pass: <strong className="text-white">admin123</strong>
            </span>
          </div>
          <div className="flex justify-between">
            <span>
              User: <strong className="text-white">user@animedrama.com</strong>
            </span>
            <span>
              Pass: <strong className="text-white">user123</strong>
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-950/50 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-brand-500"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-brand-500"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? "Memproses..." : "Masuk Sekarang"}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 text-xs text-gray-400">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-brand-400 hover:text-brand-300 font-semibold"
          >
            Daftar sekarang
          </Link>
        </div>
      </div>
    </div>
  );
};
