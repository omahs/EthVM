<template>
    <v-app class="app-view">
        <the-app-navigation-drawer-vue />
        <the-app-header :hide-search-bar="isHomeView" :is-transparent="isLost || isHomeView" />
        <v-main class="w-100">
            <v-container :class="[isAddressView || isHomeView || isLost ? 'pa-0' : 'px-2 px-sm-6 pt-4 pt-sm-6']" :fluid="isAddressView || isHomeView || isLost">
                <router-view />
            </v-container>
            <the-notifications />
        </v-main>
        <the-app-footer />
    </v-app>
</template>

<script setup lang="ts">
import TheAppHeader from './core/components/TheAppHeader.vue'
import TheAppFooter from '@core/components/TheAppFooter.vue'
import TheAppNavigationDrawerVue from './core/components/TheAppNavigationDrawer.vue'
import TheNotifications from './core/components/TheNotifications.vue'
import { useStore } from '@/store'
import { useGetLatestPricesQuery } from '@core/composables/CoinData/getLatestPrices.generated'
import { useSetPortfolio } from './core/composables/Portfolio/useSetPortfolioBalance'
import { computed, watch, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ROUTE_NAME } from '@core/router/routesNames'
import { useStorage } from '@vueuse/core'
import { usePreferredColorScheme } from '@vueuse/core'
import { useTheme } from 'vuetify/lib/framework.mjs'
import { themes } from './core/plugins/vuetify'
import { useNetwork } from './core/composables/Network/useNetwork'

const store = useStore()
const { supportsFiat } = useNetwork()

const {
    result: coinData,
    loading: loadingCoinData,
    onResult: onCoinDataResult
} = useGetLatestPricesQuery({ pollInterval: 300000, enabled: supportsFiat.value })
store.loadingCoinData = loadingCoinData.value

onCoinDataResult(() => {
    store.coinData = coinData.value
    store.loadingCoinData = false
})

const route = useRoute()
/**
 * Checks if Address View Only
 * Remove all paddings/margins and sets container to fluid
 * This is done to accomodate addree view ui
 * Address view must control breakpoints
 */
const isAddressView = computed<boolean>(() => {
    return (
        route.name === ROUTE_NAME.ADDRESS.NAME ||
        route.name === ROUTE_NAME.ADDRESS_BALANCE.NAME ||
        route.name === ROUTE_NAME.ADDRESS_NFTS.NAME ||
        route.name === ROUTE_NAME.ADDRESS_TOKENS.NAME
    )
})

const isHomeView = computed<boolean>(() => {
    return route.name === ROUTE_NAME.HOME.NAME
})

const isLost = computed<boolean>(() => {
    return route.name === ROUTE_NAME.NOT_FOUND.NAME
})

/*
===================================================================================
 Handle   PORTFOLIO
 Fetches eth balances for for the addresses in the portfolio
===================================================================================
*/
interface SetPortfolio {
    refetchBalance: () => void
    setHash: (hash: string) => void
    pauseUpdates: (_pause: boolean) => void
}

interface PortfolioState {
    adrs: string[]
    functions: SetPortfolio[]
}
const portfolioState = reactive<PortfolioState>({
    adrs: [],
    functions: []
})

store.portfolio.forEach(i => {
    portfolioState.adrs.push(i.hash.toLowerCase())
})

while (portfolioState.adrs.length < 10) {
    portfolioState.adrs.push('')
}

let index = 0
while (index < 10) {
    portfolioState.functions.push(useSetPortfolio(portfolioState.adrs[index]))
    index = ++index
}

watch(
    () => store.portfolioLength,
    (newLength, oldLength) => {
        let index: number
        if (newLength > oldLength) {
            //Added New Address
            const newAdr = store.portfolio.filter(i => !portfolioState.adrs.includes(i.hash.toLowerCase()))
            index = portfolioState.adrs.indexOf('')
            portfolioState.adrs[index] = newAdr[0].hash
        } else {
            //Deleted an Address
            const deleted = portfolioState.adrs.filter(i => i !== '' && !store.addressHashIsSaved(i))
            index = portfolioState.adrs.indexOf(deleted[0])
            portfolioState.adrs[index] = ''
            store.checkBalanceMap()
        }
        portfolioState.functions[index].setHash(portfolioState.adrs[index])
    }
)
watch(
    () => isAddressView,
    newVal => {
        if (newVal) {
            portfolioState.functions.forEach(composable => {
                composable.pauseUpdates(true)
            })
        } else {
            portfolioState.functions.forEach(composable => {
                composable.refetchBalance()
                composable.pauseUpdates(false)
            })
        }
    }
)

/** -------------------
 * OLD STORE Migration
 * --------------------*/

interface OldToken {
    address: string
    symbol: string
}

const oldTokens = useStorage('favToksData', [] as OldToken[])
if (oldTokens.value.length > 0) {
    oldTokens.value.forEach(i => {
        if (!store.tokenIsFav(i.address)) {
            store.addFavToken(i.address)
        }
    })
}
oldTokens.value = null

interface oldAdrBook {
    address: string
    name: string
}

const oldAdrs = useStorage('favAdrsData', [] as oldAdrBook[])
if (oldAdrs.value.length > 0) {
    oldAdrs.value.forEach(i => {
        if (!store.addressHashIsSaved(i.address, true) && !store.addressHashIsSaved(i.address)) {
            store.addAddress(i.address, i.name, true)
        }
    })
}
oldAdrs.value = null

/** -------------------
 * Set Default Theme
 * --------------------*/
const theme = useTheme()
onMounted(() => {
    const preferredColor = usePreferredColorScheme()
    if (store.appTheme) {
        theme.global.name.value = store.appTheme
    } else {
        theme.global.name.value = preferredColor.value === 'dark' ? themes.dark : themes.light
        store.setDarkMode(theme.global.name.value)
    }
})
</script>
<style lang="scss">
.app-view {
    min-width: 320px;
}
</style>
