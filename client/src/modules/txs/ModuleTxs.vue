<template>
    <v-container>
        <v-card color="white" variant="contained-flat" class="pt-3 pb-3">
            <v-container>
                <app-table-title :title="getTitle" :has-pagination="showPagination" :page-type="pageType" page-link="/txs">
                    <template v-if="!isHome" #update>
                        <app-new-update text="New Txs" :update-count="state.newMinedTransfers" :hide-count="true" @reload="setPage(0, true)" />
                    </template>
                    <template v-if="showPagination && !state.initialLoad" #pagination>
                        <app-paginate-has-more :total="state.totalPages" :current-page="state.index" @newPage="setPage" />
                    </template>
                </app-table-title>
                <txs-table
                    :max-items="maxItems"
                    :index="state.index"
                    :is-loading="loading"
                    :table-message="message"
                    :txs-data="transactions"
                    :is-scroll-view="isHome"
                />
                <v-row v-if="showPagination && !state.initialLoad" justify="end" row class="pb-1 pr-3 pl-2">
                    <app-paginate-has-more :has-more="hasMore" :current-page="state.index" :loading="loading" @newPage="setPage" />
                </v-row>
            </v-container>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import AppTableTitle from '@/core/components/ui/AppTableTitle.vue'
import AppNewUpdate from '@/core/components/ui/AppNewUpdate.vue'
import AppPaginateHasMore from '@/core/components/ui/AppPaginateHasMore.vue'
import { useGetAllTxsQuery, useNewTransfersCompleteFeedSubscription } from './apollo/transfersQuery.generated'
import { computed, reactive } from 'vue'
import { useResult } from '@vue/apollo-composable'
import TxsTable from '@module/txs/components/TxsTable.vue'

interface Reactive {
    initialLoad: boolean
    index: number
    totalPages: number
    isEnd: number
    newMinedTransfers: number
    hasError: boolean
}

const state: Reactive = reactive({
    initialLoad: true,
    index: 0,
    totalPages: 0,
    isEnd: 0,
    newMinedTransfers: 0,
    hasError: false
})

const props = defineProps({
    maxItems: Number,
    pageType: {
        type: String,
        default: 'home'
    }
})

/*
 * =======================================================
 * COMPUTED
 * =======================================================
 */
const transactions = computed(() => {
    if (allEthTransfers.value && allEthTransfers.value.transfers !== null) {
        return allEthTransfers.value.transfers
    }
    return []
})

const message = computed<string>(() => {
    return ''
})

const getTitle = computed<string>(() => {
    return 'Last Transactions'
})

const loading = computed<boolean>(() => {
    if (state.hasError) {
        return true
    }
    if (isHome.value) {
        return state.initialLoad
    }
    return loadingTxs.value
})

const isHome = computed<boolean>(() => {
    return props.pageType === 'home'
})

const hasMore = computed<boolean>(() => {
    if (!isHome.value) {
        return allEthTransfers.value ? !(allEthTransfers.value.nextKey === null) : false
    }
    return false
})

const showPagination = computed<boolean>(() => {
    if (isHome.value) {
        return false
    }

    return hasMore.value
})

/*
 * =======================================================
 * NETWORK CALLS/HANDLER
 * =======================================================
 */
const {
    loading: loadingTxs,
    result: getAllEthTransfers,
    onResult: onTxsArrayLoaded,
    refetch: refetchTxArray,
    fetchMore
} = useGetAllTxsQuery(
    {
        _limit: props.maxItems,
        _nextKey: null
    },
    { notifyOnNetworkStatusChange: true }
)

const { onResult: onNewTransferLoaded } = useNewTransfersCompleteFeedSubscription()

const allEthTransfers = useResult(getAllEthTransfers, null, data => data.getAllEthTransfers)

onTxsArrayLoaded(result => {
    console.log(result)
    state.initialLoad = false
})

onNewTransferLoaded(result => {
    if (result.data.newTransfersCompleteFeed.type === 'ETH') {
        if (isHome.value) {
            refetchTxArray()
        } else {
            state.newMinedTransfers += 1
        }
    }
})

/*
 * =======================================================
 * METHODS
 * =======================================================
 */
const setPage = async (page: number, reset = false): Promise<boolean> => {
    state.index = page
    if (reset) {
        state.isEnd = 0
        if (isHome.value) {
            state.newMinedTransfers = 0
        }
        await refetchTxArray()
    } else {
        if (page >= state.isEnd && hasMore.value) {
            await fetchMore({
                variables: {
                    nextKey: getAllEthTransfers.nextKey,
                    _limit: props.maxItems
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    state.isEnd = page
                    const newT = fetchMoreResult.getAllEthTransfers.transfers
                    const prevT = previousResult.getAllEthTransfers.transfers
                    return {
                        ...previousResult,
                        getAllEthTransfers: {
                            __typename: previousResult.getAllEthTransfers.__typename,
                            nextKey: fetchMoreResult.getAllEthTransfers.nextKey,
                            transfers: [...prevT, ...newT]
                        }
                    }
                }
            })
        }
    }

    state.index = page
    return true
}
</script>
<style scoped lang="css">
.tx-filter-select-container {
    border: solid 1px #efefef;
    padding-top: 1px;
}
.tx-status {
    min-width: 60px;
}
</style>
