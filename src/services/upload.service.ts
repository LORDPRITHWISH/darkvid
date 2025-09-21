import { apiRequest } from "@/api/apiClient";
import axios from "axios";
// import axios from "axios";

export const initiateUpload = () => {
  const responce = apiRequest<{ data: any }>({
    method: "GET",
    url: `/video/upload/initiate`, 
  });
  return responce;
};

export const getUploadURL = (uploadId: string, partNumber: number, videoId: string) => {
  const responce = apiRequest<{ data: any }>({
    method: "POST",
    url: `/video/upload/getsignlink`,
    data: { uploadId, partNumber, videoId },
  });
  return responce;
}

export const uploadChunk = (signedUrl: string, chunk: Blob) => {
  return axios(signedUrl, {
    method: "PUT",
    data: chunk,
  });
  
// const responce = apiRequest<{ data: any }>({
//     method: "PUT",
//     url: signedUrl,
//     data: chunk,
//   });
//   return responce;
}

export const completeUpload = (videoId: string, uploadId: string, parts: { ETag: string; PartNumber: number }[]) => {
  const responce = apiRequest<{ data: any }>({
    method: "POST",
    url: `/video/upload/complete`,
    data: { videoId, uploadId, parts },
  });
  return responce;
}