import type { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { tablesQuery } from "./tables/tables.table";
import { versionQuery } from "./tables/version.table";
import { usersQuery } from "./tables/users.table";
import { mapMarkersQuery } from "./tables/map_markers.table";
import { markerCategoriesQuery } from "./tables/marker_categories.table";

export class QueryHandler {
    private event: HandlerEvent;
    private queryType: string = 'version';

    constructor(event: HandlerEvent) {
        this.event = event;
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
            return this.returnErrorResponse(error instanceof Error ? error : new Error('Unknown error'));
        }
    }

    protected async getQueryResult() {
        switch (this.queryType) {
            case 'version':
                return await versionQuery();
            case 'tables':
                return await tablesQuery();
            case 'users':
                return await usersQuery(this.event);
            case 'map_markers':
                return await mapMarkersQuery(this.event);
            case 'marker_categories':
                return await markerCategoriesQuery(this.event);
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

export function databaseQueriesHandler(event: HandlerEvent): Promise<HandlerResponse> {
    const queryHandler = new QueryHandler(event);
    return queryHandler.handle();
}