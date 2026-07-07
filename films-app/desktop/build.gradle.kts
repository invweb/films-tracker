plugins {
    kotlin("multiplatform")
    id("org.jetbrains.compose")
    id("org.jetbrains.kotlin.plugin.compose")
}

kotlin {
    jvm("desktop")
}

dependencies {
    "desktopMainImplementation"(project(":shared"))
    "desktopMainImplementation"(compose.desktop.currentOs)
    "desktopMainImplementation"(compose.material3)
    "desktopMainImplementation"(compose.foundation)
}

compose.desktop {
    application {
        mainClass = "com.films.desktop.MainKt"
        nativeDistributions {
            targetFormats(org.jetbrains.compose.desktop.application.dsl.TargetFormat.Dmg, org.jetbrains.compose.desktop.application.dsl.TargetFormat.Msi)
            packageName = "Films"
            packageVersion = "1.0.0"
        }
    }
}
