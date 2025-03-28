import React, { useState } from "react";

interface Props {
  title: string;
  imageUrl: string;
  color: string;
  required: string;
  requiredColor: string;
  acquired: boolean;
  current: boolean;
}

const BadgeCard: React.FC<Props> = ({
  title,
  imageUrl,
  color,
  required,
  requiredColor,
  acquired = false,
  current = false,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="border rounded-md p-4 flex flex-col items-center">
      {imageUrl && !imageError ? (
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-2 overflow-hidden">
          <img
            src={imageUrl}
            width={80}
            height={80}
            alt={title}
            className="object-cover w-full h-full rounded-full"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        // If image fails to load, show gradient background
        <div
          className={`w-20 h-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-2`}
        >
        </div>
      )}

      <div className="text-center">
        <div className="font-medium">{title}</div>
        {required && <div className={`text-sm ${requiredColor}`}>{required}</div>}
        {acquired && (
          <div className="text-sm text-amber-500 flex items-center justify-center mt-1">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-1"></span>
            Acquired
          </div>
        )}
        {current && (
          <div className="text-sm flex items-center justify-center mt-1">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
            Current
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;
