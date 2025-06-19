export type DiscordAuth = {
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    scope: string;
    state: string;
}

export type DiscordUser = {
    id: string;
    username: string;
    avatar: string;
}

export class DiscordClient {
    protected baseUrl: string = "https://discord.com/api/v10";

    public async getUserInfo(auth: DiscordAuth): Promise<DiscordUser> {
        console.info('[DiscordClient] Getting user info', { auth });
        const userResponse = await fetch(`${this.baseUrl}/users/@me`, {
            headers: {
                Authorization: `${auth.tokenType} ${auth.accessToken}`,
            },
        });

        if (!userResponse.ok) {
            console.error('Discord user info fetch failed:', await userResponse.text())
            throw new Error('Failed to get user info');
        }

        const json = await userResponse.json() as DiscordUser & { global_name: string };
        const user: DiscordUser = {
            id: json.id,
            username: json.global_name,
            avatar: `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.png?size=512`,
        };

        return user;
    }
}