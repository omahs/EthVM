<template>
    <!--
        ========================
          VIEW: Overview
        =========================
        -->
    <v-card v-if="isOverview" class="pa-4 pa-sm-6" elevation="1" rounded="xl" height="100%">
        <address-balance-totals :title="`${currencyName} Balance`" :is-loading="loadingBalanceData" :balance="`${balanceFormatted} ${currencyName}`">
            <template #extra>
                <v-col v-if="loadingMarketInfo || loadingBalanceData" cols="6" sm="4" md="6" class="pa-0">
                    <div class="skeleton-box rounded-xl mt-1" style="height: 24px"></div>
                </v-col>
                <p v-else class="text-h5 font-weight-regular">{{ balanceFiatFormatted }}</p>
            </template>
        </address-balance-totals>
        <!-- <div class="temp-chart pa-4 rounded-xl">
            <p>Chart Area</p>
        </div> -->
    </v-card>
    <!--
        ========================
          VIEW: Eth Balance and History
        =========================
        -->

    <div v-else>
        <!--
        ========================
            XS & SM: Eth Balance & USD VALUE
        =========================
        -->
        <address-balance-totals :title="`${currencyName} Balance`" :is-loading="loadingBalanceData" :balance="`${balanceFormatted} ${currencyName}`">
            <template #extra>
                <v-col v-if="loadingMarketInfo || loadingBalanceData" cols="6" sm="4" md="6" class="pa-0">
                    <div class="skeleton-box rounded-xl mt-1" style="height: 24px"></div>
                </v-col>
                <p v-else class="text-h4 font-weight-medium">{{ balanceFiatFormatted }}</p>
            </template>
        </address-balance-totals>
        <!--
        ========================
            MD and UP: ICON & Eth title
        =========================
        -->
        <!-- <div v-else class="d-flex align-end pt-11 mb-12">
            <app-token-icon :token-icon="ethTokenIcon" img-size="40px"></app-token-icon>
            <p class="text-h3 pl-2">Ethereum <span class="text-info text-body-1 pl-3">ETH</span></p>
        </div> -->
        <v-row :dense="xs" class="mt-1">
            <!--
            ========================
                MD and UP: ETH Balance
            =========================
            -->
            <!-- <v-col v-if="!isSmallView" cols="4" lg="3">
                <p class="text-info text-h6">Balance</p>
                <div v-if="loadingBalanceData" class="skeleton-box rounded-xl" style="height: 28px"></div>

                <p v-else class="text-h4 font-weight-bold">{{ balanceFormatted }}</p>
            </v-col> -->
            <!--
            ========================
                MD and UP: FIAT Balance
            =========================
            -->
            <!-- <v-col v-if="!isSmallView" cols="4" lg="3">
                <p class="text-info text-h6">USD Value</p>
                <div v-if="loadingMarketInfo || loadingBalanceData" class="skeleton-box rounded-xl" style="height: 28px"></div>

                <p v-else class="text-h4 font-weight-bold">{{ balanceFiatFormatted }}</p>
            </v-col> -->
            <!--
            ========================
                XS and UP: Price
            =========================
            -->
            <v-col cols="6" md="4" lg="3" class="mt-4">
                <p class="'text-caption mb-1 text-info">Price</p>
                <div v-if="loadingMarketInfo" class="skeleton-box rounded-xl" style="height: 20px"></div>
                <p v-else :class="'text-body-1'">
                    {{ priceFiatFormatted }}
                </p>
            </v-col>
            <!--
            ========================
                XS and SM: Price Change
            =========================
            -->
            <v-col cols="6" md="4" lg="3" class="mt-4">
                <p class="text-caption mb-1 text-info">24h Change</p>
                <div v-if="loadingMarketInfo" class="skeleton-box rounded-xl" style="height: 20px"></div>
                <p v-else :class="['text-body-1', percentageClass]">{{ percentageFormatted }}%</p>
            </v-col>
            <address-token-fiat-info
                v-for="info in fiatInfo"
                :key="info.text"
                :loading="loadingMarketInfo"
                :text="info.text"
                :fiat-value="info.fiat"
            ></address-token-fiat-info>
            <!--
            ========================
                XS and SM: ORDER 1st
                MD and UP: ORDER last
            =========================
            -->
            <!-- <v-col cols="12" :class="isSmallView ? 'mt-4' : 'mt-13'" :order="isSmallView ? 'first' : 'last'">
                <div :class="[isSmallView ? 'temp-chart-balance-mobile' : 'temp-chart-balance', 'pa-4 rounded-xl']">
                    <p>Chart Area</p>
                </div>
            </v-col> -->
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { useAddressEthBalance } from '@core/composables/AddressEthBalance/addressEthBalance.composable'
import BN from 'bignumber.js'
import { formatUsdValue, formatPercentageValue } from '@/core/helper/number-format-helper'
// import AppTokenIcon from '@/core/components/AppTokenIcon.vue'
import AddressBalanceTotals from './components/AddressBalanceTotals.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import AddressTokenFiatInfo from './components/AddressTokenFiatInfo.vue'
import { useNetwork } from '@core/composables/Network/useNetwork'

const { currencyName } = useNetwork()
const props = defineProps({
    addressRef: {
        type: String,
        required: true
    },
    isOverview: {
        type: Boolean,
        default: false
    }
})

/**------------------------
 * Balance (ETH & FIAT) Handling
 -------------------------*/
const { addressRef } = toRefs(props)

const { initialLoad: loadingBalanceData, balanceFiatFormatted, balanceFormatted } = useAddressEthBalance(addressRef)

/**------------------------
 * Price and Change Handling
 -------------------------*/
const { loading: loadingMarketInfo, ethMarketInfo } = useCoinData()

/**
 * Returns formatted ETH price in FIAT
 */
const priceFiatFormatted = computed<string>(() => {
    if (!loadingMarketInfo.value) {
        const ethPrice = new BN(ethMarketInfo.value?.current_price || 0)
        return formatUsdValue(ethPrice).value
    }
    return '$0.00'
})
/**
 * Returns formatted percentage price change
 */
const percentageFormatted = computed<string>(() => {
    if (!loadingMarketInfo.value) {
        const percentage = new BN(ethMarketInfo?.value?.price_change_percentage_24h || 0)
        return formatPercentageValue(percentage).value
    }
    return '$0.00'
})
/**
 * Returns percentage  change  text color (error, success).
 * No change: black text
 */
const percentageClass = computed<string>(() => {
    if (!loadingMarketInfo.value) {
        const percentage = new BN(ethMarketInfo?.value?.price_change_percentage_24h || 0)
        return percentage.isNegative() ? 'text-error' : 'text-success'
    }
    return ''
})

/**------------------------
 * Other ETH market Info
 -------------------------*/
interface FiatInfo {
    text: string
    fiat: BN
}
const fiatInfo = computed<FiatInfo[]>(() => {
    return [
        {
            text: 'Market Cap',
            fiat: new BN(ethMarketInfo.value?.market_cap || 0)
        },
        {
            text: 'Circulating Supply',
            fiat: new BN(ethMarketInfo.value?.circulating_supply || 0)
        },
        {
            text: '24h Trading Volume',
            fiat: new BN(ethMarketInfo.value?.total_volume || 0)
        },
        {
            text: 'Total Supply',
            fiat: new BN(ethMarketInfo?.value?.total_supply || 0)
        },
        {
            text: '24h High',
            fiat: new BN(ethMarketInfo.value?.high_24h || 0)
        },
        {
            text: '24h low',
            fiat: new BN(ethMarketInfo.value?.low_24h || 0)
        }
    ]
})

/**
 * Returns formatted ETH balance in FIAT
 */
// const ethTokenIcon = computed<string | undefined>(() => {
//     if (ethMarketInfo.value) {
//         return ethMarketInfo.value.image
//     }
//     return undefined
// })

/**------------------------
 * Display Helpers
 -------------------------*/
const { xs } = useDisplay()

/**
 * Return true if on mobile size screen
 */
// const isSmallView = computed<boolean>(() => {
//     return xs.value || sm.value
// })
</script>
<style lang="scss" scoped>
.temp-chart {
    height: 120px;
    background-color: #ecf2f7;
}

.temp-chart-balance {
    height: 276px;
    background-color: #ecf2f7;
}
.temp-chart-balance-mobile {
    height: 94px;
    background-color: #ecf2f7;
}
</style>
