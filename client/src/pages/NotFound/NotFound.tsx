import React from "react";

const BreadIllustration: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        className="w-64 h-64 text-yellow-500"
      >
        <path
          fill="currentColor"
          d="M512 128c-141.4 0-256 93.1-256 208 0 40.7 16.2 78.9 44.1 110H224c-61.9 0-112 50.1-112 112v208c0 61.9 50.1 112 112 112h576c61.9 0 112-50.1 112-112V558c0-61.9-50.1-112-112-112h-76.1c27.9-31.1 44.1-69.3 44.1-110 0-114.9-114.6-208-256-208z"
        />
      </svg>
    </div>
  );
};

export default BreadIllustration;