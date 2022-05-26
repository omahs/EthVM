<template>
    <v-app-bar color="white" flat>
        <v-btn v-if="md || sm || xs" icon color="primary" @click.stop="$emit('openDrawer')">
            <v-icon>mdi-menu</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/framework.mjs'
/* Vuetify BreakPoints */
const { md, xs, sm } = useDisplay()
/*Define Emit Events */
const emit = defineEmits(['openDrawer'])
</script>
