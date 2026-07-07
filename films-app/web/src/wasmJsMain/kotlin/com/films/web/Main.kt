package com.films.web

import androidx.compose.runtime.*
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.window.CanvasBasedWindow
import com.films.shared.api.FilmsApi
import com.films.shared.ui.*

@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    CanvasBasedWindow(title = "Films", width = 1280, height = 800) {
        val api = remember { FilmsApi() }
        var currentScreen by remember { mutableStateOf("search") }
        var selectedMovieId by remember { mutableIntStateOf(0) }

        MaterialTheme(colorScheme = darkColorScheme()) {
            Surface(modifier = Modifier.fillMaxSize().background(DarkBg)) {
                when (currentScreen) {
                    "search" -> SearchScreen(api) { id -> selectedMovieId = id; currentScreen = "detail" }
                    "lists" -> ListsScreen(api) { id -> selectedMovieId = id; currentScreen = "detail" }
                    "calendar" -> CalendarScreen(api)
                    "recs" -> RecommendationsScreen(api) { id -> selectedMovieId = id; currentScreen = "detail" }
                    "detail" -> MovieDetailScreen(api, selectedMovieId, { currentScreen = "search" }) { id -> selectedMovieId = id }
                }
            }
        }
    }
}
