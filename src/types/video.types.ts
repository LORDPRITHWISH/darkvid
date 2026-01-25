import type { OwnerDetails } from "./user.type";

export interface VideoPreview {
  totalViews: number;
  hasViewed: boolean;
  completed: boolean;
  title: string;
  views: number;
  likes: number;
  createdAt: string; // ISO date string
  videoId: string;
  ownerDetails: OwnerDetails;
  thumbnailUrl: string;
  duration: number; // added duration field
  watchProgress?: number; // percentage of video watched
}

// export interface VideoDetails extends VideoPreview {
export interface VideoDetails extends VideoPreview {
  _id: string;
  tags: string[];
  isPublished: boolean;
  status: "uploading" | "processing" | "published" | "failed"; // extend as needed
  description: string;
  isSubscribed: boolean;
  LikeMode: "like" | "dislike" | "";
  playbackUrl: string;
  isOwner: boolean;
  likes: number;
  dislikes: number;
  createdAt: string; // ISO date string
  privacy: "public" | "private";
  duration: number; // duration in seconds
}
