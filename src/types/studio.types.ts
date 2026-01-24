export type StudioVideo = {
  _id: string;
  videoKey: string;
  tags: string[];
  privacy: "public" | "private" | "unlisted";
  isPublished: boolean;
  status: "completed" | "processing" | "failed" | string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  videoId: string;
  duration: string; // seconds as string
  title: string;
  commentCount: number;
  likes: number;
  dislikes: number;
  uniqueViews: number;
  totalWatchTime: number;
  totalViews: number;
  thumbnailUrl: string;
};
