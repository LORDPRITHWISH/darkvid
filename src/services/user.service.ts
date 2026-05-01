// import { apiRequest } from "@/lib/apiRequest";

import { apiRequest } from "@/api/apiClient";
import type { SubscribeResponse } from "@/types/api.types";

export const getUserChannel = (userid: string) => {
  const responce = apiRequest<{ data: any }>({
    method: "GET",
    url: `/user/c/${userid}`,
  });
  return responce;
};

export const getProfile = () => {
  return apiRequest<{ data: any }>({
    method: "GET",
    url: `/user/profile`,
  });
};

export const refreshToken = () => {
  return apiRequest<{ data: any }>({
    method: "POST",
    url: `/user/refresh_token`,
  });
};


export const subscribeToChannel = (channelId: string) => {
  return apiRequest<SubscribeResponse>({
    method: "PUT",
    url: `/sub/c/${channelId}`,
  });
};
