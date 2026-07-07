import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { tmdbApi, getImageUrl } from '../services/api';
import { useMovieStore } from '../store/useMovieStore';
import { MovieDetail, GENRE_MAP } from '../types';

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const { addToWatchlist, markWatched, addToFavorites, watchlist, watched, favorites } = useMovieStore();

  useEffect(() => {
    if (id) {
      tmdbApi.movieDetail(Number(id)).then(setMovie);
    }
  }, [id]);

  if (!movie) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  const isInWatchlist = watchlist.some(m => m.tmdb_id === movie.id);
  const isInWatched = watched.some(m => m.tmdb_id === movie.id);
  const isInFavorites = favorites.some(m => m.tmdb_id === movie.id);

  const trailer = movie.videos?.results?.find(
    v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: getImageUrl(movie.backdrop_path, 'w780') }} style={styles.backdrop} />

      <View style={styles.content}>
        <Image source={{ uri: getImageUrl(movie.poster_path, 'w342') }} style={styles.poster} />

        <View style={styles.meta}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.year}>
            {movie.release_date?.slice(0, 4)} · {movie.runtime ? `${movie.runtime} мин` : ''}
          </Text>
          <Text style={styles.rating}>★ {movie.vote_average?.toFixed(1)}</Text>
        </View>

        <View style={styles.genres}>
          {movie.genres?.map(g => (
            <View key={g.id} style={styles.genreTag}>
              <Text style={styles.genreText}>{g.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, isInWatchlist && styles.actionBtnActive]}
            onPress={() => addToWatchlist(movie.id)}
          >
            <Ionicons name="eye-outline" size={20} color={isInWatchlist ? '#fff' : '#8892b0'} />
            <Text style={[styles.actionText, isInWatchlist && styles.actionTextActive]}>Хочу</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, isInWatched && styles.actionBtnActive]}
            onPress={() => markWatched(movie.id)}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={isInWatched ? '#fff' : '#8892b0'} />
            <Text style={[styles.actionText, isInWatched && styles.actionTextActive]}>Просмотрено</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, isInFavorites && styles.actionBtnActive]}
            onPress={() => addToFavorites(movie.id)}
          >
            <Ionicons name="heart-outline" size={20} color={isInFavorites ? '#fff' : '#8892b0'} />
            <Text style={[styles.actionText, isInFavorites && styles.actionTextActive]}>В избранное</Text>
          </TouchableOpacity>
        </View>

        {movie.overview ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Описание</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>
        ) : null}

        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Актёры</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {movie.credits.cast.slice(0, 10).map(person => (
                <View key={person.id} style={styles.actorCard}>
                  <Image
                    source={{ uri: getImageUrl(person.profile_path, 'w185') }}
                    style={styles.actorPhoto}
                  />
                  <Text style={styles.actorName} numberOfLines={1}>{person.name}</Text>
                  <Text style={styles.actorRole} numberOfLines={1}>{person.character}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {movie.similar?.results && movie.similar.results.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Похожие фильмы</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {movie.similar.results.slice(0, 8).map(sim => (
                <TouchableOpacity
                  key={sim.id}
                  style={styles.similarCard}
                  onPress={() => router.push(`/movie/${sim.id}`)}
                >
                  <Image source={{ uri: getImageUrl(sim.poster_path, 'w185') }} style={styles.similarPoster} />
                  <Text style={styles.similarTitle} numberOfLines={2}>{sim.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  loading: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
    marginTop: -60,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  meta: {
    marginBottom: 12,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  year: {
    color: '#8892b0',
    fontSize: 14,
    marginBottom: 4,
  },
  rating: {
    color: '#e6b800',
    fontSize: 18,
    fontWeight: '700',
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  genreTag: {
    backgroundColor: '#16213e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreText: {
    color: '#8892b0',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#16213e',
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionBtnActive: {
    backgroundColor: '#e94560',
  },
  actionText: {
    color: '#8892b0',
    fontSize: 12,
    fontWeight: '600',
  },
  actionTextActive: {
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  overview: {
    color: '#ccd6f6',
    fontSize: 15,
    lineHeight: 22,
  },
  actorCard: {
    width: 80,
    marginRight: 12,
    alignItems: 'center',
  },
  actorPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 6,
  },
  actorName: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  actorRole: {
    color: '#8892b0',
    fontSize: 10,
    textAlign: 'center',
  },
  similarCard: {
    width: 120,
    marginRight: 12,
  },
  similarPoster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 6,
  },
  similarTitle: {
    color: '#fff',
    fontSize: 12,
  },
});
