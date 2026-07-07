import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tmdbApi, moviesApi, img } from '../services/api';
import { MovieDetail } from '../types';

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [inList, setInList] = useState<Record<string, boolean>>({});

  const checkLists = async () => {
    const all = await moviesApi.getAll();
    const watchlist = new Set(all.filter(m => m.list_type === 'watchlist').map(m => m.tmdb_id));
    const watched = new Set(all.filter(m => m.list_type === 'watched').map(m => m.tmdb_id));
    const favorites = new Set(all.filter(m => m.list_type === 'favorites').map(m => m.tmdb_id));
    setInList({ watchlist: watchlist.has(Number(id)), watched: watched.has(Number(id)), favorites: favorites.has(Number(id)) });
  };

  useEffect(() => {
    if (!id) return;
    tmdbApi.movieDetail(Number(id)).then(setMovie);
    checkLists();
  }, [id]);

  const add = async (listType: string) => {
    await moviesApi.add({ tmdb_id: Number(id), list_type: listType });
    checkLists();
  };

  const remove = async (listType: string) => {
    await moviesApi.remove(Number(id), listType);
    checkLists();
  };

  if (!movie) return <div className="empty">Loading...</div>;

  const trailer = movie.videos?.results?.find(
    v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  return (
    <div>
      <Link to="/" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14, marginBottom: 16, display: 'inline-block' }}>
        ← Back to Search
      </Link>

      <div className="detail-header">
        <img className="detail-poster" src={img(movie.poster_path, 'w500')} alt={movie.title} />
        <div className="detail-info">
          <h1>{movie.title}</h1>
          <p style={{ color: 'var(--muted)' }}>
            {movie.release_date?.slice(0, 4)}{movie.runtime ? ` · ${movie.runtime} min` : ''}
          </p>
          <div className="detail-rating">★ {movie.vote_average?.toFixed(1)}</div>

          <div className="detail-genres">
            {movie.genres?.map(g => (
              <span key={g.id} className="genre-tag">{g.name}</span>
            ))}
          </div>

          <div className="detail-actions">
            {inList.watchlist
              ? <button className="btn btn-accent active" onClick={() => remove('watchlist')}>✓ In Watchlist</button>
              : <button className="btn btn-outline" onClick={() => add('watchlist')}>Add to Watchlist</button>}
            {inList.watched
              ? <button className="btn btn-accent active" onClick={() => remove('watched')}>✓ Watched</button>
              : <button className="btn btn-outline" onClick={() => add('watched')}>Mark Watched</button>}
          </div>

          {trailer && (
            <a
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noopener"
              className="btn btn-outline"
              style={{ display: 'inline-block', marginBottom: 16 }}
            >
              ▶ Watch Trailer
            </a>
          )}

          {movie.overview && <div className="detail-overview">{movie.overview}</div>}
        </div>
      </div>

      {movie.credits?.cast && movie.credits.cast.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2>Cast</h2>
          <div className="actors-row">
            {movie.credits.cast.slice(0, 12).map(p => (
              <div className="actor-card" key={p.id}>
                <img src={img(p.profile_path, 'w185')} alt={p.name} />
                <div className="name">{p.name}</div>
                <div className="role">{p.character}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {movie.similar?.results && movie.similar.results.length > 0 && (
        <div>
          <h2>Similar Movies</h2>
          <div className="similar-row">
            {movie.similar.results.slice(0, 8).map(s => (
              <Link to={`/movie/${s.id}`} key={s.id} className="similar-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                <img src={img(s.poster_path, 'w185')} alt={s.title} />
                <div className="title">{s.title}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
