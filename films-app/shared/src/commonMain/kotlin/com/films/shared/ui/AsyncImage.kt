package com.films.shared.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color

@Composable
fun AsyncImage(url: String?, contentDescription: String?, modifier: Modifier = Modifier) {
    // Placeholder - on each platform we'd use a proper image loader
    // For now, render a colored box with first letter
    Box(
        modifier = modifier.background(DarkSurface),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = contentDescription?.take(1) ?: "?",
            color = Muted,
            fontSize = androidx.compose.ui.unit.TextUnit.Unspecified
        )
    }
}
