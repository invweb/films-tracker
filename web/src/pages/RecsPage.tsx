import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tmdbApi, img } from '../services/api';
import { Movie } from '../types';

export default function RecsPage() {
  const [recs, setRecs] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tmdbApi.recommendations().then(d => { setRecs(d.results || []); setLoading(false); });
  }, []);

  return (
    <div>
      <h1>Recommended For You</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Based on your watch history</p>
      <div className="movie-grid">
        {recs.map(m => (
          <Link to={`/movie/${m.id}`} key={m.id} className="movie-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={img(m.poster_path)} alt={m.title} />
            <div className="title">{m.title}</div>
            <div className="meta">★ {m.vote_average?.toFixed(1)}</div>
          </Link>
        ))}
      </div>
      {!loading && recs.length === 0 && (
        <div className="empty">Add movies to "Watched" to get recommendations</div>
      )}
    </div>
  );
}
