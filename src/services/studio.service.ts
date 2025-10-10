import { apiRequest } from "@/api/apiClient";

export const getStudioVideo = () => {
  const response = apiRequest<{ data: any }>({
    method: "GET",
    url: `/video/studio`,
  });
  return response;
};
