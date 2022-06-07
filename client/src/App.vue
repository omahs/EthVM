<template>
    <v-app>
        <the-app-navigation-drawer />
        <v-main>
            <router-view :tokens="ethereumTokens" />
        </v-main>
    </v-app>
</template>

<script setup lang="ts">
import { onMounted, provide } from 'vue'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import TheAppNavigationDrawer from '@core/components/TheAppNavigationDrawer.vue'
import { useStore } from '@/store'

const store = useStore()

const { ethereumTokens, filteredLatestPrice } = useCoinData()
store.tokenPrices = ethereumTokens
console.log(store.tokenPrices)
</script>

<style lang="scss">
.v-application {
    background-color: #f3f4f8;
}
</style>
