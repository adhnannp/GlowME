import React, { useState, useEffect } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateUser } from "@/feature/authSlice";
import { changePassword, checkUserHasPassword } from "@/services/user/user.changePassword.service";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .nonempty("Password is required"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .nonempty("Password is required"),
    currentPassword: z.string().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password cannot be the same as old password",
    path: ["newPassword"],
  });

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [hasPassword, setHasPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [checkingPasswordStatus, setCheckingPasswordStatus] = useState(true);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  useEffect(() => {
    if (open) {
      setCheckingPasswordStatus(true);
      checkUserHasPassword()
        .then((result) => {
          setHasPassword(result.hasPassword);
        })
        .catch((error) => {
          console.error("Error checking password status:", error);
        })
        .finally(() => {
          setCheckingPasswordStatus(false);
        });
    }
  }, [open]);

  const handleSubmit = async () => {
    setErrors({});

    const validationData = hasPassword
      ? { currentPassword, newPassword, confirmPassword }
      : { newPassword, confirmPassword };

    if (hasPassword && !currentPassword) {
      setErrors((prev) => ({ ...prev, currentPassword: "Current password is required" }));
      return;
    }

    const validationResult = passwordSchema.safeParse(validationData);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      setErrors({
        currentPassword: fieldErrors.currentPassword?.[0],
        newPassword: fieldErrors.newPassword?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        googleUser: !hasPassword,
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
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setErrors({});
    setHasPassword(true);
    onClose();
  };

  if (checkingPasswordStatus) {
    {console.log('')};
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{hasPassword ? "Change Password" : "Set Password"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {!hasPassword && (
            <p className="text-sm text-gray-600">
              You signed in with Google and or don't have a password. Please set a new password.
            </p>
          )}
          {hasPassword && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.currentPassword ? "border-red-500" : ""
                  }`}
                  aria-label="Current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.currentPassword}</p>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                errors.newPassword ? "border-red-500" : ""
              }`}
              aria-label="New password"
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.newPassword}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
              aria-label="Confirm password"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                loading ||
                !newPassword ||
                !confirmPassword ||
                (hasPassword && !currentPassword)
              }
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;