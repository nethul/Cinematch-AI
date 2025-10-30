import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, MovieDetails, getMovieCredits, CastMember } from '../services/tmdbService';

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [details, setDetails] = React.useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [cast, setCast] = React.useState<CastMember[]>([]);

  React.useEffect(() => {
    const load = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const numericId = Number(id);
        if (Number.isNaN(numericId)) {
          throw new Error('Invalid movie id');
        }
        const [data, credits] = await Promise.all([
          getMovieDetails(numericId),
          getMovieCredits(numericId),
        ]);
        setDetails(data);
        setCast(credits);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load movie details');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link to="/" className="text-cyan-400 hover:text-cyan-300">
            ← Back to recommendations
          </Link>
        </div>

        {isLoading && (
          <div className="text-slate-300">Loading movie details…</div>
        )}
        {error && (
          <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>
        )}

        {details && (
          <div className="bg-slate-800/50 p-6 rounded-xl shadow-2xl border border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                {details.posterPath ? (
                  <img src={details.posterPath} alt={`${details.title} poster`} className="w-full rounded-lg border border-slate-700" />
                ) : (
                  <div className="w-full h-80 bg-slate-700 rounded-lg" />
                )}
              </div>
              <div className="md:col-span-2 flex flex-col">
                <h1 className="text-3xl font-bold text-white">{details.title}</h1>
                {details.tagline && (
                  <p className="text-slate-400 italic mt-1">{details.tagline}</p>
                )}
                <div className="flex flex-wrap gap-3 mt-3 text-sm text-slate-300">
                  {details.releaseDate && <span>Released: {details.releaseDate}</span>}
                  {typeof details.runtime === 'number' && <span>• {details.runtime} min</span>}
                  {typeof details.voteAverage === 'number' && <span>• Rating: {details.voteAverage.toFixed(1)}</span>}
                </div>
                {details.genres && details.genres.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {details.genres.map(g => (
                      <span key={g.id} className="px-2 py-1 text-xs bg-slate-700 rounded-full border border-slate-600">{g.name}</span>
                    ))}
                  </div>
                )}
                <div className="mt-6 text-slate-200 leading-relaxed">
                  {details.overview || 'No overview available.'}
                </div>
              </div>
            </div>

            {cast && cast.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-slate-100 mb-4">Top Billed Cast</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {cast.map(member => (
                    <div key={member.id} className="bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden">
                      {member.profilePath ? (
                        <img src={member.profilePath} alt={member.name} className="w-full h-48 object-cover" />
                      ) : (
                        <div className="w-full h-48 bg-slate-700" />
                      )}
                      <div className="p-3">
                        <div className="text-slate-100 text-sm font-semibold truncate">{member.name}</div>
                        {member.character && (
                          <div className="text-slate-400 text-xs truncate">as {member.character}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsPage;


