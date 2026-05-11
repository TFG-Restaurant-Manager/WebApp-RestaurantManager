import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n/index.js'
import { useAuth } from './composables/useAuth.js'
import './assets/styles/variables.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faUtensils,
  faClipboardList,
  faPaintbrush,
  faClock,
  faChartBar,
  faUserShield,
  faCheck,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faUtensils,
  faClipboardList,
  faPaintbrush,
  faClock,
  faChartBar,
  faUserShield,
  faCheck,
  faUserCircle,
)

createApp(App)
  .use(i18n)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
