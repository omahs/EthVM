<template>
    {{ getIcon.value }}
    <app-search :select-items="filterItems" :is-loading="search.isLoading" :has-error="search.isLoading" />
</template>

<script setup lang="ts">
// import { getTokensBeginsWith, getHashType } from '@app/modules/search/handlers/searchDetails.graphql'
import AppSearch from '@core/components/AppSearch.vue'
import { eth } from '@core/helpers/eth'
import type { Ref } from 'vue'
import { defineProps, defineEmits, reactive, computed, ref, watch } from 'vue'

const values = ['transaction', 'token-detail', 'address', 'uncle', 'blockHash']

// 070

// $refs!: {
//     search: SearchRef
// }
/*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
interface Search {
    hasError?: boolean
    autocomplete?: string
    isLoading?: false
}
const a: Search = {
    hasError: true
}

const getIcon = computed<string>(() => {
    return a.a
})
const search: Search = reactive({ autocomplete: '', hasError: false, isLoading: false })

const filterItems: Ref<string[]> = ref(['All', 'Address', 'Transaction', 'Token', 'Block', 'Uncle'])

// hasError = false
// searchAutocomplete = ''

// items = []
// isLoading = false

/**
 * Sets error and cancels loading
 * @param param {Any}
 */
// const setError = (): void => {
//     // routeToNotFound(param)
//     search.hasError = true
//     search.isLoading = false
// }
/*
===================================================================================
    HELPERS
===================================================================================
*/
/**
 * Removes spaces from val
 * @param val {Any}
 */
// const removeSpaces = (val: string): string => {
//     if (val) {
//         return val.replace(/ /g, '')
//     }
//     return ''
// }

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
/**
 * Sends user to not found route
 * @param searchVal {Any}
 */
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
//     $router.push(route).catch(() => {})
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
// getAllSearch(param): void {
//     if (Buffer.byteLength(param, 'utf8') > 1024) {
//         setError(param)
//     } else {
//         if (removeSpaces(param).length === 0) {
//             return
//         }
//         if (param && param.contract) {
//             routeToToken(param.contract)
//         }
//         isValidHash(param) ? getHashType(param) : getToken(param)
//     }
// }
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
