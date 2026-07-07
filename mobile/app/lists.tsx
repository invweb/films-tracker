import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import ListTabs from '../components/ListTabs';
import MovieCard from '../components/MovieCard';
import { useMovieStore } from '../store/useMovieStore';
import { UserMovie } from '../types';

export default function ListsScreen() {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'watched' | 'favorites'>('watchlist');
  const { watchlist, watched, favorites, fetchAll, removeFromList, stats, fetchStats } = useMovieStore();

  useFocusEffect(
    useCallback(() => {
      fetchAll();
      fetchStats();
    }, [])
  );

  const currentList = activeTab === 'watchlist' ? watchlist : activeTab === 'watched' ? watched : favorites;

  const handleLongPress = (movie: UserMovie) => {
    Alert.alert(
      movie.title || `Film #${movie.tmdb_id}`,
      'Действия',
      [
        {
          text: 'Удалить из списка',
          style: 'destructive',
          onPress: () => removeFromList(movie.tmdb_id, activeTab),
        },
        { text: 'Отмена', style: 'cancel' },
      ]
    );
  };

  const counts = {
    watchlist: watchlist.length,
    watched: watched.length,
    favorites: favorites.length,
  };

  return (
    <View style={styles.container}>
      {stats && (
        <View style={styles.statsRow}>
          <Text style={styles.statItem}>★ Средний: {stats.avgRating || '—'}</Text>
        </View>
      )}
      <ListTabs active={activeTab} onChange={setActiveTab} counts={counts} />
      <FlatList
        data={currentList}
        keyExtractor={item => `${item.tmdb_id}-${item.list_type}`}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleLongPress(item)}>
            <MovieCard
              movie={{
                id: item.tmdb_id,
                title: item.title || `Film #${item.tmdb_id}`,
                poster_path: item.poster_path || null,
                backdrop_path: item.backdrop_path || null,
                overview: item.overview || '',
                release_date: item.release_date || '',
                vote_average: item.vote_average || 0,
              }}
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Список пуст</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    color: '#e6b800',
    fontSize: 14,
    fontWeight: '600',
  },
  empty: {
    color: '#8892b0',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
