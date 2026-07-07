import { create } from 'zustand';
import { UserMovie, Stats } from '../types';
import { moviesApi } from '../services/api';

interface MovieStore {
  watchlist: UserMovie[];
  watched: UserMovie[];
  favorites: UserMovie[];
  stats: Stats | null;
  loading: boolean;

  fetchAll: () => Promise<void>;
  fetchStats: () => Promise<void>;
  addToWatchlist: (tmdbId: number) => Promise<void>;
  markWatched: (tmdbId: number, rating?: number) => Promise<void>;
  addToFavorites: (tmdbId: number) => Promise<void>;
  removeFromList: (tmdbId: number, listType: string) => Promise<void>;
  updateRating: (tmdbId: number, listType: string, rating: number) => Promise<void>;
  updateNotes: (tmdbId: number, listType: string, notes: string) => Promise<void>;
  exportCsv: () => Promise<string>;
}

export const useMovieStore = create<MovieStore>((set, get) => ({
  watchlist: [],
  watched: [],
  favorites: [],
  stats: null,
  loading: false,

  fetchAll: async () => {
    set({ loading: true });
    try {
      const [watchlist, watched, favorites] = await Promise.all([
        moviesApi.getAll('watchlist'),
        moviesApi.getAll('watched'),
        moviesApi.getAll('favorites'),
      ]);
      set({ watchlist, watched, favorites });
    } finally {
      set({ loading: false });
    }
  },

  fetchStats: async () => {
    const stats = await moviesApi.stats();
    set({ stats });
  },

  addToWatchlist: async (tmdbId: number) => {
    await moviesApi.add({ tmdb_id: tmdbId, list_type: 'watchlist' });
    await get().fetchAll();
  },

  markWatched: async (tmdbId: number, rating?: number) => {
    await moviesApi.add({ tmdb_id: tmdbId, list_type: 'watched', rating });
    await get().fetchAll();
  },

  addToFavorites: async (tmdbId: number) => {
    await moviesApi.add({ tmdb_id: tmdbId, list_type: 'favorites' });
    await get().fetchAll();
  },

  removeFromList: async (tmdbId: number, listType: string) => {
    await moviesApi.remove(tmdbId, listType);
    await get().fetchAll();
  },

  updateRating: async (tmdbId: number, listType: string, rating: number) => {
    await moviesApi.add({ tmdb_id: tmdbId, list_type: listType, rating });
    await get().fetchAll();
  },

  updateNotes: async (tmdbId: number, listType: string, notes: string) => {
    await moviesApi.add({ tmdb_id: tmdbId, list_type: listType, notes });
    await get().fetchAll();
  },

  exportCsv: async () => {
    return moviesApi.exportCsv();
  },
}));
