// import { apiRequest } from "@/lib/apiRequest";

import { apiRequest } from "@/api/apiClient";

export const getUserChannel = (userid: string) => {
  const responce = apiRequest<{ data: any }>({
    method: "GET",
    url: `/users/c/${userid}`, // no need for baseURL
  });
  return responce;
};

export const getProfile = () => {
  return apiRequest<{ data: any }>({
    method: "GET",
    url: `/users/profile`, // no need for baseURL
  });
}