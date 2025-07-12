// src/App.js
import React, { useState, useEffect } from 'react';
import { scanMovies, createMovie, updateMovie, deleteMovie } from './dynamo';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [movies, setMovies] = useState([]);
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newMovieGenre, setNewMovieGenre] = useState('');
  const [newMovieReview, setNewMovieReview] = useState('');
  const [newMovieRating, setNewMovieRating] = useState(0);

  // Load movies from DynamoDB
  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const fetched = await scanMovies();
        setMovies(fetched);
      } catch (error) {
        console.error("Failed to load movies:", error);
      }
    };
    fetchAllMovies();
  }, []);

  // Add a new movie
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
      alert('Failed to add movie. Check console for details.');
    }
  };

  // Toggle watched status
  const handleToggleWatched = async (id, currentStatus) => {
    try {
      const updated = await updateMovie(id, { watched: !currentStatus });
      setMovies(prev =>
        prev.map(movie => movie.id === id ? { ...movie, ...updated } : movie)
      );
    } catch (error) {
      console.error("Error updating watched status:", error);
      alert("Couldn't update movie status.");
    }
  };

  // Delete a movie
  const handleDeleteMovie = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteMovie(id);
        setMovies(prev => prev.filter(movie => movie.id !== id));
      } catch (error) {
        console.error("Error deleting movie:", error);
        alert("Couldn't delete movie.");
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cassandra's Movie Watchlist</h1>
      </header>

      <main className="App-main">
        <section className="add-movie-section">
          <h2>Add New Movie</h2>
          <div className="form-group">
            <input
              value={newMovieTitle}
              onChange={e => setNewMovieTitle(e.target.value)}
              placeholder="Movie Title (required)"
            />
          </div>
          <div className="form-group">
            <input
              value={newMovieGenre}
              onChange={e => setNewMovieGenre(e.target.value)}
              placeholder="Genre (e.g. Action, Drama)"
            />
          </div>
          <div className="form-group">
            <textarea
              value={newMovieReview}
              onChange={e => setNewMovieReview(e.target.value)}
              placeholder="Your review (optional)"
              rows="3"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Star Rating (0-5):</label>
            <input
              type="number"
              min="0"
              max="5"
              value={newMovieRating}
              onChange={e =>
                setNewMovieRating(Math.max(0, Math.min(5, parseInt(e.target.value) || 0)))
              }
            />
          </div>
          <button onClick={handleAddMovie} className="add-button">
            Add Movie
          </button>
        </section>

        <section className="movie-list-section">
          <h2>My Movies ({movies.length})</h2>
          {movies.length === 0 ? (
            <p>No movies in your watchlist yet. Add one!</p>
          ) : (
            <ul className="movie-list">
              {movies.map(movie => (
                <li key={movie.id} className="movie-item">
                  <div className="movie-info">
                    <h3>{movie.title}</h3>
                    <p><strong>Genre:</strong> {movie.genre}</p>
                    <p>
                      <input
                        type="checkbox"
                        checked={movie.watched}
                        onChange={() => handleToggleWatched(movie.id, movie.watched)}
                      />
                      <label>{movie.watched ? "Watched" : "Not Watched"}</label>
                    </p>
                    {movie.review && <p><strong>Review:</strong> {movie.review}</p>}
                    {movie.rating > 0 && <p><strong>Rating:</strong> {'⭐'.repeat(movie.rating)}</p>}
                  </div>
                  <button
                    onClick={() => handleDeleteMovie(movie.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;