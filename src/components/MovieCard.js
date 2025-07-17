import React from 'react';

export default function MovieCard({ movie, onDelete, onToggleWatched }) {
  return (
    <li className="card bg-base-100 shadow-md transition hover:shadow-xl hover:-translate-y-1">
      <div className="card-body">
        <h2 className="card-title text-indigo-700 text-xl">{movie.title}</h2>

        <div className="space-y-2 text-base">
          <p><span className="badge badge-outline">Genre</span> {movie.genre}</p>
          <p><span className="badge badge-outline">Review</span> {movie.review || "No review"}</p>
          <p><span className="badge badge-outline">Rating</span> {movie.rating > 0 ? '⭐'.repeat(movie.rating) : "Not rated"}</p>
        </div>

        <label className="label cursor-pointer mt-3">
          <span className="label-text text-base text-gray-600 mr-2">
            {movie.watched ? "Watched" : "Unwatched"}
          </span>
          <input
            type="checkbox"
            className="toggle toggle-success"
            checked={movie.watched}
            onChange={() => onToggleWatched(movie.id, movie.watched)}
          />
        </label>

        <div className="card-actions justify-end mt-4">
          <button
            className="btn btn-error"
            onClick={() => onDelete(movie.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}