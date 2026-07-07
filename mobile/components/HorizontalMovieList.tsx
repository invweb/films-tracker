import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Movie } from '../types';
import { getImageUrl } from '../services/api';

interface Props {
  movies: Movie[];
  onAdd?: (movie: Movie) => void;
}

export default function HorizontalMovieList({ movies, onAdd }: Props) {
  if (movies.length === 0) return null;

  return (
    <View style={styles.container}>
      {movies.map(movie => (
        <TouchableOpacity key={movie.id} style={styles.item} onPress={() => onAdd?.(movie)}>
          <Image source={{ uri: getImageUrl(movie.poster_path, 'w185') }} style={styles.poster} />
          <Text style={styles.title} numberOfLines={2}>{movie.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  item: {
    width: 120,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 6,
  },
  title: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 16,
  },
});
