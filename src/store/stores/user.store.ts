import type { DiscordUser } from "../../../netlify/core/types/discord.types";
import { defineStore } from "pinia";
import { api } from "../../database/api";
import { UserRights } from "../../../netlify/core/types/enum.types";

export interface UserState {
    user: DiscordUser;
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({ user: {} as DiscordUser }),
    actions: {
        async getUser(discordUserId: string): Promise<DiscordUser> {
            this.user = await api.user.getUser(discordUserId);
            return this.user;
        },
        async isUserAuthorized(discordUserId: string, right: UserRights = UserRights.UPDATE) {
            return await api.user.isUserAuthorized(discordUserId, right);
        }
    }
});