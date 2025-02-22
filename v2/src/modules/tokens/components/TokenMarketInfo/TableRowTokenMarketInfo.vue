<template>
    <app-table-row
        row-align="start"
        row-align-lg="center"
        :color="state.showMoreDetails && xs ? 'pillGrey' : 'transparent'"
        v-on="{ click: xs ? toggleMoreDetails : null }"
    >
        <v-col :cols="colName">
            <v-row align="center" class="ma-0 flex-nowrap">
                <app-btn-icon v-if="!props.isHomeView" :icon="isFav ? 'star' : 'star_outline'" @click="setFavoriteToken" />
                <div :class="['mr-4', { 'ml-5': !props.isHomeView }]">
                    <app-token-icon :token-icon="tokenImage" img-size="32px" class="mr-2" />
                </div>
                <div style="display: grid">
                    <router-link
                        v-if="props.token.symbol || props.token.name"
                        :to="`/token/${props.token.contract}`"
                        class="text-body-1 text-link text-ellipses"
                    >
                        <p class="text-textPrimary text-ellipses">{{ props.token.name }}</p>
                        <span v-if="props.token.symbol" class="text-info text-uppercase text-ellipses">{{ props.token.symbol }}</span>
                    </router-link>
                    <div v-else>
                        <p>Contract:</p>
                        <app-transform-hash :hash="eth.toCheckSum(props.token.contract)" :link="`/token/${props.token.contract}`" :show-name="false" />
                    </div>
                </div>
            </v-row>
        </v-col>
        <v-col :cols="colPrice" :class="props.isCompactView ? 'text-right' : 'text-right text-sm-left'">
            <p>{{ props.token.getPriceFormatted() }}</p>
            <p v-if="xs || props.isCompactView" :class="priceChangeClass">
                {{ props.token.getPriceChangeFormatted() }}
            </p>
        </v-col>
        <v-col v-if="!props.isCompactView" sm="2" class="d-none d-sm-block">
            <p :class="priceChangeClass">{{ props.token.getPriceChangeFormatted() }}</p>
        </v-col>
        <v-col v-if="!props.isCompactView && !props.isHomeView" md="2" class="d-none d-md-block">
            <p>
                {{ props.token.getVolumeFormatted() }}
            </p>
        </v-col>
        <v-col v-if="!props.isCompactView" sm="2" class="d-none d-sm-block">
            <p>
                {{ props.token.getMarketCapFormatted() }}
            </p>
        </v-col>
        <v-col cols="12" v-if="state.showMoreDetails && xs" class="py-5 px-4 font-weight-regular">
            <v-row>
                <v-col cols="4">
                    <div>
                        <p class="text-info">Volume</p>
                        <p class="mb-0">
                            {{ props.token.getVolumeFormatted() }}
                        </p>
                    </div>
                </v-col>
                <v-col cols="8">
                    <div>
                        <p class="text-info">Market Cap</p>
                        <p class="mb-0">
                            {{ props.token.getMarketCapFormatted() }}
                        </p>
                    </div>
                </v-col>
            </v-row>
        </v-col>
    </app-table-row>
</template>

<script setup lang="ts">
import AppTableRow from '@core/components/AppTableRow.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import AppTokenIcon from '@/core/components/AppTokenIcon.vue'
import { TokenMarket } from '@module/address/models/TokenSort'
import { computed, reactive } from 'vue'
import { eth } from '@core/helper'
import { useDisplay } from 'vuetify'
import { useStore } from '@/store'

const { xs, mdAndUp, smAndUp } = useDisplay()

interface ComponentProps {
    token: TokenMarket
    isCompactView?: boolean
    isHomeView: boolean
}

const props = withDefaults(defineProps<ComponentProps>(), {
    isCompactView: false,
    isHomeView: false
})

interface ComponentState {
    showMoreDetails: boolean
}

const state: ComponentState = reactive({
    showMoreDetails: false
})

const tokenImage = computed<string>(() => {
    return props.token.image === '' ? require('@/assets/icon-token.png') : props.token.image
})

const colName = computed<string>(() => {
    if (props.isHomeView) {
        return '6'
    }
    if (props.isCompactView) {
        return '8'
    }
    return mdAndUp.value ? '4' : '6'
})

const colPrice = computed<string>(() => {
    if (props.isCompactView) {
        return '4'
    }
    return smAndUp.value ? '2' : '6'
})
const priceChangeClass = computed<string>(() => {
    const change = props.token.price_change_percentage_24h || 0

    if (change > 0) {
        return 'text-success'
    }
    if (change < 0) {
        return 'text-error'
    }
    return 'text-textPrimary'
})

const toggleMoreDetails = (): void => {
    // Only toggle details if on mobile view
    if (xs.value) {
        state.showMoreDetails = !state.showMoreDetails
    }
}
const store = useStore()

const isFav = computed<boolean>(() => {
    return store.tokenIsFav(props.token.contract || '')
})
const setFavoriteToken = (): void => {
    isFav.value ? store.removeFavToken(props.token.contract || '') : store.addFavToken(props.token.contract || '')
}
</script>
