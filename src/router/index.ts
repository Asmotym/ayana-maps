import { createRouter, createWebHistory } from 'vue-router'

export enum Routes {
  Home = 'Home',
  TestingGround = 'TestingGround'
}

const routes = [
  {
    path: '/',
    name: Routes.Home,
    component: () => import('../components/routes/Home.vue')
  },
  {
    path: '/testing-ground',
    name: Routes.TestingGround,
    component: () => import('../components/routes/QueriesTesting.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 