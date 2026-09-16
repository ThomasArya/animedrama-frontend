import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-xl overflow-hidden bg-dark-900 border border-dark-800 animate-pulse">
      <div className="aspect-[2/3] bg-dark-800" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-dark-800 rounded w-3/4" />
        <div className="flex justify-between">
          <div className="h-3 bg-dark-800 rounded w-1/3" />
          <div className="h-3 bg-dark-800 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonHero: React.FC = () => {
  return (
    <div className="w-full h-[60vh] max-h-[500px] bg-dark-900 border-b border-dark-800 animate-pulse relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12 space-y-4">
        <div className="h-6 bg-dark-800 rounded w-32" />
        <div className="h-10 bg-dark-800 rounded w-2/3 max-w-md" />
        <div className="h-4 bg-dark-800 rounded w-1/2 max-w-sm" />
        <div className="flex space-x-3 pt-2">
          <div className="h-10 bg-dark-800 rounded-full w-36" />
          <div className="h-10 bg-dark-800 rounded-full w-36" />
        </div>
      </div>
    </div>
  );
};

