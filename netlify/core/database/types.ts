export type User = {
    discord_user_id?: string;
    username: string;
    avatar: string;
    rights_update?: boolean;
}

export enum UserRights {
    UPDATE = 'rights_update',
    TESTING_GROUND = 'rights_testing_ground',
}

export type MapMarker = {
    id?: number;
    x: number;
    y: number;
    label?: string | null;
    description?: string | null;
    created_at?: Date;
} 