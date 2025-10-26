import React, { useState } from 'react';
import InputChips from './components/InputChips';
import MovieCard from './components/MovieCard';
import ShareRecommendations from './components/ShareRecommendations';
import Loader from './components/Loader';
import { getMovieRecommendations } from './services/geminiService';
import { searchMovies } from './services/tmdbService';
import { Movie, MovieRecommendation } from './types';

const FilmIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" />
    </svg>
);

const initialMovies: Movie[] = [
  { id: 603, title: 'The Matrix (1999)', posterPath: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', isMock: true },
  { id: 335984, title: 'Blade Runner 2049 (2017)', posterPath: 'https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', isMock: true },
  { id: 550, title: 'Fight Club (1999)', posterPath: '/fight-club.jpeg', isMock: true }
];

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [recommendations, setRecommendations] = useState<MovieRecommendation[] | null>(null);
  const [showMocks, setShowMocks] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    if (movies.length < 2) {
      setError("Please add at least two movies for better recommendations.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const geminiResults = await getMovieRecommendations(movies);
      
      const resultsWithPosters = await Promise.all(
        geminiResults.map(async (rec) => {
          const searchResult = await searchMovies(rec.title.replace(/\s\(\d{4}\)$/, '')); // Remove year for better search
          return {
            ...rec,
            posterPath: searchResult.length > 0 ? searchResult[0].posterPath : null,
          };
        })
      );
      setRecommendations(resultsWithPosters);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate lightweight mock recommendations locally (no network calls).
  // These are deterministic and based on the user's selected movies so the
  // homepage can show sample output immediately without calling Gemini/TMDb.
  const createMockRecommendations = (baseMovies: Movie[]): MovieRecommendation[] => {
    // Use some handcrafted recommendations that reference favorite titles
    const baseTitles = baseMovies.map(m => m.title.replace(/\s\(\d{4}\)$/, ''));

    const examples: MovieRecommendation[] = [
      {
        title: 'Inception',
        reason: `You're drawn to narratives that challenge perception and immerse you in intricately constructed worlds, much like the simulated realities of 'The Matrix' and the complex moral landscapes of 'Blade Runner 2049'. 'Inception' will captivate you with its ingenious premise of dream-sharing and its relentless exploration of what is real, offering both thrilling action and profound intellectual puzzles.`,
        match_reasons: [
          `Features a complex, non-linear narrative that blurs the lines between reality and simulation, reminiscent of 'The Matrix'.`,
          `Explores deeply philosophical questions about identity, memory, and the nature of perceived reality, akin to 'Blade Runner 2049'.`,
          `Delivers breathtaking visual effects and a meticulously crafted world that elevates the narrative beyond mere spectacle.`
        ],
          posterPath: '/inception.webp',
          isMock: true
      },
      {
        title: 'Dark City',
        reason: `Given your appreciation for the existential questions and manufactured realities in 'The Matrix' and the noir-infused dystopia of 'Blade Runner 2049', 'Dark City' is a quintessential experience. It masterfully weaves a tale of a man who wakes up in a city where reality is constantly being altered, forcing him to uncover the truth about himself and his world.`,
        match_reasons: [
          `Presents a chilling dystopian setting and the revelation of a hidden, manufactured reality, strikingly similar to 'The Matrix'.`,
          `Employs a brooding, atmospheric film noir aesthetic combined with existential dread, much like the world of 'Blade Runner 2049'.`,
          `Features a protagonist grappling with fragmented memories and a lost identity in a sinister urban landscape, echoing themes from all three of your favorites.`
        ],
          posterPath: '/dark-city.webp',
          isMock: true
      },
      {
        title: 'Mr.Nobody (2009)',
        reason: `Your fascination with free will, identity, and the branching paths of existence evident in 'The Matrix' and 'Blade Runner 2049' will find a rich canvas in 'Mr. Nobody'. This visually stunning and emotionally resonant film delves into the myriad lives a single person could live, prompting deep reflection on choices, fate, and the nature of reality itself.`,
        match_reasons: [
          `Explores profound philosophical concepts of free will, determinism, and the nature of choice, much like the underlying questions in 'The Matrix'.`,
          `Offers a non-linear narrative and a protagonist grappling with multiple identities across divergent timelines, similar to the psychological complexity in 'Fight Club'.`,
          `Boasts stunning, atmospheric visuals and a melancholic tone that resonates with the introspective quality of 'Blade Runner 2049'.`
        ],
          posterPath: '/mr.nobody.webp',
          isMock: true
      },
      {
        title: 'Gattaca',
        reason: `Your appreciation for dystopian futures, the struggle for individuality, and the quiet intensity of films like 'Blade Runner 2049' suggests you'll find 'Gattaca' incredibly compelling. It's a beautifully crafted vision of a future where genetic destiny dictates life, and one man's rebellion against this system speaks to the core themes of identity and free will you enjoy.`,
        match_reasons: [
          `Features a sleek, near-future dystopian setting where individuals struggle against a predetermined system, mirroring the fight for freedom in 'The Matrix'.`,
          `Presents a contemplative and atmospheric tone, rich with existential questions about what it means to be human and unique, similar to 'Blade Runner 2049'.`,
          `Explores a protagonist's struggle for identity and self-determination against societal constraints, echoing the anti-establishment undercurrents of 'Fight Club'.`
        ],
      posterPath: '/gattaca.webp',
      isMock: true
      },
      
    ];

    return examples;
  };

  // On mount: check for shared recommendations in URL
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const shared = params.get('shared');
      if (shared) {
        const decoded = JSON.parse(decodeURIComponent(shared)) as MovieRecommendation[];
        if (decoded && Array.isArray(decoded) && decoded.length > 0) {
          setRecommendations(decoded);
        }
      }
    } catch (e) {
      // ignore malformed shared data
      console.warn('Failed to parse shared recommendations from URL', e);
    }
  }, []);

  // Auto-load recommendations for the initial movies when the homepage loads
  // unless a `shared` query param is present (we prefer displaying shared data).
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('shared')) return; // don't override shared recommendations

    // Only preload if we don't already have recommendations and movies length >= 2
    if (!recommendations && movies.length >= 2) {
      // Populate with lightweight mock recommendations (no API calls) so the
      // homepage demonstrates the product immediately. The user can still
      // press "Find My Next Binge" to fetch live recommendations.
      const mock = createMockRecommendations(movies);
      setRecommendations(mock);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        <header className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-2">
                <FilmIcon className="w-10 h-10 text-violet-400" />
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
          Moviematch AI
        </h1>
            </div>
            <p className="text-slate-400 max-w-2xl mx-auto">
                Tell us what you love, and we'll find your next obsession. Our AI goes beyond genres to match the very soul of the movies you cherish. 
            </p>
        </header>

        <main>
          <div className="bg-slate-800/50 p-6 rounded-xl shadow-2xl border border-slate-700 mb-8">
            <label className="block text-lg font-semibold text-slate-200 mb-3">
              Enter your all-time favorite movies
            </label>
            <InputChips movies={movies} setMovies={setMovies} onFocusInput={() => { setShowMocks(false); setMovies(prev => prev.filter(m => !(m as any).isMock)); }} />
            <button
              onClick={handleGetRecommendations}
              disabled={isLoading || movies.length === 0}
              className="mt-6 w-full bg-violet-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-violet-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-violet-500/30"
            >
              {isLoading ? 'Analyzing Your Taste...' : 'Find My Next Binge'}
            </button>
          </div>

          <div className="mt-10">
            {isLoading && <Loader />}
            {error && <p className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</p>}
            
            {!isLoading && !recommendations && !error && (
                <div className="text-center text-slate-500">
                    <p>Your personalized movie recommendations will appear here.</p>
                </div>
            )}
            
            {recommendations && !(recommendations.every(r => (r as any).isMock) && !showMocks) && (
              <>
                
                <div className="mb-10">
                  <h2 className="text-2xl font-semibold text-slate-200 mb-4 justify-center flex">
                    Your Movie Recommendations
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  {recommendations.map((rec, index) => (
                    <MovieCard key={index} recommendation={rec} />
                  ))}
                </div>

                <ShareRecommendations recommendations={recommendations} />
                
                <section className="mt-8 bg-slate-800 p-6 rounded-lg border border-slate-700">
                  <h3 className="text-2xl font-semibold text-slate-100 mb-4 justify-center flex">How it works!</h3>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="col-span-2 text-slate-300 text-sm leading-relaxed">
                      <p className="mb-3">
                        Moviematch is built to save you time and deliver recommendations that feel personal. Instead of spitting out long genre lists, we take a tiny sample of the films you already love and return a short, focused set of titles that match the mood, craft, and emotional heartbeat of your favorites. Below is a friendly walkthrough so you know exactly what happens from first click to final pick.
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 text-cyan-400">🎬</div>
                          <div>
                            <strong>1. You give examples.</strong>
                            <div className="text-slate-400">Type two or more films that represent your taste. These seeds are the emotional and stylistic clues the system uses — not just the genre labels.</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 text-violet-400">🧭</div>
                          <div>
                            <strong>2. We build a taste profile.</strong>
                            <div className="text-slate-400">We look for shared signals — tone, pacing, visual style, and narrative complexity — that form a small but meaningful profile of what you enjoy.</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 text-amber-400">✨</div>
                          <div>
                            <strong>3. We pick intentionally.</strong>
                            <div className="text-slate-400">Each recommendation is chosen because it echoes a specific quality in your seeds. We include a short, plain-language reason so you instantly understand the match.</div>
                          </div>
                        </div>

                        {/* <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 text-green-400">🖼️</div>
                          <div>
                            <strong>4. We enrich safely.</strong>
                            <div className="text-slate-400">Results show poster art and a short rationale. Mock posters are local for instant loading; live mode fetches official artwork. Secrets (API keys) remain server-side.</div>
                          </div>
                        </div> */}

                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 text-pink-400">🔗</div>
                          <div>
                            <strong>5. Share and compare.</strong>
                            <div className="text-slate-400">Share a link that reproduces the exact list so friends can compare results — and trading lists is a great way to discover unexpected favorites.</div>
                          </div>
                        </div>
                      </div>

                      {/* <p className="mt-4 text-slate-400">Mock-first means zero wait on initial visits; live mode runs when you request it and can surface deeper, under-the-radar picks. Simple controls (e.g., "more visual" or "more recent") can be added later to tune results to your mood.</p> */}
                    </div>

                    {/* <aside className="bg-slate-900/40 p-4 rounded-lg border border-slate-700">
                      <div className="text-slate-100 font-semibold mb-2">Example</div>
                      <div className="text-slate-300 text-sm mb-3">Seeds: <em>The Matrix</em>, <em>Blade Runner 2049</em></div>
                      <div className="text-slate-200 font-medium">Why we might recommend <em>Inception</em></div>
                      <div className="text-slate-400 text-sm mt-2">Complex, mind-bending narrative structure, immersive visuals, and a melancholy philosophical undercurrent — these are the shared qualities that make <em>Inception</em> a strong match.</div>
                      <button onClick={handleGetRecommendations} className="mt-4 w-full bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-md">Get live recommendations</button>
                    </aside> */}
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
        
        <footer className="text-center mt-12 py-6 border-t border-slate-800">
            <p className="text-slate-500 text-sm">Powered by Gemini API & TMDb</p>
        </footer>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
       `}</style>
    </div>
  );
};

export default App;
