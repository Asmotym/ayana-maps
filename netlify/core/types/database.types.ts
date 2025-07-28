export interface DatabaseMapMarker {
    id: number;
    x: number;
    y: number;
    label: string | null;
    description: string | null;
    category_id?: number;
    category_name?: string;
    created_at?: Date;
    discord_user_id?: string;
}

export interface DatabaseMarkerCategory {
    id?: number;
    name: string;
}

export interface DatabaseUser {
    discord_user_id?: string;
    username: string;
    avatar: string;
    rights_update?: boolean;
    rights_testing_ground?: boolean;
}