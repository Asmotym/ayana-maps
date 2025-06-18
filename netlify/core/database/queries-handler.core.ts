import { HandlerEvent, HandlerContext, HandlerResponse } from "@netlify/functions";
import { tablesQuery } from "./queries/tables.query";
import { versionQuery } from "./queries/version.query";
import { usersRightsQuery } from "./queries/users-rights.query";

export class QueryHandler {
    private event: HandlerEvent;
    private context: HandlerContext;
    private queryType: string = 'version';

    constructor(event: HandlerEvent, context: HandlerContext) {
        this.event = event;
        this.context = context;
    }

    public async handle(): Promise<HandlerResponse> {
        if (this.event.httpMethod === 'OPTIONS') return this.returnOptionsResponse();

        try {
            if (this.event.httpMethod === 'POST' && typeof this.event.body === 'string') {
                const body = JSON.parse(this.event.body);
                this.queryType = body.queryType || 'version';
            }
    
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    success: true,
                    data: await this.getQueryResult(),
                    queryType: this.queryType
                })
            };
        } catch (error) {
            return this.returnErrorResponse(error);
        }
    }

    protected async getQueryResult() {
        switch (this.queryType) {
            case 'version':
                return await versionQuery();
            case 'tables':
                return await tablesQuery();
            case 'users_rights':
                return await usersRightsQuery(this.event, this.context);
            default:
                throw new Error(`Unknown query type: ${this.queryType}`);
        }
    }

    protected returnOptionsResponse(): HandlerResponse {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            },
        };
    }

    protected returnErrorResponse(error: Error): HandlerResponse {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: false,
                error: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }

    protected returnParseErrorResponse(): HandlerResponse {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: false,
                error: 'Invalid JSON in request body'
            })
        };
    }
}

export function databaseQueriesHandler(event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> {
    const queryHandler = new QueryHandler(event, context);
    return queryHandler.handle();
}