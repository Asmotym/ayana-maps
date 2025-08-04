import type { RouteRecordRaw } from 'vue-router'
import type { DiscordUser } from '../../../netlify/core/types/discord.types';
import { DiscordService } from '../../modules/discord-auth/services/discord.service';
import { store } from '../store/index.store';
import Home from '../layouts/Home.vue';

export enum HomeRoutes {
    Base = 'Home'
}

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: HomeRoutes.Base,
        component: Home,
        beforeEnter: async () => {
            // fetch connected user in the store if possible
            const discordService = DiscordService.getInstance();
            if (discordService.isLoggedIn()) {
                const user = discordService.getUser() as DiscordUser;
                const userStore = store.user();
                await userStore.getUser(user.id);
            }
        }
    }
]