import Cropper from "react-easy-crop";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  image: string;
  aspect: number;
  onCancel: () => void;
  onCropComplete: (file: File) => void;
};

export default function ImageCropModal({ image, aspect, onCancel, onCropComplete }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState<any>(null);

  const finishCrop = async () => {
    const img = new Image();
    img.src = image;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, cropPixels.x, cropPixels.y, cropPixels.width, cropPixels.height, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        onCropComplete(file);
      },
      "image/jpeg",
      0.9,
    );
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-slate-900 p-4 rounded-xl w-[90vw] max-w-xl">
        <div className="relative h-[320px]">
          <Cropper image={image} crop={crop} zoom={zoom} aspect={aspect} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_, pixels) => setCropPixels(pixels)} />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={finishCrop}>Crop & Save</Button>
        </div>
      </div>
    </div>
  );
}
