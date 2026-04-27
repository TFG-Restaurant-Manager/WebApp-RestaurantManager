import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
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
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faUtensils,
  faClipboardList,
  faPaintbrush,
  faClock,
  faChartBar,
  faUserShield,
  faCheck,
)

createApp(App)
  .use(router)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
