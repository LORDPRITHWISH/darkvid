import { apiRequest } from "@/api/apiClient";

export const loginUser = (payload: { identity: string; password: string }) => {
  return apiRequest<{ data: any }>({
    method: "POST",
    url: `/users/login`,
    data: payload,
  });
}

export const availUsername = (username: string) => {
  return apiRequest<{ data: any }>({
    method: "GET",
    url: `/users/available/${username}`,
  });
}

export const registerUser = (payload: { fullname: string; email: string; username: string; password: string; profilePic?: File }) => {
  const formData = new FormData();

  formData.append("fullname", payload.fullname);
  formData.append("email", payload.email);
  formData.append("username", payload.username);
  formData.append("password", payload.password);

  console.log("the profile",payload.profilePic)

  if (payload.profilePic) {
    formData.append("profilepic", payload.profilePic);
  }

  return apiRequest<{ data: any }>({
    method: "POST",
    url: "/users/register",
    data: formData,
    // headers: {
    //   "Content-Type": "multipart/form-data",
    // },
  });
};


export const logoutUser = () => {
  return apiRequest<{ data: any }>({
    method: "POST",
    url: `/users/logout`,
  });
}

