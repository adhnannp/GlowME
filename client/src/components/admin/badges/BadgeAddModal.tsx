import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ImageCropper from "./ImageCropper"
import type { Badge } from "@/components/admin/badges/BadgeTable"

interface BadgeAddModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (badge: Omit<Badge, "_id" | "created_at" | "updated_at" | "isListed">) => void
}

export default function BadgeAddModal({ isOpen, onClose, onSave }: BadgeAddModalProps) {
  const [name, setName] = useState("")
  const [requiredXp, setRequiredXp] = useState<number>(0)
  const [image, setImage] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null) 

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]

      if (!allowedTypes.includes(file.type)) {
        setFileError("Only JPG, JPEG, or PNG files are allowed.")
        e.target.value = ""
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setFileError("Image size should not exceed 5MB.")
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
    if (!name || !croppedImage || requiredXp <= 0) {
      return
    }

    onSave({
      name,
      requiredXp,
      image: croppedImage,
    })

    // Reset form
    setName("")
    setRequiredXp(0)
    setImage(null)
    setCroppedImage(null)
    onClose()
  }

  const handleClose = () => {
    setName("")
    setRequiredXp(0)
    setImage(null)
    setCroppedImage(null)
    setShowCropper(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Badge</DialogTitle>
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
                onChange={(e) => setRequiredXp(Number.parseInt(e.target.value) || 0)}
                className="col-span-3"
                placeholder="Enter required XP"
                min="0"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Badge Image
              </Label>
              <div className="col-span-3">
                <Input
                  id="image"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    >
                    Choose File
                </Button>
                {fileError && (
                    <p className="text-sm text-red-500 mt-1">{fileError}</p>
                )}
                {croppedImage && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={croppedImage || "/placeholder.svg"}
                      alt="Cropped badge"
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                    <Button variant="outline" size="sm" onClick={() => setShowCropper(true)}>
                      Re-crop
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
                Cancel
            </Button>
            <Button
                onClick={handleSubmit}
                disabled={!name || !croppedImage || requiredXp <= 0}
                className="bg-[#FF9838] hover:bg-[#e67f26]"
            >
                Save Badge
            </Button>
          </DialogFooter>
        </>
        )}
      </DialogContent>
    </Dialog>
  )
}