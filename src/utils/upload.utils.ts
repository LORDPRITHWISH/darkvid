import {
  completeUpload,
  getUploadURL,
  uploadChunk,
} from "@/services/upload.service";
import { useVideoStore } from "@/store/vidStore";

export async function uploadVideo() {
  const {
    Video,
    videoId,
    uploadId,
    setUploadProgress,
    setParts,
    parts,
    setUploadStatus,
  } = useVideoStore.getState();

  if (!Video || !videoId || !uploadId) {
    console.error("No video file or upload details found.");
    return;
  }

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
      if (eTag) {
        setParts({ ETag: eTag.replace(/"/g, ""), PartNumber: partNumber });
      }

      setUploadProgress(Math.round((partNumber / totalChunks) * 100));
      console.log(`Uploaded part ${partNumber}/${totalChunks}`);
    } else {
      console.warn(`ETag not found for part ${partNumber}`);
    }
  }

  // Deduplicate parts before completing
  const uniqueParts = Array.from(
    new Map(parts.map((p) => [p.PartNumber, p])).values()
  );

  await completeUpload(videoId, uploadId, uniqueParts);
  setUploadStatus("completed");

  console.log("Upload complete for", videoId);
}
