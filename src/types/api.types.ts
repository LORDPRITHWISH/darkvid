// /home/darklord/Desktop/Code_Sync/darkvid/src/types/api.types.ts

export interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
    success: boolean;
}

export interface SubscriptionData {
    subscriber: string;
    subscribedTo: string;
    isPublic: boolean;
    _id: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    __v: number;
}

export type SubscribeResponse = ApiResponse<SubscriptionData>;