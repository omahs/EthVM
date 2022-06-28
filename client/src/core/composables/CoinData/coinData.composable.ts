import { useGetLatestPricesQuery } from './getLatestPrices.generated'
import { computed } from 'vue'
import { useStore } from '@/store'
import { storeToRefs } from 'pinia'

interface TokenMarketData {
    __typename?: 'TokenMarketInfo'
    id: string
    symbol: string
    name: string
    image: string
    contract?: string | null
    current_price?: number | null
    market_cap?: number | null
    total_volume?: number | null
    total_supply?: string | null
    price_change_percentage_24h?: number | null
}

export function useCoinData() {
    const store = useStore()
    const { coinData, loadingCoinData } = storeToRefs(store)
    // const { result, loading } = useGetLatestPricesQuery({ pollInterval: 300000 })
    const hasData = (token: TokenMarketData | null): boolean => {
        if (token) {
            return !(token.contract === null || token.current_price === null || token.market_cap === null || token.total_supply === null)
        }
        return true
    }

    const filteredLatestPrice = computed<any>(() => {
        if (coinData.value && coinData.value?.getLatestPrices.length > 0) {
            const filteredRes = coinData.value?.getLatestPrices.filter(token => hasData(token) && token?.id !== 'ethereum')
            return filteredRes || []
        }
        return []
    })

    const ethereumTokens = computed<any>(() => {
        if (coinData.value && coinData.value?.getLatestPrices.length > 0) {
            const filteredRes = coinData.value?.getLatestPrices.filter(token => token?.id !== 'ethereum')
            return filteredRes || []
        }
        return []
    })

    const tokensMarketInfo = computed<Map<string, TokenMarketData>>(() => {
        const marketInfo = new Map()
        if (coinData.value && coinData.value?.getLatestPrices.length > 0) {
            coinData.value?.getLatestPrices.forEach(token => {
                if (token?.id !== 'ethereum' && hasData(token)) {
                    marketInfo.set(token?.contract?.toLowerCase(), token)
                }
            })
        }
        return marketInfo
    })

    /**
     * Generate ethereum tokens by contract
     * @param contract String[]
     * @returns {Map} TokenMarketData or {Boolean}
     */
    const getEthereumTokenByContract = (contract: string): TokenMarketData | false => {
        if (!loadingCoinData.value) {
            const token = tokensMarketInfo.value.get(contract.toLowerCase())
            if (token) {
                return token
            }
        }
        return false
    }

    return { ethereumTokens, filteredLatestPrice, getEthereumTokenByContract }
}
