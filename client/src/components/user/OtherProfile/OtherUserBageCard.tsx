import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface Badge {
  _id: string;
  name: string;
  image: string;
  requiredXp: number;
  isListed: boolean;
  created_at: string;
  updated_at: string;
}

interface Props {
  badge: Badge;
  acquired: boolean;
  current: boolean;
}

const OtherUserBadgeCard: React.FC<Props> = ({
  badge,
  acquired,
  current,
}) => {
  const [imageError, setImageError] = useState(false);

  const colorMap: Record<string, string> = {
    Supreme: "from-yellow-500 to-amber-600",
    Master: "from-purple-500 to-violet-600",
    Skilled: "from-cyan-400 to-blue-500",
    Beginner: "from-lime-400 to-green-500",
    Noob: "from-yellow-300 to-amber-400",
  };

  const gradientColor = colorMap[badge.name] || "from-gray-400 to-gray-500";
  const requiredText = acquired ? "" : `${badge.requiredXp} XP required`;

  return (
    <div className={cn(
      "border rounded-md p-4 flex flex-col items-center relative",
    )}>
      <div className="relative mb-3">
        {badge.image && !imageError ? (
          <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
            <img
              src={`${import.meta.env.VITE_BASE_URL}${badge.image}`}
              width={80}
              height={80}
              alt={badge.name}
              className="object-cover w-full h-full rounded-full"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div
            className={cn(
              "w-20 h-20 rounded-full border-2 border-white shadow-md",
              `bg-gradient-to-br ${gradientColor}`
            )}
          />
        )}
      </div>

      <div className="text-center">
        <div className="font-medium text-gray-800">{badge.name}</div>
        
        {!acquired ? (
          <div className="text-sm text-green-600 mt-1 flex items-center justify-center">
            <Trophy className="w-4 h-4 mr-1" />
            {requiredText}
          </div>
        ) : current ? (
          <div className="text-sm text-green-700 flex items-center justify-center mt-1 font-medium">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
            Current
          </div>
        ) : (
          <div className="text-sm text-amber-600 flex items-center justify-center mt-1">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-1"></span>
            Acquired
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherUserBadgeCard;