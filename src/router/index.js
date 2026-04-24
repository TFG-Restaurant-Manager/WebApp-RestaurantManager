import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RestaurantView from '../views/RestaurantView.vue'
import MenuView from '../views/screens/menu/MenuView.vue'

const routes = [
  {
    path: '/',
    component: HomeView
  },
  {
    path: '/:slug/menu',
    component: MenuView
  },
  {
    path: '/:slug',
    component: RestaurantView
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
