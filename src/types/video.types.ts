export interface OwnerDetails {
    _id: string;
    username: string;
    profilepic: string;
    isAdmin: boolean;
    isBanned: boolean;
    isVerified: boolean;
    subscriberCount: number;
}

export interface Video {
    title: string;
    videoKey: string;
    views: number;
    likes: number;
    status: 'uploading' | 'processing' | 'published' | 'failed'; // extend as needed
    createdAt: string; // ISO date string
    videoId: string;
    ownerDetails: OwnerDetails;
    thumbnailUrl: string;
}