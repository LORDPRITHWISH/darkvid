import { useEffect, useState } from "react";
import { FileUpload } from "@/components/upload/VideoUpload";

export default function FileUploadDemo() {
  const [files, setFiles] = useState<File | null>(null);
  const handleFileUpload = (files: File | null) => {
    setFiles(files);
    if (files) {
      console.log(files);
    }
  };

  useEffect(() => {
    if (files) {
      console.log("Selected file:", files);
    }
  }, [files]);

  
    return (
    <div className="w-full max-w-4xl mx-auto h-[700px] border border-dashed bg-white dark:bg-slate-950 border-neutral-200 dark:border-slate-700 rounded-lg flex items-center justify-center">
      <FileUpload onChange={handleFileUpload} />
    </div>
    );

}
