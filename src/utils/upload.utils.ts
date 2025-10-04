import {
  completeUpload,
  getUploadURL,
  setThumbnail,
  uploadChunk,
} from "@/services/upload.service";
import { useVideoStore } from "@/store/vidStore";

export async function uploadVideo() {
  const { Video, videoId, uploadId, setUploadProgress, setUploadStatus } =
    useVideoStore.getState();

  if (!Video || !videoId || !uploadId) {
    console.error("No video file or upload details found.");
    return;
  }

  const parts: { ETag: string; PartNumber: number }[] = [];

  const chunkSize = 5 * 1024 * 1024; // 5 MB
  const totalChunks = Math.ceil(Video.size / chunkSize);

  for (let partNumber = 1; partNumber <= totalChunks; partNumber++) {
    const start = (partNumber - 1) * chunkSize;
    const end = Math.min(start + chunkSize, Video.size);
    const chunk = Video.slice(start, end);

    // Get signed URL
    const response = await getUploadURL(uploadId, partNumber, videoId);
    if (!response?.data?.signedUrl) {
      console.error(`No signed URL for part ${partNumber}`);
      return;
    }

    // Upload chunk
    const uploadResp = await uploadChunk(response.data.signedUrl, chunk);

    if (uploadResp && uploadResp?.headers) {
      const eTag = uploadResp?.headers?.etag;
      if (eTag) parts.push({ ETag: eTag, PartNumber: partNumber });
      else {
        console.warn(`ETag not found in response for part ${partNumber}`);
        setUploadStatus("error");
        return;
      }

      setUploadProgress(Math.round((partNumber / totalChunks) * 100));
      console.log(`Uploaded part ${partNumber}/${totalChunks}`);
    } else {
      console.warn(`ETag not found for part ${partNumber}`);
    }
  }

  const uniqueParts = Array.from(
    new Map(parts.map((p) => [p.PartNumber, p])).values()
  );

  // console.log("Completing upload with parts:", uniqueParts);

  try {
    await completeUpload(videoId, uploadId, uniqueParts);
    setUploadStatus("completed");
  } catch (error) {
    console.error("Error completing upload:", error);
    setUploadStatus("error");
    return;
  }

  console.log("Upload complete for", videoId);
}

export async function uploadThumbnail(file: File, videoId: string) {

  // console.log("Uploading thumbnail for", videoId, file);

  if (!file || !videoId) {
    console.error("No thumbnail file or video ID found.");
    return;
  }

  const response = await setThumbnail(videoId);

  if (response?.data?.uploadURL) {
    try {
      await uploadChunk(response.data.uploadURL, file);
      console.log("Thumbnail uploaded successfully for", videoId);
    } catch (error) {
      console.error("Error uploading thumbnail:", error);
    }
  } else {
    console.error("No upload URL received for thumbnail.");
  }
}
