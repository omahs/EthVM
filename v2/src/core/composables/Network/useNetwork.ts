import { computed } from 'vue'
import Configs from '@/configs'
import { NETWORKS } from '@core/helper/networks'
export function useNetwork() {
    /**
     * Returns currency name of the network
     */
    const currencyName = computed<string>(() => {
        return NETWORKS[Configs.NETWORK].curr
    })

    /**
     * Returns if network has Fiat Values
     */
    const supportsFiat = computed<boolean>(() => {
        return NETWORKS[Configs.NETWORK].support_fiat
    })

    /**
     * Returns networks coingecko's id
     */
    const coingeckoId = computed<string>(() => {
        return NETWORKS[Configs.NETWORK].coingecko_id || ''
    })

    /**
     * Returns if network has nft support
     */
    const supportsNft = computed<boolean>(() => {
        return NETWORKS[Configs.NETWORK].support_nft
    })

    /**
     * Returns if network has nft support
     */
    const nftId = computed<string>(() => {
        return NETWORKS[Configs.NETWORK].nft_id || ''
    })

    return {
        currencyName,
        supportsFiat,
        coingeckoId,
        supportsNft,
        nftId
    }
}