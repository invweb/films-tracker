package com.films.shared.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.films.shared.api.FilmsApi
import com.films.shared.model.Movie
import kotlinx.coroutines.launch

@Composable
fun MovieDetailScreen(api: FilmsApi, movieId: Int, onBack: () -> Unit, onMovieClick: (Int) -> Unit) {
    val scope = rememberCoroutineScope()
    var movie by remember { mutableStateOf<Movie?>(null) }
    var inWatchlist by remember { mutableStateOf(false) }
    var inWatched by remember { mutableStateOf(false) }

    LaunchedEffect(movieId) {
        movie = api.movieDetail(movieId)
        val watchlist = api.getWatchlist()
        val watched = api.getWatched()
        inWatchlist = watchlist.any { it.tmdb_id == movieId }
        inWatched = watched.any { it.tmdb_id == movieId }
    }

    val m = movie ?: return

    LazyColumn(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        item {
            TextButton(onClick = onBack) {
                Text("← Back to Search", color = Muted, fontSize = 14.sp)
            }
            Spacer(modifier = Modifier.height(8.dp))
        }

        item {
            Row(modifier = Modifier.fillMaxWidth()) {
                AsyncImage(
                    url = m.poster_path,
                    contentDescription = m.title,
                    modifier = Modifier
                        .width(280.dp)
                        .height(420.dp)
                        .clip(RoundedCornerShape(12.dp))
                )
                Spacer(modifier = Modifier.width(24.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(m.title, color = TextWhite, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        "${m.release_date.take(4)}${m.runtime?.let { " · $it min" } ?: ""}",
                        color = Muted, fontSize = 14.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("★ ${"%.1f".format(m.vote_average)}", color = Gold, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(12.dp))

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        m.genres.forEach { genre ->
                            SuggestionChip(
                                onClick = {},
                                label = { Text(genre.name, fontSize = 12.sp) }
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(
                            onClick = {
                                scope.launch {
                                    if (inWatchlist) {
                                        api.removeFromList(movieId, "watchlist")
                                        inWatchlist = false
                                    } else {
                                        api.addToWatchlist(movieId)
                                        inWatchlist = true
                                    }
                                }
                            },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (inWatchlist) Accent else Color.Transparent
                            )
                        ) {
                            Text(if (inWatchlist) "✓ In Watchlist" else "Add to Watchlist")
                        }
                        Button(
                            onClick = {
                                scope.launch {
                                    if (inWatched) {
                                        api.removeFromList(movieId, "watched")
                                        inWatched = false
                                    } else {
                                        api.markWatched(movieId)
                                        inWatched = true
                                    }
                                }
                            },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (inWatched) Accent else Color.Transparent
                            )
                        ) {
                            Text(if (inWatched) "✓ Watched" else "Mark Watched")
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))
                    Text(m.overview, color = TextWhite, fontSize = 15.sp, lineHeight = 22.sp)
                }
            }
        }

        if (m.director != null || m.actors != null) {
            item {
                Spacer(modifier = Modifier.height(24.dp))
                Text("Cast", color = TextWhite, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(12.dp))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    m.actors?.split(", ")?.take(10)?.forEach { actor ->
                        item {
                            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.width(80.dp)) {
                                Box(
                                    modifier = Modifier
                                        .size(70.dp)
                                        .clip(CircleShape)
                                        .clickable { },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(actor.take(1), color = TextWhite, fontSize = 24.sp)
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(actor, color = TextWhite, fontSize = 11.sp, maxLines = 1)
                            }
                        }
                    }
                }
            }
        }

        item {
            Spacer(modifier = Modifier.height(24.dp))
            Text("Similar Movies", color = TextWhite, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(12.dp))
        }
    }
}
