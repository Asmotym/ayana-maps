import { createApp } from 'vue'
import './style.css'
import 'leaflet/dist/leaflet.css'
import 'vuetify/dist/vuetify.css'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

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
app.mount('#app')
