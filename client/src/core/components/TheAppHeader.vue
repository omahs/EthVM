<template>
    <v-app-bar color="white">
        <v-row>
            <v-btn v-if="md || sm || xs" icon color="primary" @click.stop="$emit('openDrawer')">
                <v-icon>mdi-menu</v-icon>
            </v-btn>
            <v-spacer />
            <v-col cols="4">
                <module-search />
                <!-- <app-search /> -->
            </v-col>
        </v-row>
    </v-app-bar>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/framework.mjs'
// import AppSearch from './AppSearch.vue'
import ModuleSearch from '@module/search/ModuleSearch.vue'
/* Vuetify BreakPoints */
const { md, xs, sm } = useDisplay()
/*Define Emit Events */
const emit = defineEmits(['openDrawer'])
</script>
