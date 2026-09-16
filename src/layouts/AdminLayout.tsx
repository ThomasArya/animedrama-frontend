import React from "react";
import { Link, Outlet, useLocation, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Film,
  ListVideo,
  Tags,
  Users,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.js";

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { label: "Ringkasan (Overview)", path: "/admin", icon: LayoutDashboard },
    { label: "Kelola Konten (Movies)", path: "/admin/movies", icon: Film },
    { label: "Kelola Episode", path: "/admin/episodes", icon: ListVideo },
    { label: "Kelola Genre", path: "/admin/genres", icon: Tags },
    { label: "Kelola Pengguna", path: "/admin/users", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-dark-900 border-r border-dark-800 p-4 shrink-0 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center space-x-2 pb-6 border-b border-dark-800">
            <div className="p-2 bg-brand-500/20 text-brand-400 rounded-lg">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base">AnimeDrama</h1>
              <p className="text-xs text-brand-400 font-medium">
                Panel Administrator
              </p>
            </div>
          </div>

          {/* Nav List */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                      : "text-gray-300 hover:text-white hover:bg-dark-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Return to website */}
        <div className="pt-6 border-t border-dark-800 mt-6 md:mt-0">
          <Link
            to="/"
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-dark-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Website</span>
          </Link>
        </div>
      </aside>

      {/* Admin Main Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
