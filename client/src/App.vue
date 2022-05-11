<template>
    <v-app>
        <the-app-navigation-drawer />
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { ApolloClients } from '@vue/apollo-composable'
import clients from './apollo'
import TheAppNavigationDrawer from '@core/components/TheAppNavigationDrawer.vue'
provide(ApolloClients, clients)
</script>
