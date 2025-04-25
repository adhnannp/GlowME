import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ImageCropper from "./ImageCropper"
import type { Badge } from "@/components/admin/badges/BadgeTable"

interface BadgeEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (badge: Badge) => void
  badge: Badge | null
}

const getImageSrc = (imagePath: string | null): string => {
  if (!imagePath) return "/placeholder.svg"
  if (imagePath.startsWith("data:") || imagePath.startsWith("blob:")) return imagePath
  if (imagePath.startsWith("http")) return imagePath
  return `${import.meta.env.VITE_BASE_URL }${imagePath}`
}

export default function BadgeEditModal({ isOpen, onClose, onSave, badge }: BadgeEditModalProps) {
  const [name, setName] = useState("")
  const [requiredXp, setRequiredXp] = useState<number>(0)
  const [image, setImage] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  useEffect(() => {
    if (badge) {
      setName(badge.name)
      setRequiredXp(badge.requiredXp)
      setCroppedImage(badge.image)
    }
  }, [badge])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]

      if (!allowedTypes.includes(file.type)) {
        setFileError("Only JPG, JPEG, and PNG files are allowed.")
        e.target.value = ""
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setFileError("Image size must be less than 5MB.")
        e.target.value = ""
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
        setShowCropper(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = (croppedImageUrl: string) => {
    setCroppedImage(croppedImageUrl)
    setShowCropper(false)
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = () => {
    if (!badge || !name || !croppedImage) {
      return
    }

    onSave({
      ...badge,
      name,
      requiredXp,
      image: croppedImage,
    })

    onClose()
  }

  const handleClose = () => {
    setImage(null)
    if (badge) {
      setCroppedImage(badge.image)
    }
    setShowCropper(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Badge</DialogTitle>
        </DialogHeader>

        {showCropper && image ? (
          <ImageCropper image={image} onCropComplete={handleCropComplete} onCancel={handleCropCancel} />
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Badge Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter badge name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="requiredXp" className="text-right">
                  Required XP
                </Label>
                <Input
                  id="requiredXp"
                  type="number"
                  value={requiredXp}
                  onChange={(e) => setRequiredXp(Number(e.target.value) || 0)} // Convert to number
                  className="col-span-3"
                  min='0'
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Badge Image</Label>
                <div className="col-span-3">
                  {croppedImage && (
                    <div className="mb-2 flex items-center gap-2">
                      <img
                        src={getImageSrc(croppedImage)}
                        alt="Badge"
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    </div>
                  )}
                  <Input
                    id="image"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="col-span-3"
                  />
                  <p className="text-xs text-gray-500 mt-1">Upload a new image</p>
                </div>
                {fileError && <p className="text-xs text-red-500 mt-1">{fileError}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!name || !croppedImage} className="bg-[#FF9838] hover:bg-[#e67f26]">
                Save Changes
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}