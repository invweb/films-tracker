export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
}

export interface UserMovie {
  id?: number;
  tmdb_id: number;
  list_type: 'watchlist' | 'watched' | 'favorites';
  rating?: number;
  notes?: string;
  tags?: string;
  title?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  created_at?: string;
}

export interface MovieDetail extends Movie {
  runtime?: number;
  genres?: { id: number; name: string }[];
  credits?: {
    cast: { id: number; name: string; character: string; profile_path: string | null }[];
  };
  similar?: { results: Movie[] };
  videos?: {
    results: { id: string; key: string; name: string; site: string; type: string }[];
  };
  status?: string;
}

export interface Stats {
  watchlist: number;
  watched: number;
  favorites: number;
  avgRating: number | null;
}

export const GENRE_MAP: Record<number, string> = {
  28: 'Боевик', 12: 'Приключения', 16: 'Мультфильм', 35: 'Комедия',
  80: 'Криминал', 99: 'Документальный', 18: 'Драма', 10751: 'Семейный',
  14: 'Фэнтези', 36: 'История', 27: 'Ужасы', 10402: 'Музыка',
  9648: 'Детектив', 10749: 'Мелодрама', 878: 'Фантастика', 10770: 'ТВ фильм',
  53: 'Триллер', 10752: 'Военный', 37: 'Вестерн',
};
