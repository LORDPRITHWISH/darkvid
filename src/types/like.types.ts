export interface LikeResponse {
    status: number; // HTTP status code
    message: string; // Response message
    data: LikeData; // Data object containing like details
    success: boolean; // Indicates if the operation was successful
}

export interface LikeData {
    videoId: string; // ID of the liked video
    originator: string; // ID of the user who liked the video
    mode: string; // Mode of the action (e.g., "like")
    _id: string; // Unique ID of the like record
    createdAt: string; // Timestamp of when the like was created
    updatedAt: string; // Timestamp of when the like was last updated
    __v: number; // Version key (used by MongoDB)
}