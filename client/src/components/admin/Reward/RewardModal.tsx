import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Edit2, ChevronUp, ChevronDown, X } from "lucide-react";
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { z } from "zod";
import { rewardSchema, rewardUpdateSchema } from "@/validations/reward/rewardValidation";

export interface Reward {
  _id: string;
  name: string;
  coin: number;
  description: string;
  coverImage: string;
  isListed: boolean;
  created_at: string;
  updated_at: string;
}

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rewardData: Omit<Reward, "_id" | "created_at" | "updated_at" | "isListed">) => void;
  reward?: Reward | null;
  loading?: boolean;
  title: string;
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
  );
}

function convertPercentCropToPixelCrop(crop: Crop, image: HTMLImageElement): PixelCrop {
  const scaleX = image.naturalWidth / 100;
  const scaleY = image.naturalHeight / 100;
  return {
    x: crop.x * scaleX,
    y: crop.y * scaleY,
    width: crop.width * scaleX,
    height: crop.height * scaleY,
    unit: "px",
  };
}

export default function RewardModal({ isOpen, onClose, onSave, reward, loading = false, title }: RewardModalProps) {
  const [formData, setFormData] = useState({
    name: reward?.name || "",
    coin: reward?.coin || 0,
    description: reward?.description || "",
    coverImage: reward?.coverImage || "",
  });
  const [mainPhoto, setMainPhoto] = useState<string>(reward?.coverImage || "");
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState<Crop | undefined>();
  const [imageError, setImageError] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string>("");
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  const imgRef = useRef<HTMLImageElement>(null);
  const mainPhotoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const initialData = {
        name: reward?.name || "",
        coin: reward?.coin || 0,
        description: reward?.description || "",
        coverImage: reward?.coverImage || "",
      };
      setFormData(initialData);
      setMainPhoto(reward?.coverImage || "");
      setShowCropper(false);
      setOriginalImage("");
      setCrop(undefined);
      setImageError(null);
      setFormErrors({});
      console.log("Initialized formData:", initialData);
      console.log("Initialized mainPhoto:", reward?.coverImage || "");
    }
  }, [isOpen, reward]);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    console.log("Image loaded with dimensions:", width, height);
    setCrop(centerAspectCrop(width, height, 1));
  }, []);

  const handleMainPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name, file.type);
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        setImageError("Only JPG, JPEG, or PNG files are allowed.");
        console.error("Invalid file type:", file.type);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setImageError("File size exceeds 5MB limit.");
        console.error("File size too large:", file.size);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result && result.startsWith("data:image/")) {
          setOriginalImage(result);
          setMainPhoto("");
          setShowCropper(true);
          setImageError(null);
          console.log("FileReader result:", result.substring(0, 50) + "...");
        } else {
          console.error("Invalid image data URL");
          setImageError("Failed to load image. Please upload a valid image file.");
        }
      };
      reader.onerror = () => {
        console.error("FileReader error");
        setImageError("Error reading image file.");
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = useCallback(() => {
    if (!imgRef.current || !crop) {
      console.error("Image reference or crop data is missing");
      setImageError("Image reference or crop data is missing.");
      return null;
    }

    const image = imgRef.current;
    if (!image.complete || image.naturalWidth === 0 || image.naturalHeight === 0) {
      console.error("Image is not fully loaded or has invalid dimensions:", {
        complete: image.complete,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
      });
      setImageError("Image is not fully loaded or has invalid dimensions.");
      return null;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get canvas context");
      setImageError("Failed to get canvas context.");
      return null;
    }

    const pixelCrop = convertPercentCropToPixelCrop(crop, image);
    const outputSize = 300; // Adjust as needed
    canvas.width = outputSize;
    canvas.height = outputSize;

    console.log("Pixel crop parameters:", {
      pixelCropX: pixelCrop.x,
      pixelCropY: pixelCrop.y,
      pixelCropWidth: pixelCrop.width,
      pixelCropHeight: pixelCrop.height,
      imageNaturalWidth: image.naturalWidth,
      imageNaturalHeight: image.naturalHeight,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
    });

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    if (!dataUrl || dataUrl === "data:,") {
      console.error("Failed to generate cropped image data URL");
      setImageError("Failed to generate cropped image data URL.");
      return null;
    }

    console.log("Cropped image data URL:", dataUrl.substring(0, 50) + "...");
    return dataUrl;
  }, [crop]);

  const handleCropSave = () => {
    const croppedImage = getCroppedImg();
    if (croppedImage) {
      setMainPhoto(croppedImage);
      setFormData((prev) => ({ ...prev, coverImage: croppedImage }));
      console.log("Cropped image saved to mainPhoto:", croppedImage.substring(0, 50) + "...");
    } else {
      console.error("Failed to save cropped image");
    }
    setShowCropper(false);
    setOriginalImage("");
    setCrop(undefined);
  };

  const handleCropCancel = () => {
    if (originalImage) {
      setMainPhoto(originalImage);
      setFormData((prev) => ({ ...prev, coverImage: originalImage }));
      console.log("Crop cancelled, using original image:", originalImage.substring(0, 50) + "...");
    } else {
      setMainPhoto("");
      setFormData((prev) => ({ ...prev, coverImage: "" }));
    }
    setShowCropper(false);
    setOriginalImage("");
    setCrop(undefined);
    console.log("Crop cancelled");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Choose schema based on whether editing or creating
    const schema = reward ? rewardUpdateSchema : rewardSchema;
    try {
      // Validate form data (excluding coverImage for now)
      const validatedData = schema.parse({
        name: formData.name,
        coin: formData.coin,
        description: formData.description,
      });
      // If coverImage is empty and creating a new reward, set error
      if (!formData.coverImage && !reward) {
        setImageError("Cover image is required for new rewards.");
        return;
      }
      setFormErrors({});
      console.log("Submitting formData:", { ...formData, ...validatedData });
      onSave({ ...formData, ...validatedData });
      handleClose();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof typeof formData, string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof typeof formData;
          errors[field] = err.message;
        });
        setFormErrors(errors);
        console.error("Form validation errors:", errors);
      }
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      coin: 0,
      description: "",
      coverImage: "",
    });
    setMainPhoto("");
    setShowCropper(false);
    setOriginalImage("");
    setCrop(undefined);
    setImageError(null);
    setFormErrors({});
    console.log("Modal closed, state reset");
    onClose();
  };

  const adjustCoin = (increment: boolean) => {
    setFormData((prev) => ({
      ...prev,
      coin: Math.max(0, prev.coin + (increment ? 100 : -100)),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription id="dialog-description">
            {title === "Edit Reward" ? "Edit the details of the reward." : "Create a new reward by providing the necessary details."}
          </DialogDescription>
        </DialogHeader>

        {imageError && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{imageError}</div>
        )}

        {showCropper ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Crop Image</h3>
              <div className="flex space-x-2">
                <Button onClick={handleCropCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button onClick={handleCropSave} size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <X className="h-4 w-4 mr-1" />
                  Apply Crop
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                aspect={1}
                minWidth={50}
                minHeight={50}
                className="max-w-full"
              >
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={originalImage || "https://via.placeholder.com/150"}
                  onLoad={onImageLoad}
                  onError={() => {
                    console.error("Failed to load crop preview image");
                    setImageError("Failed to load crop preview image.");
                    setOriginalImage("");
                    setShowCropper(false);
                  }}
                  className="max-w-full max-h-96 object-contain"
                />
              </ReactCrop>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Main Photo</h3>
                  {mainPhoto && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => mainPhotoInputRef.current?.click()}
                      className="p-2"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="relative w-full h-48 bg-gray-100 rounded-lg">
                  {mainPhoto && !imageError ? (
                    <img
                      src={mainPhoto}
                      alt="Main product"
                      className="w-full h-48 object-contain"
                      onError={() => {
                        console.error("Failed to load main photo:", mainPhoto.substring(0, 50) + "...");
                        setImageError("Failed to load main photo.");
                        setMainPhoto("");
                        setFormData((prev) => ({ ...prev, coverImage: "" }));
                      }}
                    />
                  ) : (
                    <div
                      onClick={() => mainPhotoInputRef.current?.click()}
                      className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Click to upload main photo</p>
                      </div>
                    </div>
                  )}

                  <input
                    ref={mainPhotoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleMainPhotoUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Product Information</h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, name: e.target.value }));
                        setFormErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder="Enter product name"
                      className={`mt-1 ${formErrors.name ? "border-red-500" : ""}`}
                      required={!reward}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="coin" className="text-sm font-medium text-gray-700">
                      GlowCoin
                    </Label>
                    <div className="relative mt-1">
                      <Input
                        id="coin"
                        type="number"
                        value={formData.coin}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            coin: Number.parseInt(e.target.value) || 0,
                          }));
                          setFormErrors((prev) => ({ ...prev, coin: undefined }));
                        }}
                        className={`pr-8 ${formErrors.coin ? "border-red-500" : ""}`}
                        required={!reward}
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => adjustCoin(true)}
                          className="p-0 h-3 w-4 hover:bg-gray-100"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => adjustCoin(false)}
                          className="p-0 h-3 w-4 hover:bg-gray-100"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {formErrors.coin && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.coin}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description
                    </Label>
                    <Input
                      id="description"
                      type="text"
                      value={formData.description}
                      onChange={(e) => {
                        setFormData((prev) => ({ ...prev, description: e.target.value }));
                        setFormErrors((prev) => ({ ...prev, description: undefined }));
                      }}
                      placeholder="Enter product description"
                      className={`mt-1 ${formErrors.description ? "border-red-500" : ""}`}
                      required={!reward}
                    />
                    {formErrors.description && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" onClick={handleClose} variant="outline" className="px-6 py-2 bg-transparent">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}