import type React from "react"

import { useState, useRef, useEffect } from "react"
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Button } from "@/components/ui/button"

interface ImageCropperProps {
  image: string
  onCropComplete: (croppedImageUrl: string) => void
  onCancel: () => void
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
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imgRef.current) {
      const { width, height } = imgRef.current
      setCrop(centerAspectCrop(width, height, 1))
    }
  }, [image])

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, 1))
  }

  const getCroppedImg = () => {
    if (!completedCrop || !imgRef.current) return

    const canvas = document.createElement("canvas")
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height
    canvas.width = completedCrop.width
    canvas.height = completedCrop.height
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("No 2d context")
    }

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    )

    const base64Image = canvas.toDataURL("image/jpeg")
    onCropComplete(base64Image)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={1}>
            
          <img
            ref={imgRef}
            src={image || "/placeholder.svg"}
            alt="Crop me"
            onLoad={onImageLoad}
            className="max-h-[300px] object-contain"
          />
        </ReactCrop>
      </div>
      <p className="text-center text-sm text-gray-500">
        Drag to adjust the crop. The badge will be displayed as a circle.
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={getCroppedImg}
          disabled={!completedCrop?.width || !completedCrop?.height}
          className="bg-[#FF9838] hover:bg-[#e67f26]"
        >
          Apply Crop
        </Button>
      </div>
    </div>
  )
}
