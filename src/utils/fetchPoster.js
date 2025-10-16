const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export async function fetchPosterUrl(title) {
  const query = encodeURIComponent(title);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // If results exist, return the first poster path
    if (data.results && data.results.length > 0) {
      const posterPath = data.results[0].poster_path;
      return posterPath
        ? `https://image.tmdb.org/t/p/w500${posterPath}`
        : null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching poster:", error);
    return null;
  }
}