import { apiRequest } from "@/api/apiClient";
import type { CommentsResponse } from "@/types/comment.types";

export const addVideoComment = (videoId: string, content: string) => {
  const response = apiRequest<{ data: any }>({
    method: "POST",
    url: `/comment/video/${videoId}`,
    data: { content },
  });
  return response;
};

export const getVideoComments = (videoId: string) => {
  const response = apiRequest<CommentsResponse>({
    method: "GET",
    url: `/comment/video/${videoId}`,
  });
  return response;
};
