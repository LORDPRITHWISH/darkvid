import { useRef, useState } from "react";
import ImageCropModal from "./ImageCropModal";

type Props = {
  label?: string;
  aspect: number; // 1 or 21/9
  onFileSelect: (file: File) => void;
  children?: React.ReactNode;
};

export default function ImageDropzone({ label, aspect, onFileSelect, children }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setCropSrc(URL.createObjectURL(file));
  };

  return (
    <div>
      {label && <label className="block text-white mb-2">{label}</label>}

      <div onClick={() => inputRef.current?.click()} className="border-2 border-dashed rounded-xl p-4 cursor-pointer hover:border-blue-500 transition">
        {preview ? <img src={preview} className="rounded-lg w-full object-cover" /> : (children ?? <p className="text-gray-400 text-sm text-center">Click or drag image here</p>)}

        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
      </div>

      {cropSrc && (
        <ImageCropModal
          image={cropSrc}
          aspect={aspect}
          onCancel={() => setCropSrc(null)}
          onCropComplete={(file) => {
            setPreview(URL.createObjectURL(file));
            onFileSelect(file);
            setCropSrc(null);
          }}
        />
      )}
    </div>
  );
}
