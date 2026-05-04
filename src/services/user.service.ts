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

// Channel page specific API calls

export const getChannelVideos = (userId: string) => {
  return apiRequest<{ data: any }>({
    method: "GET",
    url: `/video/user/${userId}`,
  });
};

export const getChannelPlaylists = (userId: string) => {
  return apiRequest<{ success: boolean; data: any[] }>({
    method: "GET",
    url: `/playlist/user/${userId}`,
  });
};

export const getChannelTweets = (userId: string) => {
  return apiRequest<{ data: any[] }>({
    method: "GET",
    url: `/tweet/user/${userId}`,
  });
};

