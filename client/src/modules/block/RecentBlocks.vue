<template>
    <v-container>
        <v-card color="white" flat class="pt-3 pb-3">
            <v-container>
                <app-table-title :title="getTitle" :has-pagination="showPagination" :page-type="pageType" page-link="/blocks">
                    <!-- <template v-if="!isHome" #update>
                        <notice-new-block @reload="setPage(0, true)" />
                    </template> -->
                    <!-- <template v-if="showPagination && !initialLoad" #pagination>
                        <app-paginate :total="totalPages" :current-page="currentPage" @newPage="setPage" /> </template -->
                    ></app-table-title
                >
                <table-blocks
                    :max-items="maxItems"
                    :index="index"
                    :is-loading="loading"
                    :table-message="message"
                    :block-data="blocks"
                    :is-scroll-view="isHome"
                />
                <!-- <v-layout
                    v-if="showPagination && !initialLoad"
                    :justify-end="$vuetify.breakpoint.mdAndUp"
                    :justify-center="$vuetify.breakpoint.smAndDown"
                    row
                    class="pb-1 pr-3 pl-2"
                >
                    <app-paginate :total="totalPages" :current-page="currentPage" @newPage="setPage" />
                </v-layout> -->
            </v-container>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { useResult } from '@vue/apollo-composable'
import AppTableTitle from '@/core/components/ui/AppTableTitle.vue'
import TableBlocks from '@/modules/block/components/RecentBlocks/BlocksTable.vue'
// import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
// import NoticeNewBlock from '@app/modules/blocks/components/NoticeNewBlock.vue'
import BN from 'bignumber.js'
import {
    useGetBlocksArrayByNumberQuery,
    GetBlocksArrayByNumberQuery as TypeBlocks,
    NewBlockTableDocument,
    GetBlocksArrayByNumberQuery,
    NewBlockTableSubscription
} from './apollo/RecentBlocks/recentBlocks.generated'
// import { getBlocksArrayByNumber, newBlockTable } from './recentBlocks.graphql'
// import { getBlocksArrayByNumber_getBlocksArrayByNumber as TypeBlocks } from './apolloTypes/getBlocksArrayByNumber'
// import { ErrorMessageBlock } from './model/ErrorMessagesForBlock'
// import { excpInvariantViolation } from '@/apollo/errorExceptions'

import { ref, computed } from 'vue'
interface BlockMap {
    [key: number]: TypeBlocks
}

const initialLoad = ref(true)
const hasError = ref(false)
const syncing = ref(false)
// const getBlocksArrayByNumber = ref() !: TypeBlocks
const indexedBlocks = ref<BlockMap>({})
const index = ref(0)
const totalPages = ref(0)
const startBlock = ref<number>()

const props = defineProps({
    maxItems: Number,
    pageType: {
        type: String,
        default: 'home'
    }
})

const blocks = computed<TypeBlocks | []>(() => {
    if (indexedBlocks.value && indexedBlocks.value[index.value]) {
        return indexedBlocks.value[index.value]
    }
    return []
})

const message = computed<string>(() => {
    return ''
})

const getTitle = computed<string>(() => {
    const titles = {
        blocks: 'Last Blocks',
        address: 'Mined Blocks',
        home: 'Last Blocks'
    }
    return titles[props.pageType]
})

const loading = computed<boolean>(() => {
    if (hasError.value) {
        return true
    }
    if (isHome.value) {
        return initialLoad.value
    }
    return loadingBlocks.value
})

const isHome = computed<boolean>(() => {
    return props.pageType === 'home'
})

const currentPage = computed<number>(() => {
    return index.value
})

const showPagination = computed<boolean>(() => {
    return !initialLoad.value && !isHome.value && startBlock.value - props.maxItems > 0
})

const {
    result,
    loading: loadingBlocks,
    onResult: onBlockArrayLoaded,
    subscribeToMore,
    refetch: refetchBlockArray
} = useGetBlocksArrayByNumberQuery({
    limit: props.maxItems
})

subscribeToMore(xyz)

function xyz() {
    return {
        document: NewBlockTableDocument,
        updateQuery: (previousResult: GetBlocksArrayByNumberQuery, { subscriptionData }: { subscriptionData: NewBlockTableSubscription }) => {
            if (previousResult && subscriptionData.data.newBlockFeed) {
                const prevB = [...previousResult.getBlocksArrayByNumber.slice(0)]
                const newB = subscriptionData.data.newBlockFeed
                newB.txFail = 0
                const index = prevB.findIndex(block => block?.number === newB.number)
                if (index != -1) {
                    prevB.splice(index, 1, newB)
                    return {
                        __typename: 'BlockSummary',
                        getBlocksArrayByNumber: prevB
                    }
                }
                return {
                    __typename: 'BlockSummary',
                    getBlocksArrayByNumber: [newB, ...prevB]
                }
            }
        }
    }
}

onBlockArrayLoaded(result => {
    if (initialLoad.value) {
        initialLoad.value = false
    }
    if (props.pageType === 'home') {
        if (result.data.getBlocksArrayByNumber[0].number - result.data.getBlocksArrayByNumber[1].number > 1) {
            console.log('Inconsistencies')
            refetchBlockArray()
        }
    }
    const newBlocks = result.data.getBlocksArrayByNumber
    indexedBlocks.value[index.value] = props.pageType === 'home' ? newBlocks.slice(0, props.maxItems) : newBlocks
})
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
