import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Bookmark,
  History,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  PlaySquare,
  Award,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.js";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-dark-950/85 backdrop-blur-md border-b border-dark-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-brand-accent flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
                <PlaySquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-brand-300 bg-clip-text text-transparent">
                Thomas<span className="text-brand-400">MOVIE</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/") && !location.search
                    ? "text-white bg-dark-800"
                    : "text-gray-300 hover:text-white hover:bg-dark-850"
                }`}
              >
                Beranda
              </Link>
              <Link
                to="/catalog?type=anime"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.search.includes("type=anime")
                    ? "text-white bg-dark-800"
                    : "text-gray-300 hover:text-white hover:bg-dark-850"
                }`}
              >
                Anime
              </Link>
              <Link
                to="/catalog?type=drama"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.search.includes("type=drama")
                    ? "text-white bg-dark-800"
                    : "text-gray-300 hover:text-white hover:bg-dark-850"
                }`}
              >
                Drama
              </Link>
              <Link
                to="/catalog"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/catalog" && !location.search
                    ? "text-white bg-dark-800"
                    : "text-gray-300 hover:text-white hover:bg-dark-850"
                }`}
              >
                Jelajah
              </Link>
            </nav>
          </div>

          {/* Search bar & User controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Cari judul anime atau drama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 lg:w-72 pl-9 pr-4 py-1.5 bg-dark-900 border border-dark-700 rounded-full text-sm text-gray-200 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </form>

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile#watchlist"
                  title="Watchlist Saya"
                  className="p-2 text-gray-300 hover:text-white hover:bg-dark-800 rounded-full transition-colors"
                >
                  <Bookmark className="w-5 h-5" />
                </Link>
                <Link
                  to="/profile#history"
                  title="Riwayat Tontonan"
                  className="p-2 text-gray-300 hover:text-white hover:bg-dark-800 rounded-full transition-colors"
                >
                  <History className="w-5 h-5" />
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/40 rounded-full hover:bg-brand-500/30 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  title="Level dan XP saya"
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-brand-300 bg-brand-500/10 border border-brand-500/30 rounded-full hover:bg-brand-500/20 transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Lv. {user?.level ?? 1}</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <img
                      src={
                        user?.avatar ||
                        `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`
                      }
                      alt={user?.username}
                      className="w-8 h-8 rounded-full border border-dark-700 object-cover bg-dark-800"
                    />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-dark-900 border border-dark-700 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-dark-800">
                        <p className="text-sm font-semibold text-white truncate">
                          {user?.username}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-800"
                      >
                        <User className="w-4 h-4" />
                        <span>Profil Saya</span>
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-brand-400 hover:text-brand-300 hover:bg-dark-800"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-800 text-left border-t border-dark-800"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar (Logout)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium text-gray-200 hover:text-white transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 rounded-full hover:from-brand-500 hover:to-brand-400 shadow-md shadow-brand-500/20 transition-all"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-800 space-y-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Cari anime atau drama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-dark-900 border border-dark-700 rounded-lg text-sm text-gray-200 placeholder-gray-400"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </form>

            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-200 hover:bg-dark-800"
              >
                Beranda
              </Link>
              <Link
                to="/catalog?type=anime"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-200 hover:bg-dark-800"
              >
                Anime
              </Link>
              <Link
                to="/catalog?type=drama"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-200 hover:bg-dark-800"
              >
                Drama
              </Link>
              <Link
                to="/catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-200 hover:bg-dark-800"
              >
                Jelajah Katalog
              </Link>
            </div>

            <div className="pt-3 border-t border-dark-800">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <img
                      src={
                        user?.avatar ||
                        `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`
                      }
                      alt={user?.username}
                      className="w-8 h-8 rounded-full border border-dark-700"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {user?.username}
                      </p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                      <p className="text-xs text-brand-300 mt-1">
                        Level {user?.level ?? 1} · {user?.experience ?? 0} XP
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-dark-800"
                  >
                    Profil Saya & Watchlist
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm text-brand-400 hover:bg-dark-800"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-dark-800"
                  >
                    Keluar (Logout)
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 px-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-medium bg-dark-800 rounded-lg text-gray-200"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-semibold bg-brand-600 rounded-lg text-white"
                  >
                    Daftar Akun Baru
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
