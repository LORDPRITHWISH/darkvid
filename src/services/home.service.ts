import { apiRequest } from "@/api/apiClient";

export const getVideo = () => {
  const response = apiRequest<{ data: any }>({
    method: "GET",
    url: `/video`,
  });
  return response;
};
