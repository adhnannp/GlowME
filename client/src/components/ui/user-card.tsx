import React from "react";
import { Link } from "react-router-dom";
import { UserWithBadge } from "@/interfaces/auth.interface";
import { Trophy } from "lucide-react";

interface UserProps {
  user: UserWithBadge;
}

const UserCard: React.FC<UserProps> = ({ user }) => {
  return (
    <Link to={`/user/${user._id}`} >
      <div className="hover:bg-gray-50 transition-colors border rounded-md p-2 min-w-[120px]">
        <div className="flex items-start gap-2">
          <img
            src={user.profile_image || "/browserIcons/person_icon.png"}
            alt={`${user.username}'s avatar`}
            className="rounded-full flex-shrink-0 object-cover w-6 h-6"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 mb-1">
              <span className="font-medium truncate text-sm ">{user.username}</span>
              {user?.currentBadge?.image && (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${user.currentBadge.image}`}
                  alt="Badge"
                  className="w-3 h-3 flex-shrink-0"
                />
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <Trophy className="h-3 w-3 text-green-500" />
                <span>{user.xp}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}


export default UserCard;