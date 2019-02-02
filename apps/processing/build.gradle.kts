import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
  val ktlintVersion = "6.3.1"

  base
  kotlin("jvm") version "1.3.10" apply false
  id("org.jlleitschuh.gradle.ktlint") version ktlintVersion apply false
  id("org.jlleitschuh.gradle.ktlint-idea") version ktlintVersion apply true
  id("com.jfrog.bintray") version "1.8.4" apply false
}

allprojects {

  group = "io.enkrypt.ethvm"

  repositories {
    mavenLocal()
    jcenter()
    maven("https://jitpack.io")
    maven("https://packages.confluent.io/maven/")
    maven("https://oss.sonatype.org/content/repositories/releases/")
    maven("https://dl.bintray.com/enkryptio/maven/")
    maven("https://dl.bintray.com/ethereum/maven/")
  }

  tasks.withType<KotlinCompile> {
    kotlinOptions.jvmTarget = "1.8"
  }

  ext {
    set("ethereumj-version", "1.10.0.1")
    set("kotlintest-version", "3.1.11")
    set("mockk-version", "1.8.13")
  }

}