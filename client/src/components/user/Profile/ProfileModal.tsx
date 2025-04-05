import { useRef, useEffect } from "react";
import { LogOut, Coins, Brain, Trophy } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/feature/authThunks";
import { AppDispatch } from "@/store/store";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  profileImage: string;
}

export function ProfileModal({isOpen,onClose,user,profileImage,}: ProfileModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  function logOut(){
    dispatch(logout());
  }

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-16 right-3 z-50 w-72 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
      ref={modalRef}
    >
      <div className="relative p-4">
        <button
          onClick={logOut}
          className="absolute top-2 right-2 flex items-center gap-1 text-gray-800 hover:bg-gray-100"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Logout</span>
        </button>

        <div className="flex flex-col items-center mb-4">
          <img
            src={profileImage || "/placeholder.svg"}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover mb-2"
          />
          <div className="flex items-center gap-2 mt-1">
            <img
                src="/badges/level 1.png"
                alt="Level 1 Badge"
                className="h-10 w-10"
            />
            <span className="text-sm font-medium text-gray-700">
                {user?.username || "user name"}
            </span>
          </div>
        </div>

        <div className="flex justify-between mb-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center text-yellow-500">
              <Coins className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Coins</span>
            </div>
            <span className="font-semibold">{user?.coins || 0}</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center text-blue-500">
              <Brain className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">QE</span>
            </div>
            <span className="font-semibold">
              {user?.questions_explored || 0}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center text-green-500">
              <Trophy className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">XP</span>
            </div>
            <span className="font-semibold">{user?.xp || 0}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Level Progress</span>
            <span className="text-sm font-medium">1%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-black h-2.5 rounded-full"
              style={{ width: "1%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
