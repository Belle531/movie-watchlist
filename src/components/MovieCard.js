// src/components/MovieCard.js
import React from 'react';

export default function MovieCard({ movie, onDelete, onToggleWatched }) {
  return (
    <li className="bg-white rounded-lg shadow-md p-4 flex justify-between items-start transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="text-left space-y-2">
        <h3 className="text-xl font-bold text-indigo-700">{movie.title}</h3>
        <p className="text-sm"><strong>Genre:</strong> {movie.genre}</p>
        <p className="text-sm"><strong>Review:</strong> {movie.review || "No review provided."}</p>
        <p className="text-sm"><strong>Rating:</strong> {movie.rating > 0 ? '⭐'.repeat(movie.rating) : "Not rated"}</p>

        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={movie.watched}
            onChange={() => onToggleWatched(movie.id, movie.watched)}
            className="accent-indigo-600"
          />
          <span className="ml-2 text-sm italic text-gray-600">
            {movie.watched ? "Watched" : "Unwatched"}
          </span>
        </label>
      </div>

      <button
        className="bg-red-600 hover:bg-red-700 active:scale-95 transition px-3 py-2 text-sm rounded text-white"
        onClick={() => onDelete(movie.id)}
      >
        Delete
      </button>
    </li>
  );
}