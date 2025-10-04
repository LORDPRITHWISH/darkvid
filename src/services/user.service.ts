// import { apiRequest } from "@/lib/apiRequest";

import { apiRequest } from "@/api/apiClient";

export const getUserChannel = (userid: string) => {
  const responce = apiRequest<{ data: any }>({
    method: "GET",
    url: `/users/c/${userid}`,
  });
  return responce;
};

export const getProfile = () => {
  return apiRequest<{ data: any }>({
    method: "GET",
    url: `/users/profile`,
  });
}

export const refreshToken = () => {
  return apiRequest<{ data: any }>({
    method: "POST",
    url: `/users/refresh_token`,
  });
}