import { apiRequest } from "@/api/apiClient";
import type { LikeResponse } from "@/types/like.types";

export const getVideo = (videoId: string) => {
  const response = apiRequest<{ data: any }>({
    method: "GET",
    url: `/video/${videoId}`,
  });
  return response;
};

export const getVideoDetails = (videoId: string) => {
  const response = apiRequest<{ data: any }>({
    method: "GET",
    url: `/video/details/${videoId}`,
  });
  return response;
};

export const toggleVideoLike = (videoId: string, mode: "like" | "dislike" | "") => {
  // console.log("the video was", mode.length);
  const response = apiRequest<LikeResponse>({
    method: "POST",
    url: `/like/toggle/v/${videoId}`,
    data: { mode },
  });
  return response;
};

export const commentOnVideo = (videoId: string, commentText: string) => {
  const response = apiRequest<{ data: any }>({
    method: "POST",
    url: `/comment/video/${videoId}`,
    data: { content: commentText },
  });
  return response;
}
