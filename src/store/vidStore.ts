import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools } from "zustand/middleware";

type UploadStatus = "idle" | "uploading" | "completed" | "error";


interface  VideoState  {
    Video: File | null;
    uploadProgress: number; // %
    uploadStatus: UploadStatus;
    videoUrl: string | null;
  
    setVideo: (file: File) => void;
    setUploadProgress: (progress: number) => void;
    setUploadStatus: (status: UploadStatus) => void;
    setVideoUrl: (url: string) => void;
    reset: () => void;

};

export const useVideoStore = create<VideoState>()(
  devtools(
    persist(
      (set) => ({
        Video: null,
        uploadProgress: 0,
        uploadStatus: "idle",
        videoUrl: null,
        
        setVideo: (file) => set({ Video: file }),
        setUploadProgress: (progress) => set({ uploadProgress: progress }),
        setUploadStatus: (status) => set({ uploadStatus: status }),
        setVideoUrl: (url) => set({ videoUrl: url }),
        reset: () =>
          set({
            Video: null,
            uploadProgress: 0,
            uploadStatus: "idle",
            videoUrl: null,
          }),


      }),
      {
        name: "video-store", // localStorage key
      }
    )
  )
);
