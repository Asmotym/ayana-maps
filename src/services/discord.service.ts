import type { DiscordAuth, DiscordUser } from "../../netlify/core/discord/client";
import { getApiUrl, getRedirectUri } from "../utils/urls";

export class DiscordService {
    private static readonly DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
    private static readonly DISCORD_API_URL = 'https://discord.com/api/v10';
    public user: DiscordUser | null = null;

    public async handleLogin(): Promise<DiscordUser | null> {
        const savedUser = localStorage.getItem('discord_user');
        if (savedUser) {
            this.user = JSON.parse(savedUser);
        } else {
            const auth = JSON.parse(localStorage.getItem('discord_auth') || '{}');
            if (auth.accessToken) {
                this.user = await this.fetchUserInfo(auth);
            }
        }
        
        // Handle OAuth callback
        if (window.location.hash.includes('token_type=')) {
            await this.handleAuthCallback();
        }

        return this.user;
    }

    public login() {
        const state = this.generateRandomString(32)
        localStorage.setItem('discord_oauth_state', state)

        const params = new URLSearchParams({
            client_id: DiscordService.DISCORD_CLIENT_ID,
            redirect_uri: getRedirectUri(),
            response_type: 'token',
            scope: 'identify email',
            state: state
        })

        window.location.href = `${DiscordService.DISCORD_API_URL}/oauth2/authorize?${params.toString()}`
    }

    public logout() {
        this.user = null;
        localStorage.removeItem('discord_auth');
        localStorage.removeItem('discord_user');
        localStorage.removeItem('discord_oauth_state');
    }

    public async handleAuthCallback() {
        const urlParams = new URLSearchParams(window.location.hash.slice(1));

        // retrieve url params from the discord redirect login
        const tokenType = urlParams.get('token_type') || '';
        const accessToken = urlParams.get('access_token') || '';
        const expiresIn = Number(urlParams.get('expires_in') || 0);
        const scope = urlParams.get('scope') || '';
        const state = urlParams.get('state') || '';
        const auth = {
            tokenType,
            accessToken,
            expiresIn,
            scope,
            state,
        }

        // retrieve saved state
        const savedState = localStorage.getItem('discord_oauth_state');

        if (auth.state === savedState) {
            // save auth to local storage
            localStorage.setItem('discord_auth', JSON.stringify(auth));

            // clean up url
            window.history.replaceState({}, document.title, window.location.pathname);

            // retrieve user info
            this.user = await this.fetchUserInfo(auth);
        }
    }

    public async fetchUserInfo(auth: DiscordAuth): Promise<DiscordUser> {
        const userInfo = await fetch(getApiUrl('/discord'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...auth, queryType: 'user' }),
        });
        const data = await userInfo.json();
        if (!data || !data.success) {
            throw new Error('[DiscordAuth] Failed to fetch user info');
        }

        localStorage.setItem('discord_user', JSON.stringify(data.data));
        return data.data;
    }

    private generateRandomString(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}