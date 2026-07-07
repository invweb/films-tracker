package com.films.shared.api

import com.films.shared.model.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json

class FilmsApi(private val baseUrl: String = "http://localhost:3001/api") {

    private val client = HttpClient {
        install(ContentNegotiation) {
            json(Json {
                ignoreUnknownKeys = true
                isLenient = true
            })
        }
    }

    suspend fun search(query: String): List<Movie> {
        return client.get("$baseUrl/tmdb/search") {
            parameter("query", query)
        }.body<MovieResponse>().results
    }

    suspend fun trending(): List<Movie> {
        return client.get("$baseUrl/tmdb/trending").body<MovieResponse>().results
    }

    suspend fun upcoming(): List<Movie> {
        return client.get("$baseUrl/tmdb/upcoming").body<MovieResponse>().results
    }

    suspend fun movieDetail(id: Int): Movie {
        return client.get("$baseUrl/tmdb/movie/$id").body()
    }

    suspend fun recommendations(): List<Movie> {
        return client.get("$baseUrl/tmdb/recommendations").body<MovieResponse>().results
    }

    suspend fun getWatchlist(): List<UserMovie> {
        return client.get("$baseUrl/movies") {
            parameter("list_type", "watchlist")
        }.body()
    }

    suspend fun getWatched(): List<UserMovie> {
        return client.get("$baseUrl/movies") {
            parameter("list_type", "watched")
        }.body()
    }

    suspend fun getFavorites(): List<UserMovie> {
        return client.get("$baseUrl/movies") {
            parameter("list_type", "favorites")
        }.body()
    }

    suspend fun addToWatchlist(tmdbId: Int): UserMovie {
        return client.post("$baseUrl/movies") {
            setBody(mapOf("tmdb_id" to tmdbId, "list_type" to "watchlist"))
        }.body()
    }

    suspend fun markWatched(tmdbId: Int, rating: Int? = null): UserMovie {
        return client.post("$baseUrl/movies") {
            setBody(mapOf("tmdb_id" to tmdbId, "list_type" to "watched", "rating" to rating))
        }.body()
    }

    suspend fun addToFavorites(tmdbId: Int): UserMovie {
        return client.post("$baseUrl/movies") {
            setBody(mapOf("tmdb_id" to tmdbId, "list_type" to "favorites"))
        }.body()
    }

    suspend fun removeFromList(tmdbId: Int, listType: String) {
        client.delete("$baseUrl/movies/$tmdbId/$listType")
    }

    suspend fun getStats(): Stats {
        return client.get("$baseUrl/movies/stats").body()
    }
}
