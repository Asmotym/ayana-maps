import { defineStore } from "pinia";
import { type DiscordUser } from "../../../netlify/core/discord/client";
import { api } from "../../database/api";
import { UserRights } from "../../../netlify/core/database/types";

export interface UserState {
    user: null | DiscordUser;
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({ user: null }),
    actions: {
        async getUser(discordUserId: string): Promise<void> {
            this.user = await api.user.getUser(discordUserId);
        },
        async isUserAuthorized(discordUserId: string, right: UserRights = UserRights.UPDATE) {
            return await api.user.isUserAuthorized(discordUserId, right);
        }
    }
});