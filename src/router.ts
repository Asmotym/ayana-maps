import type { DiscordUser } from '../netlify/core/types/discord.types';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { store } from './core/store/index.store'
import { DiscordService } from './core/services/discord.service'

export enum Routes {
  Home = 'Home',
  TestingGround = 'TestingGround'
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: Routes.Home,
    component: () => import('./core/layouts/Home.vue'),
    beforeEnter: async () => {
      // fetch connected user in the store if possible
      const discordService = DiscordService.getInstance();
      if (discordService.isLoggedIn()) {
        const user = discordService.getUser() as DiscordUser;
        store.user().getUser(user.id);
      }
    }
  },
  {
    path: '/testing-ground',
    name: Routes.TestingGround,
    component: () => import('./core/layouts/QueriesTesting.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router