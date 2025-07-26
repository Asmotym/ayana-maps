import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { store } from '../store/index.store'
import { DiscordService } from '../services/discord.service'
import type { DiscordUser } from '../../netlify/core/discord/client';

export enum Routes {
  Home = 'Home',
  TestingGround = 'TestingGround'
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: Routes.Home,
    component: () => import('../components/routes/Home.vue'),
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
    component: () => import('../components/routes/QueriesTesting.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 