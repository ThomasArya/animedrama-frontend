import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Bookmark, Check } from 'lucide-react';
import { Movie } from '../types/index.js';
import { watchlistApi } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';

interface MovieCardProps {
  movie: Movie;
  inWatchlistInitial?: boolean;
  onWatchlistToggle?: (movieId: string, newState: boolean) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  inWatchlistInitial = false,
  onWatchlistToggle,
}) => {
  const { isAuthenticated } = useAuth();
  const [inWatchlist, setInWatchlist] = useState(inWatchlistInitial);
  const [loadingWatchlist, setLoadingWatchlist] = useState(false);

  const handleWatchlistClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Silakan login terlebih dahulu untuk menyimpan ke Watchlist.');
      return;
    }

    setLoadingWatchlist(true);
    try {
      if (inWatchlist) {
        await watchlistApi.remove(movie.id);
        setInWatchlist(false);
        onWatchlistToggle?.(movie.id, false);
      } else {
        await watchlistApi.add(movie.id);
        setInWatchlist(true);
        onWatchlistToggle?.(movie.id, true);
      }
    } catch (error) {
      console.error('Failed to update watchlist:', error);
    } finally {
      setLoadingWatchlist(false);
    }
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-dark-900 border border-dark-800 hover:border-dark-700 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1">
      <Link to={`/detail/${movie.id}`} className="block relative aspect-[2/3] overflow-hidden">
        {/* Poster Image */}
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // fallback placeholder
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-brand-600/90 text-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform shadow-lg shadow-brand-500/30">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>

        {/* Type Badge */}
        <span
          className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-md ${
            movie.type === 'anime'
              ? 'bg-purple-600/90 text-purple-100'
              : 'bg-emerald-600/90 text-emerald-100'
          }`}
        >
          {movie.type}
        </span>

        {/* Watchlist Quick Button */}
        <button
          onClick={handleWatchlistClick}
          disabled={loadingWatchlist}
          title={inWatchlist ? 'Hapus dari Watchlist' : 'Tambah ke Watchlist'}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all ${
            inWatchlist
              ? 'bg-brand-600 text-white'
              : 'bg-dark-950/60 text-gray-300 hover:text-white hover:bg-dark-900'
          }`}
        >
          {inWatchlist ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
        </button>

        {/* Rating Pill */}
        <div className="absolute bottom-2 left-2 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-dark-950/80 backdrop-blur-sm text-yellow-400 text-xs font-semibold">
          <Star className="w-3 h-3 fill-yellow-400" />
          <span>{movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>
        </div>

        {/* Year Badge */}
        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-dark-950/80 backdrop-blur-sm text-gray-300 text-[11px]">
          {movie.year}
        </span>
      </Link>

      {/* Content Meta */}
      <div className="p-3">
        <Link to={`/detail/${movie.id}`}>
          <h3
            title={movie.title}
            className="text-sm font-semibold text-white truncate hover:text-brand-400 transition-colors"
          >
            {movie.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
          <span className="truncate">
            {movie.genres && movie.genres.length > 0
              ? movie.genres.slice(0, 2).map((g) => g.name).join(', ')
              : movie.status}
          </span>
          <span className="capitalize text-[11px] text-gray-400 shrink-0 ml-1">
            {movie._count?.episodes ? `${movie._count.episodes} Ep` : movie.status}
          </span>
        </div>
      </div>
    </div>
  );
};

