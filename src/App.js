// src/App.js
import React, { useState, useEffect } from 'react';
import { scanMovies, createMovie, updateMovie, deleteMovie } from './dynamo';
import MovieCard from './components/MovieCard';
import './index.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [movies, setMovies] = useState([]);
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newMovieGenre, setNewMovieGenre] = useState('');
  const [newMovieReview, setNewMovieReview] = useState('');
  const [newMovieRating, setNewMovieRating] = useState(0);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const fetched = await scanMovies();
        console.log("Fetched movies:", fetched);
        setMovies(fetched);
      } catch (error) {
        console.error("Failed to load movies:", error);
      }
    };
    fetchAllMovies();
  }, []);

  const handleAddMovie = async () => {
    if (!newMovieTitle.trim()) {
      alert('Movie title is required!');
      return;
    }

    const movieToAdd = {
      id: uuidv4(),
      title: newMovieTitle.trim(),
      genre: newMovieGenre.trim() || 'Unspecified',
      watched: false,
      review: newMovieReview.trim(),
      rating: parseInt(newMovieRating) || 0
    };

    try {
      await createMovie(movieToAdd);
      setMovies(prev => [...prev, movieToAdd]);
      setNewMovieTitle('');
      setNewMovieGenre('');
      setNewMovieReview('');
      setNewMovieRating(0);
    } catch (error) {
      console.error("Error adding movie:", error);
      alert('Failed to add movie.');
    }
  };

  const handleToggleWatched = async (id, currentStatus) => {
    try {
      const updated = await updateMovie(id, { watched: !currentStatus });
      setMovies(prev =>
        prev.map(movie => movie.id === id ? { ...movie, ...updated } : movie)
      );
    } catch (error) {
      console.error("Error updating watched status:", error);
    }
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm('Delete this movie?')) {
      try {
        await deleteMovie(id);
        setMovies(prev => prev.filter(movie => movie.id !== id));
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    }
  };

  return (
    <div className="App p-6 max-w-4xl mx-auto">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold text-indigo-700">Cassandra's Movie Watchlist</h1>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Movie</h2>
        <div className="space-y-4">
          <input
            value={newMovieTitle}
            onChange={e => setNewMovieTitle(e.target.value)}
            placeholder="Movie Title (required)"
            className="w-full p-2 border rounded"
          />
          <input
            value={newMovieGenre}
            onChange={e => setNewMovieGenre(e.target.value)}
            placeholder="Genre"
            className="w-full p-2 border rounded"
          />
          <textarea
            value={newMovieReview}
            onChange={e => setNewMovieReview(e.target.value)}
            placeholder="Your review"
            rows="3"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            min="0"
            max="5"
            value={newMovieRating}
            onChange={e => setNewMovieRating(Math.max(0, Math.min(5, parseInt(e.target.value) || 0)))}
            className="w-full p-2 border rounded"
          />
          <button onClick={handleAddMovie} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">
            Add Movie
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">My Movies ({movies.length})</h2>
        {movies.length === 0 ? (
          <p className="text-gray-600">No movies in your watchlist yet. Add one!</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {movies.map(movie => (
    <MovieCard
      key={movie.id}
      movie={movie}
      onDelete={handleDeleteMovie}
      onToggleWatched={(id, watched) => handleToggleWatched(id, watched)}
    />
  ))}
</ul>
        )}
      </section>
    </div>
  );
}

export default App;