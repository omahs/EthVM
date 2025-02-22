<template>
    <v-row class="px-1 my-4">
        <div class="mr-3">
            <v-btn
                color="textPrimary"
                :variant="state.transferDirection === TransferDirection.Incoming ? 'flat' : 'outlined'"
                density="compact"
                rounded="pill"
                class="px-2"
                height="24"
                @click="setTransferDirection(TransferDirection.Incoming)"
            >
                Incoming
            </v-btn>
        </div>
        <div class="mr-3">
            <v-btn
                color="textPrimary"
                :variant="state.transferDirection === TransferDirection.Outgoing ? 'flat' : 'outlined'"
                density="compact"
                rounded="pill"
                class="px-2"
                height="24"
                @click="setTransferDirection(TransferDirection.Outgoing)"
            >
                Outgoing
            </v-btn>
        </div>
        <div>
            <v-btn
                color="textPrimary"
                :variant="state.transferDirection === null ? 'flat' : 'outlined'"
                density="compact"
                rounded="pill"
                class="px-2"
                height="24"
                @click="setTransferDirection('')"
            >
                All
            </v-btn>
        </div>
    </v-row>
    <template v-if="!smAndDown">
        <v-row align="center" justify="start" class="text-info mt-2 mt-sm-4">
            <v-col sm="3" lg="2">
                <span style="width: 30px; height: 1px" class="d-inline-block"></span>
                <span class="ml-4">Tx Value</span>
            </v-col>
            <v-col v-if="!mdAndDown" sm="2"> To/From </v-col>
            <v-spacer v-else />
            <v-col sm="3"> Address </v-col>
            <v-col sm="2"> Hash</v-col>
            <v-col sm="3"> Balance Change </v-col>
        </v-row>
    </template>
    <v-divider class="my-0 mt-sm-4 mx-n4 mx-sm-n6" />
    <div v-if="initialLoad || loadingTxsTransfersData" class="p-ten-top">
        <div v-for="item in 10" :key="item" style="padding: 10px 0">
            <div class="skeleton-box rounded-xl" style="height: 40px"></div>
        </div>
    </div>
    <template v-else>
        <div v-if="transfers && transfers.length > 0" class="p-ten-top">
            <div v-for="transfer in currentPageData" :key="transfer.transfer.transactionHash">
                <table-txs-history-row :transfer="transfer" :address-ref="props.addressRef" />
            </div>
        </div>
        <app-no-result v-else :text="noResultText" class="mt-4 mt-sm-6 mb-5"></app-no-result>
    </template>
    <template v-if="showPagination">
        <app-pagination :length="numberOfPages" :has-more="hasMore" @update:modelValue="loadMoreData" :current-page="pageNum" />
    </template>
</template>

<script setup lang="ts">
import AppPagination from '@core/components/AppPagination.vue'
import AppNoResult from '@core/components/AppNoResult.vue'
import TableTxsHistoryRow from '@module/address/components/EthBalanceTabs/TableTxsHistoryRow.vue'
import { computed, reactive } from 'vue'
import { useDisplay } from 'vuetify'
import { TxsTransfersFragment, useGetEthTransactionTransfersQuery } from '@module/address/apollo/EthTransfers/transfersHistory.generated'
import { TransferDirection } from '@/apollo/types'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import { ITEMS_PER_PAGE } from '@core/constants'

const { smAndDown, mdAndDown } = useDisplay()

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    }
})

interface ComponentState {
    transferDirection: TransferDirection | null
}

const state: ComponentState = reactive({
    transferDirection: null
})

const {
    result: txsTransfersData,
    loading: loadingTxsTransfersData,
    fetchMore: fetchMoreTxsTransfersData
} = useGetEthTransactionTransfersQuery(
    () => ({
        ...(state.transferDirection !== null && { direction: state.transferDirection }),
        hash: props.addressRef,
        _limit: ITEMS_PER_PAGE
    }),
    () => ({
        notifyOnNetworkStatusChange: true
    })
)

const transfers = computed<Array<TxsTransfersFragment | null>>(() => {
    return txsTransfersData.value?.getEthTransactionTransfers.transfers || []
})

const showPagination = computed<boolean>(() => {
    return !initialLoad.value && !!transfers.value && transfers.value.length > 0
})

const tabId = computed<string>(() => {
    return state.transferDirection || 'tabAllEthTransfers'
})

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(transfers, tabId)

const initialLoad = computed<boolean>(() => {
    return !txsTransfersData.value
})

const hasMore = computed<boolean>(() => {
    return !!txsTransfersData.value?.getEthTransactionTransfers.nextKey
})

const noResultText = computed<string>(() => {
    if (state.transferDirection === TransferDirection.Outgoing) {
        return 'This address does not have any outgoing transfers'
    } else if (state.transferDirection === TransferDirection.Incoming) {
        return 'This address does not have any incoming transfers'
    }
    return 'This address does not have any transactions'
})

const loadMoreTxsTransfersData = (): void => {
    if (pageNum.value > numberOfPages.value) {
        fetchMoreTxsTransfersData({
            variables: {
                direction: state.transferDirection,
                hash: props.addressRef,
                _limit: ITEMS_PER_PAGE,
                _nextKey: txsTransfersData.value?.getEthTransactionTransfers.nextKey
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                return {
                    getEthTransactionTransfers: {
                        nextKey: fetchMoreResult?.getEthTransactionTransfers.nextKey,
                        transfers: [...prev.getEthTransactionTransfers.transfers, ...(fetchMoreResult?.getEthTransactionTransfers.transfers || [])],
                        __typename: fetchMoreResult?.getEthTransactionTransfers.__typename
                    }
                }
            }
        })
    }
}

const loadMoreData = (pageNum: number): void => {
    setPageNum(pageNum)
    loadMoreTxsTransfersData()
}

const setTransferDirection = (direction: TransferDirection): void => {
    if (direction) {
        state.transferDirection = direction
    } else {
        state.transferDirection = null
    }
}
</script>
