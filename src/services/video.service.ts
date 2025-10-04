import { apiRequest } from "@/api/apiClient";

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
}
