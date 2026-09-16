import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { MainLayout } from './layouts/MainLayout.js';
import { AdminLayout } from './layouts/AdminLayout.js';

// Public & User Pages
import { HomePage } from './pages/HomePage.js';
import { CatalogPage } from './pages/CatalogPage.js';
import { DetailPage } from './pages/DetailPage.js';
import { WatchPage } from './pages/WatchPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { ProfilePage } from './pages/ProfilePage.js';

// Admin Pages
import { AdminOverview } from './pages/admin/AdminOverview.js';
import { AdminMovies } from './pages/admin/AdminMovies.js';
import { AdminEpisodes } from './pages/admin/AdminEpisodes.js';
import { AdminGenres } from './pages/admin/AdminGenres.js';
import { AdminUsers } from './pages/admin/AdminUsers.js';

// Guard for authenticated users
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main User Facing Layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="detail/:id" element={<DetailPage />} />
            <Route path="watch/:episodeId" element={<WatchPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin Dashboard Protected Layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="movies" element={<AdminMovies />} />
            <Route path="episodes" element={<AdminEpisodes />} />
            <Route path="genres" element={<AdminGenres />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

