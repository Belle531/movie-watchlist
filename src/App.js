import React, { useState, useEffect } from 'react';
import {
  scanMovies,
  createMovie,
  updateMovie,
  deleteMovie
} from './dynamo';
import MovieCard from './components/MovieCard';
import './index.css';
import { v4 as uuidv4 } from 'uuid';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [movies, setMovies] = useState([]);
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newMovieGenre, setNewMovieGenre] = useState('');
  const [newMovieReview, setNewMovieReview] = useState('');
  const [newMovieRating, setNewMovieRating] = useState(0);

  const [genreFilter, setGenreFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
  };

  console.log("scanMovies is:", scanMovies);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const fetched = await scanMovies();
        console.log("Fetched movies:", fetched);
        setMovies(Array.isArray(fetched) ? fetched : []);
      } catch (error) {
        console.error("Failed to load movies:", error);
        setMovies([]);
      }
    };
    fetchAllMovies();
  }, []);

  const handleGenreFilter = (genre) => setGenreFilter(genre);
  const handleSortOrder = (order) => setSortOrder(order);

  const displayedMovies = movies
    .filter(movie => genreFilter === '' || movie.genre === genreFilter)
    .sort((a, b) => {
      if (sortOrder === 'highest') return b.rating - a.rating;
      if (sortOrder === 'lowest') return a.rating - b.rating;
      return 0;
    });

  const handleAddMovie = async () => {
    if (!newMovieTitle.trim()) {
      toast.error('Movie title is required!');
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
      toast.success('Movie added!');
      setNewMovieTitle('');
      setNewMovieGenre('');
      setNewMovieReview('');
      setNewMovieRating(0);
    } catch (error) {
      console.error("Error adding movie:", error);
      toast.error('Failed to add movie.');
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
        toast('Movie deleted', { icon: '🗑️' });
      } catch (error) {
        console.error("Error deleting movie:", error);
        toast.error('Delete failed');
      }
    }
  };

  return (
    <div className="App p-6 max-w-6xl mx-auto">
      <Toaster position="top-center" reverseOrder={false} />

      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold text-indigo-700">
          Cassandra's Movie Watchlist
        </h1>
        <button
          onClick={toggleTheme}
          className="btn btn-sm btn-outline mt-4"
        >
          Toggle Theme
        </button>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Add New Movie</h2>
        <div className="space-y-4">
          <input
            value={newMovieTitle}
            onChange={e => setNewMovieTitle(e.target.value)}
            placeholder="Movie Title (required)"
            className="w-full p-3 border rounded text-lg"
          />
          <input
            value={newMovieGenre}
            onChange={e => setNewMovieGenre(e.target.value)}
            placeholder="Genre"
            className="w-full p-3 border rounded text-lg"
          />
          <textarea
            value={newMovieReview}
            onChange={e => setNewMovieReview(e.target.value)}
            placeholder="Your review"
            rows="3"
            className="w-full p-3 border rounded text-lg"
          />
          <input
            type="number"
            min="0"
            max="5"
            value={newMovieRating}
            onChange={e =>
              setNewMovieRating(
                Math.max(0, Math.min(5, parseInt(e.target.value) || 0))
              )
            }
            className="w-full p-3 border rounded text-lg"
          />
          <button
            onClick={handleAddMovie}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-lg"
          >
            Add Movie
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          My Movies ({displayedMovies.length})
        </h2>

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="select select-bordered w-full sm:w-1/2 text-lg"
            onChange={(e) => handleGenreFilter(e.target.value)}
          >
            <option value="">All Genres</option>
            <option value="Family">Family</option>
            <option value="Action">Action</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
          </select>

          <select
            className="select select-bordered w-full sm:w-1/2 text-lg"
            onChange={(e) => handleSortOrder(e.target.value)}
          >
            <option value="">Default Order</option>
            <option value="highest">Rating: Highest</option>
            <option value="lowest">Rating: Lowest</option>
          </select>
        </div>

        {/* 👇 Replace your existing movie rendering block with this one */}
{displayedMovies.length === 0 ? (
  <p className="text-gray-600 text-lg">No movies in your watchlist yet. Add one!</p>
) : (
  <div className="flex flex-wrap justify-center gap-8">
    {displayedMovies.map(movie => (
      <div key={movie.id} className="flex-grow basis-[300px] max-w-[500px]">
        <MovieCard
          movie={movie}
          onDelete={handleDeleteMovie}
          onToggleWatched={(id, watched) => handleToggleWatched(id, watched)}
        />
      </div>
    ))}
  </div>
)}
      </section>
    </div>
  );
}

export default App;