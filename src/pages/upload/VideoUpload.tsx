import { useEffect, useState } from "react";
import { FileUpload } from "@/components/upload/VideoUpload";
import { useVideoStore } from "@/store/vidStore";
import { useNavigate } from "react-router";

export default function FileUploadDemo() {
  const [files, setFiles] = useState<File | null>(null);
  const handleFileUpload = (files: File | null) => {
    setFiles(files);
    if (files) {
      console.log(files);
    }
  };

  const navigator = useNavigate();

  const { setVideo, setUploadStatus, initiateUpload, reset } = useVideoStore();

  useEffect(() => {
    console.log("Component mounted so resetting store");
    reset();
  }, []);

  useEffect(() => {
    if (files) {
      setVideo(files);
      setUploadStatus("idle");
      initiateUpload().then((videoId) => {
        if (videoId) {
          // console.log("Upload initiated with video ID:", videoId);
          navigator(`/upload/${videoId}`);
        } else {
          console.error("Failed to initiate upload.");
        }
      });
    }
  }, [files]);

  return (
    <div className="w-full max-w-4xl mx-auto h-[700px] border border-dashed bg-white dark:bg-slate-950 border-neutral-200 dark:border-slate-700 rounded-lg flex items-center justify-center">
      <FileUpload onChange={handleFileUpload} />
    </div>
  );
}
