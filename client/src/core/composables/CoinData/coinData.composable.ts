import { useGetLatestPricesQuery } from './getLatestPrices.generated'
import { computed } from 'vue'

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
    const { result, loading } = useGetLatestPricesQuery({ pollInterval: 300000 })
    const hasData = (token: TokenMarketData | null): boolean => {
        if (token) {
            if (token.contract === null || token.current_price === null || token.market_cap === null || token.total_supply === null) {
                return false
            }
            return true
        }
        return true
    }

    const filteredLatestPrice = computed<any>(() => {
        if (result.value && result.value?.getLatestPrices.length > 0) {
            const filteredRes = result.value?.getLatestPrices.filter(token => hasData(token) && token?.id !== 'ethereum')
            return filteredRes || []
        }
        return []
    })

    const ethereumTokens = computed<any>(() => {
        if (result.value && result.value?.getLatestPrices.length > 0) {
            const filteredRes = result.value?.getLatestPrices.filter(token => token?.id !== 'ethereum')
            return filteredRes || []
        }
        return []
    })

    return { ethereumTokens, filteredLatestPrice }
}
