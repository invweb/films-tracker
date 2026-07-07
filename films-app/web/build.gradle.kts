plugins {
    kotlin("multiplatform")
    id("org.jetbrains.compose")
    id("org.jetbrains.kotlin.plugin.compose")
}

kotlin {
    wasmJs {
        browser()
        binaries.executable()
    }
}

compose.experimental {
    web.application {}
}
