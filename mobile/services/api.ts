import axios from 'axios';
import { Movie, MovieDetail, TMDBSearchResponse, UserMovie, Stats } from '../types';

const API_BASE = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const tmdbApi = {
  search: async (query: string): Promise<TMDBSearchResponse> => {
    const { data } = await api.get('/tmdb/search', { params: { query } });
    return data;
  },

  trending: async (): Promise<{ results: Movie[] }> => {
    const { data } = await api.get('/tmdb/trending');
    return data;
  },

  upcoming: async (): Promise<{ results: Movie[] }> => {
    const { data } = await api.get('/tmdb/upcoming');
    return data;
  },

  movieDetail: async (id: number): Promise<MovieDetail> => {
    const { data } = await api.get(`/tmdb/movie/${id}`);
    return data;
  },

  recommendations: async (): Promise<{ results: Movie[] }> => {
    const { data } = await api.get('/tmdb/recommendations');
    return data;
  },
};

export const moviesApi = {
  getAll: async (listType?: string, tag?: string): Promise<UserMovie[]> => {
    const params: Record<string, string> = {};
    if (listType) params.list_type = listType;
    if (tag) params.tag = tag;
    const { data } = await api.get('/movies', { params });
    return data;
  },

  add: async (movie: {
    tmdb_id: number;
    list_type: string;
    rating?: number;
    notes?: string;
    tags?: string;
  }): Promise<UserMovie> => {
    const { data } = await api.post('/movies', movie);
    return data;
  },

  remove: async (tmdbId: number, listType: string): Promise<void> => {
    await api.delete(`/movies/${tmdbId}/${listType}`);
  },

  stats: async (): Promise<Stats> => {
    const { data } = await api.get('/movies/stats');
    return data;
  },

  exportCsv: async (): Promise<string> => {
    const { data } = await api.get('/movies/export', { responseType: 'text' });
    return data;
  },
};

export const getImageUrl = (path: string | null, _size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750/1a1a2e/ffffff?text=No+Poster';
  if (path.startsWith('http')) return path;
  return `https://image.tmdb.org/t/p/${_size}${path}`;
};

export default api;
