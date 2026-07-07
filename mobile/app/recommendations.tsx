import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import MovieCard from '../components/MovieCard';
import { tmdbApi } from '../services/api';
import { Movie } from '../types';

export default function RecommendationsScreen() {
  const [recs, setRecs] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      tmdbApi.recommendations().then(data => {
        setRecs(data.results || []);
        setLoading(false);
      });
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Рекомендации для тебя</Text>
      <Text style={styles.sub}>
        На основе твоих просмотренных фильмов
      </Text>
      <FlatList
        data={recs}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <MovieCard movie={item} />}
        ListEmptyComponent={
          <Text style={styles.empty}>{loading ? 'Загрузка...' : 'Добавь фильмы в «Просмотрено» для рекомендаций'}</Text>
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
  header: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sub: {
    color: '#8892b0',
    fontSize: 13,
    marginBottom: 16,
  },
  empty: {
    color: '#8892b0',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
