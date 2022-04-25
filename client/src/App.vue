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

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'App',

    data() {
        return {
            //
        }
    }
})
</script>
