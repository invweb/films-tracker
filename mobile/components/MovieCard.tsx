import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Movie } from '../types';
import { getImageUrl } from '../services/api';

interface Props {
  movie: Movie;
  onPress?: () => void;
}

export default function MovieCard({ movie, onPress }: Props) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/movie/${movie.id}`);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.7}>
      <Image source={{ uri: getImageUrl(movie.poster_path, 'w342') }} style={styles.poster} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
        <Text style={styles.date}>{movie.release_date?.slice(0, 4) || '—'}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.rating}>★ {movie.vote_average?.toFixed(1) || '—'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  poster: {
    width: 100,
    height: 150,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    color: '#8892b0',
    fontSize: 13,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#e6b800',
    fontSize: 14,
    fontWeight: '600',
  },
});
