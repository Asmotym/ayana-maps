import { createApp } from 'vue'
import './style.css'
import 'leaflet/dist/leaflet.css'
import 'vuetify/dist/vuetify.css'
import '@mdi/font/css/materialdesignicons.css'
import './assets/styles/_vendor.scss'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import logger from './plugins/logger.plugin'
import i18n from './plugins/i18n.plugin'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
    },
    theme: {
        defaultTheme: 'dark',
    }
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.use(logger)
app.use(i18n)
app.mount('#app')

logger.info('Application started')