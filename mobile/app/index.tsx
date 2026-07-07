import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { tmdbApi } from '../services/api';
import { useMovieStore } from '../store/useMovieStore';
import { Movie } from '../types';
import { useFocusEffect } from 'expo-router';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [searching, setSearching] = useState(false);
  const { addToWatchlist } = useMovieStore();

  useFocusEffect(
    useCallback(() => {
      tmdbApi.trending().then(data => setTrending(data.results || []));
    }, [])
  );

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const data = await tmdbApi.search(text);
      setResults(data.results || []);
    } catch {}
    setSearching(false);
  };

  const handleAddToWatchlist = (movie: Movie) => {
    Alert.alert(
      'Добавить в список',
      movie.title,
      [
        { text: 'Хочу посмотреть', onPress: () => addToWatchlist(movie.id) },
        { text: 'Отмена', style: 'cancel' },
      ]
    );
  };

  const movies = query.trim().length >= 2 ? results : trending;
  const label = query.trim().length >= 2 ? 'Результаты' : 'Сейчас в тренде';

  return (
    <View style={styles.container}>
      <SearchBar value={query} onChangeText={handleSearch} />
      <Text style={styles.label}>{label} {searching ? '...' : ''}</Text>
      <FlatList
        data={movies}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={() => handleAddToWatchlist(item)} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {query.trim().length >= 2 ? 'Ничего не найдено' : 'Загрузка...'}
          </Text>
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
  label: {
    color: '#8892b0',
    fontSize: 13,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  empty: {
    color: '#8892b0',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
