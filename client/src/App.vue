<template>
    <v-app>
        <v-app-bar color="primary" density="compact">
            <v-container>
                <v-app-bar-title>Harmony Prototype</v-app-bar-title>
            </v-container>
        </v-app-bar>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { ApolloClients } from '@vue/apollo-composable'
import clients from './apollo'
provide(ApolloClients, clients)
</script>
