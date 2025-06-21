import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { DiscordAuth, DiscordClient } from "./client";
import { getUser, insertUser, updateUser } from "../database/queries/users.query";

export class DiscordHandler {
    private event: HandlerEvent;
    private headers: Record<string, string> = {
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Credentials': 'true'
    }
    private discordClient: DiscordClient;
    private body: DiscordAuth & { queryType: string } = {
        tokenType: '',
        accessToken: '',
        expiresIn: 0,
        scope: '',
        state: '',
        queryType: 'user'
    };

    constructor(event: HandlerEvent) {
        this.event = event;
        this.discordClient = new DiscordClient();
    }

    public async handle(): Promise<HandlerResponse> {
        // handle options request
        if (this.event.httpMethod === 'OPTIONS') return this.returnOptionsResponse();

        // only allow POST requests
        if (this.event.httpMethod !== 'POST') return this.returnMethodNotAllowedResponse();

        try {
            if (this.event.httpMethod === 'POST' && typeof this.event.body === 'string') {
                const body: DiscordAuth & { queryType: string } = JSON.parse(this.event.body);
                this.body = body;
                this.body.queryType = this.body.queryType || 'user';
            }

            return {
                statusCode: 200,
                headers: this.headers,
                body: JSON.stringify({
                    success: true,
                    data: await this.getQueryResult(),
                    queryType: this.body.queryType
                })
            };
        } catch (error) {
            console.error(`[DiscordHandler] ${error}`);
            return {
                statusCode: 400,
                headers: this.headers,
                body: JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' })
            }
        }
    }

    protected async getQueryResult() {
        switch (this.body.queryType) {
            case 'user':
                const discordUser = await this.discordClient.getUserInfo(this.body);
                const existingUser = await getUser(discordUser.id);
                if (existingUser === undefined) {
                    await insertUser({
                        discord_user_id: discordUser.id,
                        username: discordUser.username,
                        avatar: discordUser.avatar,
                    });
                } else {
                    await updateUser(discordUser.id, {
                        username: discordUser.username,
                        avatar: discordUser.avatar,
                    });
                }
                return discordUser;
        }
    }

    protected returnOptionsResponse(): HandlerResponse {
        return {
            statusCode: 200,
            headers: this.headers,
            body: ''
        }
    }

    protected returnMethodNotAllowedResponse(): HandlerResponse {
        return {
            statusCode: 405,
            headers: this.headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        }
    }
}

export function discordHandler(event: HandlerEvent): Promise<HandlerResponse> {
    const discordHandler = new DiscordHandler(event);
    return discordHandler.handle();
}