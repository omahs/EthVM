<template>
    <v-app>
        <the-app-navigation-drawer />
        <v-main>
            <router-view :tokens="ethereumTokens" />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import TheAppNavigationDrawer from '@core/components/TheAppNavigationDrawer.vue'
import { useStore } from '@/store'

const store = useStore()

const { ethereumTokens } = useCoinData()
store.tokenPrices = ethereumTokens
</script>

<style lang="scss">
.v-application {
    background-color: #f3f4f8;
}
</style>
