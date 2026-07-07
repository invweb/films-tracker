import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { moviesApi, img } from '../services/api';
import { UserMovie } from '../types';

type Tab = 'watchlist' | 'watched' | 'favorites';

const TABS: { key: Tab; label: string }[] = [
  { key: 'watchlist', label: 'Watchlist' },
  { key: 'watched', label: 'Watched' },
  { key: 'favorites', label: 'Favorites' },
];

export default function ListsPage() {
  const [tab, setTab] = useState<Tab>('watchlist');
  const [items, setItems] = useState<UserMovie[]>([]);
  const [counts, setCounts] = useState<Record<Tab, number>>({ watchlist: 0, watched: 0, favorites: 0 });

  const load = () => {
    moviesApi.getAll().then(all => {
      setCounts({
        watchlist: all.filter(m => m.list_type === 'watchlist').length,
        watched: all.filter(m => m.list_type === 'watched').length,
        favorites: all.filter(m => m.list_type === 'favorites').length,
      });
      setItems(all.filter(m => m.list_type === tab));
    });
  };

  useEffect(load, [tab]);

  const handleRemove = async (tmdbId: number) => {
    await moviesApi.remove(tmdbId, tab);
    load();
  };

  return (
    <div>
      <h1>My Lists</h1>
      <div className="tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`tab${tab === t.key ? ' active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </div>
      {items.map(m => (
        <div className="list-item" key={`${m.tmdb_id}-${m.list_type}`}>
          <Link to={`/movie/${m.tmdb_id}`}>
            <img src={img(m.poster_path ?? null, 'w185')} alt={m.title} />
          </Link>
          <div className="info">
            <h3><Link to={`/movie/${m.tmdb_id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{m.title || `Film #${m.tmdb_id}`}</Link></h3>
            <p>
              {m.release_date?.slice(0, 4)}
              {m.rating ? ` · My Rating: ${m.rating}/10` : ''}
              {m.vote_average ? ` · TMDB: ★ ${m.vote_average.toFixed(1)}` : ''}
            </p>
            {m.notes && <p style={{ marginTop: 4, fontStyle: 'italic' }}>{m.notes}</p>}
          </div>
          <div className="actions">
            <button className="btn btn-outline btn-sm" onClick={() => handleRemove(m.tmdb_id)}>Remove</button>
          </div>
        </div>
      ))}
      {items.length === 0 && <div className="empty">List is empty</div>}
    </div>
  );
}
