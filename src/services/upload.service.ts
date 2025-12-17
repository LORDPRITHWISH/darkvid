import { apiRequest } from "@/api/apiClient";
import axios from "axios";
import { r } from "node_modules/react-router/dist/development/lib-B33EY9A0.d.mts";
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
};

// export const uploadChunk = (signedUrl: string, chunk: Blob) => {
//   console.log("the  Chunk is ", chunk.size);
//   return axios(signedUrl, {
//     method: "PUT",
//     data: chunk,
//     headers: {
//       "Content-Length": chunk.size.toString(),
//     },
//   });
// };

export const uploadChunk = async (signedUrl: string, chunk: Blob) => {
  console.log("Chunk size:", chunk.size);

  const res = await fetch(signedUrl, {
    method: "PUT",
    body: chunk,
    headers: {
      "Content-Length": chunk.size.toString(),
      "Content-Type": "application/octet-stream",
    },
  });

  // if (!res.ok) {
  //   throw new Error(`Upload failed: ${res.status}`);
  // }

  // const etag = res.headers.get("etag");
  // if (!etag) throw new Error("Missing ETag");

  // return etag.replaceAll('"', "");
  return res;
};


export const completeUpload = (videoId: string, uploadId: string, parts: { ETag: string; PartNumber: number }[]) => {
  const responce = apiRequest<{ data: any }>({
    method: "POST",
    url: `/video/upload/complete`,
    data: { videoId, uploadId, parts },
  });
  return responce;
};

export const setThumbnail = (videoId: string) => {
  const responce = apiRequest<{ data: any }>({
    method: "GET",
    url: `/video/setthumbnail/${videoId}`,
  });
  return responce;
};

export const setVideoData = (videoId: string, details: any) => {
  const responce = apiRequest<{ data: any }>({
    method: "POST",
    url: `/video/setdata/${videoId}`,
    data: details,
  });
  return responce;
};
