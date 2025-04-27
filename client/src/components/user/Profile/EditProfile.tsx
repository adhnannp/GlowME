import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "react-hot-toast";
import { updateUser } from "@/feature/authSlice";
import UserImageCropper from "./UserImageCropper";
import { updateUserProfile } from "@/services/user/user.editProfile.service";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ open, onClose }: EditProfileModalProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [username, setUsername] = useState(user?.username || "");
  const [image, setImage] = useState<string | null>(null);
  const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (!allowedTypes.includes(file.type)) {
        setFileError("Only JPG, JPEG, or PNG files are allowed.");
        e.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setFileError("Image size should not exceed 5MB.");
        e.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImageFile: File) => {
    setCroppedImageFile(croppedImageFile);
    setShowCropper(false);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await updateUserProfile({
        username,
        profile_image: croppedImageFile,
      });

      dispatch(updateUser(updatedUser));
      handleClose();
    } catch (error) {
      console.debug("Caught error in handleSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUsername(user?.username || "");
    setFileError(null);
    setImage(null);
    setCroppedImageFile(null);
    setShowCropper(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Profile</span>
          </DialogTitle>
        </DialogHeader>

        {showCropper && image ? (
          <UserImageCropper
            image={image}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img
                  src={
                    croppedImageFile
                      ? URL.createObjectURL(croppedImageFile)
                      : user?.profile_image || "/browserIcons/person_icon.png"
                  }
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
                <input
                  type="file"
                  id="profile-image-upload"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                />
                <label
                  htmlFor="profile-image-upload"
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100"
                  aria-label="Upload profile image"
                >
                  <ImagePlus className="h-5 w-5 text-gray-700" />
                </label>
              </div>
              {fileError && <p className="text-sm text-red-500 mt-2">{fileError}</p>}
              {croppedImageFile && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setShowCropper(true)}
                >
                  Re-crop Image
                </Button>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClose} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading || !username}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;