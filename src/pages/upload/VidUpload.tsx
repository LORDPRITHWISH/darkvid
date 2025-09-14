import { useState } from "react";
import { FileUpload } from "@/components/upload/VideoUpload";

export default function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

    return (
    <div className="w-full max-w-4xl mx-auto h-[700px] border border-dashed bg-white dark:bg-slate-950 border-neutral-200 dark:border-slate-700 rounded-lg flex items-center justify-center pointer-events-none">
      <FileUpload onChange={handleFileUpload} />
    </div>
    );

}
