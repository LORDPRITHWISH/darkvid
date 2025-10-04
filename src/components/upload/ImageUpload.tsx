import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, X } from "lucide-react";

export default function ImageUpload({
  onFileChange,
  accept = "image/*",
  maxSizeMB = 5,
  initialImage = "",
}: {
  onFileChange?: (file: File | null) => void;
  accept?: string;
  maxSizeMB?: number;
  initialImage?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialImage) {
      setPreview(initialImage);
      setFileName("Previously uploaded image");
    }
  }, [initialImage]);

  function handleFile(file: File | null) {
    setError(null);
    if (!file) {
      setPreview(initialImage || null);
      setFileName(initialImage ? "Previously uploaded image" : null);
      onFileChange?.(null);
      return;
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`File too large. Max ${maxSizeMB} MB.`);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    setFileName(file.name);
    onFileChange?.(file);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      // handleFile(null);
      return;
    }
    const f = e.target.files?.[0] ?? null;
    handleFile(f);
  }

  function clear() {
    if (preview && !initialImage) URL.revokeObjectURL(preview);
    setPreview(initialImage || null);
    setFileName(initialImage ? "Previously uploaded image" : null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onFileChange?.(null);
  }

  return (
    <div className="w-64">
      <label
        htmlFor="image-upload"
        className="relative block w-full h-40 rounded-2xl border-2 border-dashed border-gray-600 bg-gray-900 hover:border-gray-400 cursor-pointer overflow-hidden"
      >
        {/* Hidden file input */}
        <input
          id="image-upload"
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={onChange}
        />

        {/* Preview or placeholder */}
        {preview ? (
          <img
            src={preview}
            alt={fileName ?? "preview"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-sm text-gray-300">
            <UploadCloud className="w-8 h-8 text-gray-400" />
            <div>Click to choose or drag image here</div>
            <div className="text-xs text-gray-500">Max {maxSizeMB} MB</div>
          </div>
        )}

        {/* Overlay icon (visible on preview) */}
        {preview && (
          <div className="absolute inset-0 flex items-start justify-end p-2">
            <div className="flex gap-2">
              <button
                type="button"
                title="Replace image"
                onClick={() => inputRef.current?.click()}
                className="rounded-md bg-black/70 backdrop-blur px-2 py-1 shadow text-gray-200 hover:text-white"
              >
                <UploadCloud className="w-4 h-4" />
              </button>
              <button
                type="button"
                title="Remove image"
                onClick={clear}
                className="rounded-md bg-black/70 backdrop-blur px-2 py-1 shadow text-gray-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </label>

      {/* Footer info */}
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
        <div>{fileName ?? "No file selected"}</div>
        <div className="text-red-400">{error}</div>
      </div>
    </div>
  );
}
