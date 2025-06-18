export class DatabaseClient {
    private static readonly baseUrl: string = '/.netlify/functions/db-query';  

    public static async request(queryType: string, data: Record<string, any> = {}): Promise<Record<string, any>> {
        const response = await fetch(DatabaseClient.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ queryType, data }),
        });

        const responseData = await response.json();

        if (responseData.success) {
            return responseData.data;
        } else {
            throw new Error(responseData.error || 'Unknown error occurred');
        }
    }
}