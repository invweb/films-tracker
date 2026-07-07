import { useState, useEffect } from 'react';
import { tmdbApi, img } from '../services/api';
import { Movie } from '../types';

export default function CalendarPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tmdbApi.upcoming().then(d => { setMovies(d.results || []); setLoading(false); });
  }, []);

  return (
    <div>
      <h1>Upcoming Premieres</h1>
      {movies.map(m => (
        <div className="calendar-item" key={m.id}>
          <img src={img(m.poster_path, 'w185')} alt={m.title} />
          <div className="info">
            <h3>{m.title}</h3>
            <div className="date">
              {m.release_date
                ? new Date(m.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : 'Date TBD'}
            </div>
            <p style={{ color: 'var(--gold)', marginTop: 4 }}>★ {m.vote_average?.toFixed(1)}</p>
          </div>
        </div>
      ))}
      {!loading && movies.length === 0 && <div className="empty">No data available</div>}
      {loading && <div className="empty">Loading...</div>}
    </div>
  );
}
