import { createApp } from 'vue'
import App from './App.vue'
import router from './core/router'
import vuetify from './core/plugins/vuetify'
import { loadFonts } from './core/plugins/webfontloader'
import Apollo from './apollo'
loadFonts()

const app = createApp(App)
app.use(router).use(vuetify).mount('#app')
