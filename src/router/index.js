import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/home/HomeView.vue'),
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
