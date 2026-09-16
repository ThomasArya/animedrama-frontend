import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types/index.js';
import { MovieCard } from './MovieCard.js';

interface MovieSliderProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  viewAllLink?: string;
}

export const MovieSlider: React.FC<MovieSliderProps> = ({
  title,
  subtitle,
  movies,
  viewAllLink,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="relative py-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-4 px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{title}</h2>
          {subtitle && <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center space-x-2">
          {viewAllLink && (
            <a
              href={viewAllLink}
              className="text-xs sm:text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors mr-2"
            >
              Lihat Semua →
            </a>
          )}
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full bg-dark-800/80 hover:bg-dark-700 text-gray-300 hover:text-white transition-colors focus:outline-none"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full bg-dark-800/80 hover:bg-dark-700 text-gray-300 hover:text-white transition-colors focus:outline-none"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-1 -mx-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-none w-36 sm:w-48 md:w-56">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
};

