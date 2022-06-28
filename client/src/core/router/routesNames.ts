interface Route {
    [key: string]: {
        NAME: string
        PATH: string
    }
}
const ROUTE_NAME: Route = {
    HOME: { NAME: 'Home', PATH: '/' },
    BLOCKS: {
        PATH: '/blocks',
        NAME: 'blocks'
    },
    BLOCK_NUMBER: {
        PATH: '/block/number/:blockRef',
        NAME: 'block'
    },
    BLOCK_HASH: {
        PATH: '/block/hash/:blockRef',
        NAME: 'blockHash'
    },
    TXS: {
        PATH: '/txs',
        NAME: 'transactions'
    },
    TX_HASH: {
        PATH: '/tx/:txRef',
        NAME: 'transaction'
    },
    TXS_PENDING: {
        PATH: '/pending-txs',
        NAME: 'pending'
    },
    ADDRESS: {
        PATH: '/address/:addressRef',
        NAME: 'address'
    },
    ADDRESS_TOKENS: {
        PATH: '/address/:addressRef/tokens',
        NAME: 'address-tokens'
    },
    CHARTS: {
        PATH: '/charts',
        NAME: 'charts'
    },
    CHART: {
        PATH: '/chart/:chartRef',
        NAME: 'chart-detail'
    },
    TOKEN: {
        PATH: '/token/:addressRef',
        NAME: 'token-detail'
    },
    TOKENS: {
        PATH: '/tokens',
        NAME: 'tokens'
    },
    ABOUT: {
        PATH: '/about',
        NAME: 'about'
    },
    NOT_FOUND: {
        PATH: '/404',
        NAME: 'notFound'
    },
    SEARCH_NOT_FOUND: {
        PATH: '/search/not_found/:searchTerm',
        NAME: 'search-not-found'
    },
    FAV_ADDRESS: {
        PATH: '/fav_addresses',
        NAME: 'fav_addresses'
    },
    FAV_TOKENS: {
        PATH: '/tokens/favorites',
        NAME: 'fav_tokens'
    }
}
export { ROUTE_NAME }
