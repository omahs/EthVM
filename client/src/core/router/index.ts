import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '@view/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
