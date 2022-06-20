<template>
    <app-search :select-items="search.filterItems" :is-loading="search.isLoading" :has-error="search.hasError" @onSearch="executeSearch" />
</template>

<script setup lang="ts">
// import { getTokensBeginsWith, getHashType } from '@app/modules/search/handlers/searchDetails.graphql'
import AppSearch from '@core/components/AppSearch.vue'
import { eth } from '@core/helpers/eth'
import { stringify } from 'querystring'
import type { Ref } from 'vue'
import { defineProps, defineEmits, reactive, computed, ref, watch } from 'vue'
import { useGetHashTypeQuery } from './apollo/searchDetails.generated'
import { HashType } from '@/apollo/types'
import { ROUTE_NAME, ROUTE_PROP } from '@core/router/routesNames'
import { useRouter } from 'vue-router'
import { Buffer } from 'buffer'
const values = ['transaction', 'token-detail', 'address', 'uncle', 'blockHash']

console.log(ROUTE_NAME)
/*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
interface Search {
    hasError?: boolean
    autocomplete?: string
    isLoading: boolean
    filterItems: string[]
    param?: string
    enabled: boolean
}

const search: Search = reactive({
    autocomplete: '',
    hasError: false,
    isLoading: false,
    enabled: false,
    filterItems: ['All', 'Address', 'Transaction', 'Token', 'Block', 'Uncle']
})
interface FilterRoutesMapInterface {
    [key: string]: {
        NAME: string
        PROP: string
    }
}
const filterRoutesMap: FilterRoutesMapInterface = {
    [HashType.AddressHash]: {
        NAME: ROUTE_NAME.ADDRESS.NAME,
        PROP: ROUTE_PROP.ADDRESS
    },
    [HashType.BlockHash]: {
        NAME: ROUTE_NAME.BLOCK_HASH.NAME,
        PROP: ROUTE_PROP.BLOCK
    },
    [HashType.TokenHash]: {
        NAME: ROUTE_NAME.TOKEN.NAME,
        PROP: ROUTE_PROP.TOKEN
    },
    [HashType.TxHash]: {
        NAME: ROUTE_NAME.TX_HASH.NAME,
        PROP: ROUTE_PROP.TX
    },
    [HashType.UncleHash]: {
        NAME: ROUTE_NAME.UNCLE_HASH.NAME,
        PROP: ROUTE_PROP.UNCLE
    }
}

// hasError = false
// searchAutocomplete = ''

// items = []
// isLoading = false

/**
 * Sets error and cancels loading
 * @param param {Any}
 */
const setError = (isError = true): void => {
    console.log('setting error')
    // routeToNotFound(param)
    search.enabled = false
    search.hasError = isError
    search.isLoading = false
}
/*
===================================================================================
    HELPERS
===================================================================================
*/
/**
 * Removes spaces from val
 * @param val {Any}
 */
const removeSpaces = (val: string): string => {
    if (val) {
        return val.replace(/ /g, '')
    }
    return ''
}

/**
 * Executes search functionality.
 * if searchParam is empty, aborts search
 * @param {string} searchParam - value to search
 * @param {string} filterParam -  value of the current seelcted filter
 */

const executeSearch = (searchParam: string, filterParam?: string): void => {
    search.hasError = false
    // console.log(searchParam, filterParam)
    ///checks for string length
    if (Buffer.byteLength(searchParam, 'utf8') > 1024) {
        setError()
    } else {
        const param = removeSpaces(searchParam)
        console.log('IN EXECUTE: ', param)
        if (param.length < 1) {
            setError(false)
        } else {
            if (param.length > 0 && (eth.isValidAddress(searchParam) || eth.isValidHash(searchParam))) {
                search.enabled = true
                search.param = searchParam
                return
            }
            if (filterParam === search.filterItems[4] && eth.isValidBlockNumber(searchParam)) {
                router.push({ name: ROUTE_NAME.BLOCK_NUMBER.NAME, params: { [ROUTE_PROP.BLOCK]: searchParam } })
                return
            }
            setError()
        }
    }

    // eth.isValidAddress(searchParam) || eth.isValidHash(searchParam) ? () : console.log('hash check failed')
    // eth.isValidHash(searchParam) ? getHashType(param) : getToken(param)

    // if (param && param.contract) {
    //     routeToToken(param.contract)
    // }
}
// getHashType(param): void {
//     let routeName = ''
//     isLoading = true
//     search.hasError  = false
//     $apollo
//         .query({
//             query: getHashType,
//             variables: {
//                 hash: removeSpaces(param)
//             }
//         })
//         .then(response => {
//             const hashType = response.data.getHashType
//             if (hashType.includes('ADDRESS')) {
//                 routeName = values[2]
//             } else if (hashType.includes('TX')) {
//                 routeName = values[0]
//             } else if (hashType.includes('TOKEN')) {
//                 routeName = values[1]
//             } else if (hashType.includes('UNCLE')) {
//                 routeName = values[3]
//             } else if (hashType.includes('BLOCK')) {
//                 routeName = values[4]
//             } else {
//                 setError(param)
//             }
//             routeTo(routeName, param)
//             isLoading = false
//         })
//         .catch(error => {
//             setError(param)
//             throw error
//         })
// }

const {
    onResult: onHashTypeResult,
    onError: onHashTypeError,
    loading: loadingHashType
} = useGetHashTypeQuery(
    () => ({
        hash: search.param
    }),
    {
        // enabled: () => {
        //     console.log('ENABLED:', !!search.param && search.param != '')
        //     return !!
        // },
        enabled: search.param && search.param != '',
        fetchPolicy: 'cache-and-network'
    }
)
const router = useRouter()

onHashTypeResult(({ data }) => {
    if (data && data.getHashType) {
        if (data.getHashType === HashType.CodeHash) {
            //set error
        } else {
            const routeProp = `${search.param}`
            try {
                router.push({ name: filterRoutesMap[data.getHashType].NAME, params: { [filterRoutesMap[data.getHashType].PROP]: routeProp } })
            } catch (err) {
                //Catch on SENTRY
            }
        }
    }
})
onHashTypeError(error => {
    const newError = JSON.stringify(error.message)
    console.log('Errorparam', search.param)
    console.log('ERROR', newError)
    // if (newError.toLowerCase().includes(excpBlockNotMined) && !subscriptionEnabled.value && !props.isHash) {
    //     subscriptionEnabled.value = true
    // } else {
    //     emitErrorState(true)
    // }
})
/**
 * Watching changes in the hashtype loading query
 * sets isLoading in search to give the proper ui responce
 *
 */
watch(
    () => loadingHashType,
    newVal => {
        search.isLoading = newVal.value
        console.log(loadingHashType.value)
    }
)

/**
 * Checks whether param is valid
 * @param param {Any}
 */
// const isValidHash = (param: string): boolean => {
//     return eth.isValidHash(removeSpaces(param)) || eth.isValidAddress(removeSpaces(param))
// }

/**
 * Gets the hashtype of param
 * @param param {Any}
 */
// const {
//     result: blockDetailsResult,
//     onResult: onBlockDetailsLoaded,
//     onError: onBlockDetailsError,
//     loading: loadingBlockDetails,
//     refetch: refetchBlockDetails
// } = useQuery(
//     () => (props.isHash ? GetBlockByHashDocument : GetBlockByNumberDocument),
//     () => ({
//         blockRef: blockDetailsQueryVariable.value
//     }),
//     { notifyOnNetworkStatusChange: true, fetchPolicy: 'network-only', enabled: !subscriptionEnabled.value }
// )

/**
 * Sends user to not found route
 * @param searchVal {Any}
 */
// const searchValue = (searchValue: string, searchFilter: string | undefined): void => {
//     console.log(searchValue, searchFilter)
// }
// routeToNotFound(searchVal): void {
//     const route = { name: 'search-not-found', params: { searchTerm: searchVal } }
//     $router.push(route).catch(() => {})
// }
/**
 * Sends user to the right page
 * @param selectVal {Any}
 * @param searchVal {Any}
 */
// routeTo(selectVal, searchVal): void {
//     const route = { name: getSelectVal(selectVal, searchVal), params: getParam(selectVal, searchVal) }
//     $router.push(route)
// }
/**
 * Route user to tokens ppage
 * @param param {Any}
 */
// routeToToken(param): void {
//     const route = { name: 'token-detail', params: { addressRef: removeSpaces(param) } }
//     $router
//         .push(route)
//         .then(() => $refs.search.resetValues())
//         .catch(() => {})
// }
/**
 * Get selected value
 * @param selectVal {Any}
 * @param searchVal {Any}
 */
// getSelectVal(selectVal, searchVal) {
//     const isNum = /^\d+$/.test(searchVal)
//     if (selectVal === 'block' && !isNum) {
//         return values[4]
//     }
//     return selectVal
// }
/**
 * Get params
 * @param selectVal {Any}
 * @param searchVal {Any}
 */
// getParam(selectVal, searchVal): {} {
//     if (selectVal === values[0]) {
//         return { txRef: removeSpaces(searchVal) }
//     } else if (selectVal === values[1] || selectVal === values[2]) {
//         return { addressRef: removeSpaces(searchVal) }
//     } else if (selectVal === values[3]) {
//         return { uncleRef: removeSpaces(searchVal) }
//     }
//     return { blockRef: removeSpaces(searchVal) }
// }
/**
 * Get tokens
 * @param param {Any}
 */
// getToken(param): void {
//     isLoading = true
//     search.hasError  = false
//     $apollo
//         .query({
//             query: getTokensBeginsWith,
//             variables: {
//                 keyword: param.trim()
//             }
//         })
//         .then(response => {
//             items = response.data.getTokensBeginsWith
//             if (items.length === 1 && items[0]['contract'] && items[0]['keyword'] === param.trim().toLowerCase()) {
//                 routeToToken(items[0]['contract'])
//             }
//             if (items.length === 0) {
//                 setError(param)
//             }
//             isLoading = false
//         })
//         .catch(error => {
//             setError(param)
//             throw error
//         })
// }
/**
 * Get search values based on if param is token or hashType
 * @param param {Any}
 */

/**
 * Get selected value and route user to token page
 * @param param {Any}
 */
// onSelect(param): void {
//     if (param && param.contract) {
//         routeToToken(param.contract)
//     }
// }

/*
  ===================================================================================
    Computed Values
  ===================================================================================
  */
// get selectItems(): any[] {
//     return [
//         { text: $t('filter.all'), value: 'all' },
//         { text: $t('kb.terms.block.term'), value: 'block' },
//         { text: $tc('tx.name-short', 1), value: 'transaction' },
//         { text: $tc('address.name', 1), value: 'address' },
//         { text: $tc('token.name', 1), value: 'token-detail' },
//         { text: $tc('uncle.name', 1), value: 'uncle' }
//     ]
// }
</script>
