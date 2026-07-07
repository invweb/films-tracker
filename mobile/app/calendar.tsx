import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { tmdbApi, getImageUrl } from '../services/api';
import { Movie } from '../types';

export default function CalendarScreen() {
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      tmdbApi.upcoming().then(data => {
        setUpcoming(data.results || []);
        setLoading(false);
      });
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ближайшие премьеры</Text>
      <FlatList
        data={upcoming}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: getImageUrl(item.poster_path, 'w185') }} style={styles.poster} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>
                {item.release_date
                  ? new Date(item.release_date).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Дата неизвестна'}
              </Text>
              <Text style={styles.rating}>★ {item.vote_average?.toFixed(1)}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>{loading ? 'Загрузка...' : 'Нет данных'}</Text>
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
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  poster: {
    width: 80,
    height: 120,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    color: '#e94560',
    fontSize: 13,
    marginBottom: 4,
  },
  rating: {
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
