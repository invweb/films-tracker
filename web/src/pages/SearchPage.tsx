import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tmdbApi, img } from '../services/api';
import { Movie } from '../types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    tmdbApi.trending().then(d => setTrending(d.results || []));
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(() => {
      tmdbApi.search(query).then(d => { setResults(d.results || []); setLoading(false); });
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const movies = query.trim().length >= 2 ? results : trending;
  const label = query.trim().length >= 2 ? 'Results' : 'Trending Now';

  return (
    <div>
      <h1>Search Movies</h1>
      <div className="search-box">
        <input
          placeholder="Movie title..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label} {loading ? '...' : ''}
      </p>
      <div className="movie-grid">
        {movies.map(m => (
          <Link to={`/movie/${m.id}`} key={m.id} className="movie-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={img(m.poster_path)} alt={m.title} />
            <div className="title">{m.title}</div>
            <div className="meta">
              {m.release_date?.slice(0, 4)} · ★ {m.vote_average?.toFixed(1)}
            </div>
          </Link>
        ))}
      </div>
      {movies.length === 0 && !loading && <div className="empty">No results found</div>}
    </div>
  );
}
