<template>
    <v-card>
        <v-card-title class="justify-space-between">
            Token Transfer History
            <!--            <app-paginate v-if="!loadingTokens" :total="totalPages" :current-page="state.index" @newPage="setPage" />-->
            <app-paginate-has-more
                v-if="!loadingTransfers"
                :class="smAndDown ? 'pt-3' : ''"
                :has-more="hasMore"
                :current-page="state.index"
                :loading="loadingTransfers"
                @newPage="setPage"
            />
        </v-card-title>
        <div>
            <!--            Table Header-->
            <v-row class="ma-0 bg-primary">
                <v-col cols="2">
                    <v-row class="ma-0" align="center"> Token </v-row>
                </v-col>
                <v-col cols="1">
                    <v-row class="ma-0" align="center"> Symbol </v-row>
                </v-col>
                <v-col cols="2">
                    <v-row class="ma-0" align="center"> Amount </v-row>
                </v-col>
                <v-col cols="1">
                    <v-row class="ma-0" align="center"> From/To </v-row>
                </v-col>
                <v-col cols="2">
                    <v-row class="ma-0 flex-nowrap" align="center"> Address </v-row>
                </v-col>
                <v-col cols="2">
                    <v-row class="ma-0 flex-nowrap" align="center"> Timestamp </v-row>
                </v-col>
                <v-col cols="2">Hash</v-col>
            </v-row>
            <v-divider />
            <template v-if="loadingTransfers">
                <div v-for="item in 10" :key="item" class="my-2">
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="20" class="ma-2" />
                </div>
            </template>
            <template v-else>
                <v-row v-for="transfer in transfers" :key="transfer.contract" class="ma-0 text-subtitle-2 font-weight-regular" align="center">
                    <v-col cols="2">
                        <v-row class="ma-0" align="center">
                            <div class="token-image">
                                <img :src="getImg(transfer.contract) || require('@/assets/icon-token.png')" alt="" height="24" width="24" class="mr-2" />
                            </div>
                            <!--                            <router-link v-if="tokenTransfer.name !== '' || tokenTransfer.symbol" :to="`/token/${transfer.contract}`" class="black&#45;&#45;text">-->
                            <!--                                <p v-if="tokenTransfer.name">{{ tokenTransfer.name }}</p>-->
                            <!--                                <p v-else class="text-uppercase caption">{{ tokenTransfer.symbol }}</p>-->
                            <!--                            </router-link>-->
                        </v-row>
                    </v-col>
                    <v-col cols="1">
                        <v-row class="ma-0" align="center"> Symbol </v-row>
                    </v-col>
                    <v-col cols="2">
                        <v-row class="ma-0" align="center"> Amount </v-row>
                    </v-col>
                    <v-col cols="1">
                        <v-row class="ma-0" align="center"> From/To </v-row>
                    </v-col>
                    <v-col cols="2">
                        <v-row class="ma-0 flex-nowrap" align="center"> Address </v-row>
                    </v-col>
                    <v-col cols="2">
                        <v-row class="ma-0 flex-nowrap" align="center"> Timestamp </v-row>
                    </v-col>
                    <v-col cols="2">Hash</v-col>
                </v-row>
            </template>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import AppPaginateHasMore from '@core/components/ui/AppPaginateHasMore.vue'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { TOKEN_FILTER_VALUES, TokenSort, Token } from '@module/address/models/TokenSort'
import { formatFloatingPointValue, formatPercentageValue, FormattedNumber, formatUsdValue } from '@core/helper/number-format-helper'
const { getEthereumTokensMap, loading: loadingEthTokens, getEthereumTokenByContract } = useCoinData()
import BN from 'bignumber.js'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { TransferFragmentFragment as Transfer, useGetAddressErc20TransfersQuery } from '@module/address/apollo/transfers.generated'

const MAX_ITEMS = 10

const { smAndDown } = useDisplay()
const props = defineProps({
    addressHash: {
        type: String,
        required: true
    }
})

interface ComponentState {
    showMoreTokenDetails: boolean
    activeToken: false | TokenMarketData
    sortKey: string
    sortDirection: string
    index: number
}

const state: ComponentState = reactive({
    showMoreTokenDetails: false,
    activeToken: false,
    sortKey: TOKEN_FILTER_VALUES[1],
    sortDirection: 'high',
    index: 0
})

const {
    result,
    loading: loadingTransfers,
    fetchMore
} = useGetAddressErc20TransfersQuery(
    () => ({
        hash: props.addressHash,
        _limit: MAX_ITEMS
    }),
    { notifyOnNetworkStatusChange: true }
)

const hasMore = computed<boolean>(() => {
    return result.value?.getERC20Transfers.nextKey !== null
})

const transferHistory = computed<Array<Transfer | null>>(() => result.value?.getERC20Transfers.transfers || [])

const transfers = computed<any[]>(() => {
    if (transferHistory.value.length > 0) {
        const start = MAX_ITEMS * state.index
        const end = start + MAX_ITEMS > transferHistory.value?.length ? transferHistory.value?.length : start + MAX_ITEMS
        return transferHistory.value.slice(start, end)
    }
    return []
})

const tokenImg = computed<Map<string, TokenMarketData> | false>(() => {
    if (!loadingTransfers.value) {
        const contracts: string[] = []
        transferHistory.value.forEach(token => {
            if (token) {
                contracts.push(token.contract)
            }
        })
        if (contracts.length > 0) {
            return getEthereumTokensMap(contracts)
        }
    }
    return false
})

/**
 * Fetches image for the contract
 * @param contract {String}
 * @returns {TokenMarketData} or {undefined}
 */
const getImg = (contract: string): string | undefined => {
    if (!loadingTransfers.value && tokenImg.value && tokenImg.value.has(contract)) {
        const token = tokenImg.value.get(contract)
        return token?.image
    }
    return undefined
}

const setPage = (page: number, reset: boolean) => {
    state.index = page
    fetchMore({
        variables: {
            hash: props.addressHash,
            _limit: MAX_ITEMS,
            _nextKey: result.value?.getERC20Transfers?.nextKey
        },
        updateQuery: (prev, { fetchMoreResult }) => {
            return {
                getERC20Transfers: {
                    nextKey: fetchMoreResult?.getERC20Transfers.nextKey,
                    transfers: [...prev.getERC20Transfers.transfers, ...(fetchMoreResult?.getERC20Transfers.transfers || [])],
                    __typename: fetchMoreResult?.getERC20Transfers.__typename
                }
            }
        }
    })
}
</script>
