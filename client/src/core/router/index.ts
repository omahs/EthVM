import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { ROUTE_NAME } from './routesNames'
import HomeView from '@view/HomeView.vue'
import ViewTemp from '@view/ViewTemp.vue'
const routes: Array<RouteRecordRaw> = [
    {
        path: ROUTE_NAME.HOME.PATH,
        name: ROUTE_NAME.HOME.NAME,
        component: HomeView
    },
    {
        path: ROUTE_NAME.BLOCKS.PATH,
        name: ROUTE_NAME.BLOCKS.NAME,
        component: ViewTemp
    },
    {
        path: ROUTE_NAME.TXS.PATH,
        name: ROUTE_NAME.TXS.NAME,
        component: ViewTemp
    },
    {
        path: ROUTE_NAME.TXS_PENDING.PATH,
        name: ROUTE_NAME.TXS_PENDING.NAME,
        component: ViewTemp
    },
    {
        path: ROUTE_NAME.TOKENS.PATH,
        name: ROUTE_NAME.TOKENS.NAME,
        component: ViewTemp
    },
    {
        path: ROUTE_NAME.CHARTS.PATH,
        name: ROUTE_NAME.CHARTS.NAME,
        component: ViewTemp
    },
    {
        path: ROUTE_NAME.FAV_ADDRESS.PATH,
        name: ROUTE_NAME.FAV_ADDRESS.NAME,
        component: ViewTemp
    },
    {
        path: ROUTE_NAME.FAV_TOKENS.PATH,
        name: ROUTE_NAME.FAV_TOKENS.NAME,
        component: ViewTemp
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
