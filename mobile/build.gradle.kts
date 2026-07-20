plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }

android {
    namespace = "ani.lehava.jclock.mobile"
    compileSdk = 35
    defaultConfig { applicationId = "simchanaftali669.jclock"; minSdk = 26; targetSdk = 35; versionCode = 16; versionName = "0.4.3" }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
    sourceSets.getByName("main").assets.srcDir("../site/public/apps/birth-calculator/shared")
}

dependencies {
    implementation("androidx.activity:activity-ktx:1.10.0")
    implementation("androidx.fragment:fragment:1.3.0")
    implementation("com.garmin.connectiq:ciq-companion-app-sdk:2.4.0@aar")
    implementation("com.google.android.gms:play-services-location:21.3.0")
    implementation("com.google.android.gms:play-services-wearable:19.0.0")
    testImplementation("junit:junit:4.13.2")
}
