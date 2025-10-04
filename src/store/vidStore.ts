import { initiateUpload } from "@/services/upload.service";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type UploadStatus = "idle" | "uploading" | "completed" | "error";

interface VideoState {
  Video: File | null;
  uploadProgress: number;
  uploadStatus: UploadStatus;
  videoId: string | null;
  uploadId: string | null;

  setVideo: (file: File) => void;
  setUploadProgress: (progress: number) => void;
  setUploadStatus: (status: UploadStatus) => void;
  // setVideoUrl: (url: string) => void;
  reset: () => void;

  initiateUpload: () => Promise<string | undefined>;
  // setParts: (part: { ETag: string; PartNumber: number }) => void;
}

export const useVideoStore = create<VideoState>()(
  devtools(
      (set) => ({
        Video: null,
        uploadProgress: 0,
        uploadStatus: "idle",
        // videoUrl: null,
        videoId: null,
        uploadId: null,
        // parts: [],

        setVideo: (file) => set({ Video: file }),
        setUploadProgress: (progress) => set({ uploadProgress: progress }),
        setUploadStatus: (status) => set({ uploadStatus: status }),
        // setVideoUrl: (url) => set({ videoUrl: url }),
        reset: () =>
          set({
            Video: null,
            uploadProgress: 0,
            uploadStatus: "idle",
            videoId: null,
            uploadId: null,
            // parts: [],
            // videoUrl: null,
          }),

        initiateUpload: async () => {
          try {
            // Assuming initiateUpload is an API call that returns an ID
            const response = await initiateUpload();
            if (response && response.data) {
              set({
                videoId: response.data.videoId,
                uploadId: response.data.uploadId,
                uploadStatus: "uploading",
                uploadProgress: 0,
              });
              return response.data.videoId;
            } else {
              throw new Error("No data returned from initiateUpload");
            }
          } catch (error) {
            console.error("Failed to initiate upload:", error);
            set({ uploadStatus: "error" });
          }
        },
      }),
      {
        name: "video-store", // localStorage key
      }
    
  )
);
