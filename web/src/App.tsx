import { Routes, Route, Link, useLocation } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import ListsPage from './pages/ListsPage';
import CalendarPage from './pages/CalendarPage';
import RecsPage from './pages/RecsPage';
import MoviePage from './pages/MoviePage';

const NAV = [
  { to: '/', label: 'Search', icon: '🔍' },
  { to: '/lists', label: 'My Lists', icon: '📋' },
  { to: '/calendar', label: 'Premieres', icon: '📅' },
  { to: '/recs', label: 'For You', icon: '✨' },
];

export default function App() {
  const { pathname } = useLocation();

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="logo">Films</div>
        {NAV.map(n => (
          <Link
            key={n.to}
            to={n.to}
            className={`nav-link${pathname === n.to ? ' active' : ''}`}
          >
            <span className="nav-icon">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
      <main className="content">
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/lists" element={<ListsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/recs" element={<RecsPage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
        </Routes>
      </main>
    </div>
  );
}
