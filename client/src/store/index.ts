import { defineStore, Store } from 'pinia'

export const useStore = defineStore('main', {
    state: () => {
        return {
            tokenPrices: []
        }
    }
})
