import React from "react";
import { toast, Toast } from "react-hot-toast";
import { ConnectionNotification } from "@/interfaces/notification"; 

interface Props {
  t: Toast;
  notification: ConnectionNotification;
}

const NotificationToast: React.FC<Props> = ({ t, notification }) => {
  const sender = notification.related_user;
  const senderName = sender?.username ?? "Unknown";
  const avatarUrl = sender?.profile_image || "/browserIcons/person_icon.png";

  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex border border-gray-200`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <img
              className="h-10 w-10 rounded-full"
              src={avatarUrl}
              alt={senderName}
            />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{senderName}</p>
            <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-gray-200 rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-black cursor-pointer hover:border-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
