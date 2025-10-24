import { Movie } from '../types';

// Use Vite's client-side env values. Client code should read VITE_ prefixed vars
// via `import.meta.env`. `.env.local` already contains `VITE_TMDB_API_KEY` in this
// project. This avoids bundling Node-only `process.env` logic into the browser.
const TMDB_API_KEY = ((import.meta as any).env?.VITE_TMDB_API_KEY as string) || '';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!TMDB_API_KEY) {
    throw new Error("TMDb API key is not configured. Please set the VITE_TMDB_API_KEY environment variable in your .env.local (.env) file.");
  }

  if (query.trim().length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
    );
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Could not retrieve error details.');
      throw new Error(`TMDb API error: ${response.status} ${response.statusText}. Details: ${errorText}`);
    }

    const data = await response.json();
    const movies: TmdbMovie[] = data.results;

    // Add year to title for clarity and sort by popularity
    return movies
      .map(movie => ({
        id: movie.id,
        title: movie.release_date ? `${movie.title} (${movie.release_date.substring(0, 4)})` : movie.title,
        posterPath: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
      }))
      .slice(0, 5); // Return top 5 results

  } catch (error) {
    console.error("Failed to search movies on TMDb:", error);
    // Propagate the error to the caller so the UI can handle it properly.
    throw error;
  }
};
