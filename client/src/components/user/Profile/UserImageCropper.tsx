import type React from "react";
import { useState, useRef, useEffect } from "react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImageFile: File) => void; 
  onCancel: () => void;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function UserImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, 1));
    }
  }, [image]);

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
  };

  const getCroppedImg = async () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error("Failed to create blob");
        }
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
        onCropComplete(file);
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <div className="flex flex-col gap-4 max-h-[80vh] w-full">
      <div
        ref={containerRef}
        className="flex justify-center items-center h-[400px] w-full overflow-hidden bg-gray-50 rounded-md"
      >
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={1}
          className="max-h-full max-w-full"
        >
          <img
            ref={imgRef}
            src={image || "/placeholder.svg"}
            alt="Crop me"
            onLoad={onImageLoad}
            className="max-h-[400px] max-w-full object-contain"
            style={{
              maxHeight: "400px",
              maxWidth: "100%",
              height: "auto",
              width: "auto",
            }}
          />
        </ReactCrop>
      </div>
      <p className="text-center text-sm text-gray-500">
        Drag to adjust the crop. The profile picture will be displayed as a circle.
      </p>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-black text-black hover:bg-gray-100"
        >
          Cancel
        </Button>
        <Button
          onClick={getCroppedImg}
          disabled={!completedCrop?.width || !completedCrop?.height}
          className="bg-black hover:bg-gray-800 text-white"
        >
          Apply Crop
        </Button>
      </div>
    </div>
  );
}