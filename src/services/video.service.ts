import { apiRequest } from "@/api/apiClient";
import type { LikeResponse } from "@/types/like.types";

export const getVideo = (videoId: string) => {
  const response = apiRequest<{ data: any }>({
    method: "GET",
    url: `/video/${videoId}`,
  });
  return response;
};

export const getRelatedVideos = (videoId: string) => {
  const response = apiRequest<{ data: any }>({
    method: "GET",
    url: `/video/${videoId}/related`,
  });
  return response;
}

export const startVideoWatch = (videoId: string, sessionId: string) => {
  const response = apiRequest<{ data: any }>({
    method: "POST",
    url: `/view/video/${videoId}/start`,
    data: { sessionId },
  });
  return response;
};

export const endVideoWatch = (videoId: string, sessionId: string, lastPosition: number) => {
  const response = apiRequest<{ data: any }>({
    method: "POST",
    url: `/view/video/${videoId}/end`,
    data: { sessionId, lastPosition },
  });
  return response;
};

export const heartbeatVideoWatch = (videoId: string, sessionId: string, lastPosition: number) => {
  const response = apiRequest<{ data: any }>({
    method: "POST",
    url: `/view/video/${videoId}/heartbeat`,
    data: { sessionId, lastPosition },
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
};

export const deleteVideo = (videoId: string) => {
  const response = apiRequest<{ data: any }>({
    method: "DELETE",
    url: `/video/${videoId}`,
  });
  return response;
}