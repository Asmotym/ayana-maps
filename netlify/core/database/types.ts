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
    category_id?: number;
    category_name?: string;
    created_at?: Date;
} 

export type MarkerCategory = {
    id?: number;
    name: string;
}

export enum MarkerCategoryMapping {
    City = 1,
    Village = 2,
    Capital = 3,
    Fortress = 4,
    Ruin = 5,
    Mine = 6,
    Cavern = 7
}