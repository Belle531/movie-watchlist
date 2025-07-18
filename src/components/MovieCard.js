 import React from 'react';

const genreColors = {
  Action: 'badge-error',
  Family: 'badge-success',
  Comedy: 'badge-info',
  Drama: 'badge-warning',
  'Artificial Intelligence': 'badge-secondary',
  Unspecified: 'badge-outline',
};

function MovieCard({ movie, onDelete, onToggleWatched }) {
  const badgeClass = genreColors[movie.genre] || 'badge-outline';

  return (
    <div className="card bg-white/30 backdrop-blur-md border border-base-200 shadow-md transition-transform duration-300 hover:scale-105 p-6 md:p-8 w-full md:w-[500px]">
      <div className="card-body text-base">
        {/* 🧠 Title + Genre Badge */}
        <div className="flex items-center justify-between">
          <h3 className="card-title font-bold text-3xl leading-tight">{movie.title}</h3>
          <span className={`badge ${badgeClass} text-base`}>{movie.genre}</span>
        </div>

       <p className="italic mt-2 text-blue-800 text-lg leading-relaxed tracking-wide">
        “{movie.review}”
      </p>

        {/* ⭐ Rating */}
        <p className="mt-2 text-yellow-600 font-semibold text-base">⭐ {movie.rating}/5</p>

        {/* 🎬 Watched Status */}
        <p className="mt-1 text-base text-purple-700">
          <span className="font-medium">Status:</span> {movie.watched ? 'Watched' : 'Unwatched'}
        </p>

        {/* 🎛️ Buttons */}
        <div className="mt-4 flex justify-end space-x-3">
          <button
            onClick={() => onToggleWatched(movie.id, movie.watched)}
            className="btn btn-sm btn-info text-base"
          >
            Toggle
          </button>
          <button
            onClick={() => onDelete(movie.id)}
            className="btn btn-sm btn-error text-base"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;