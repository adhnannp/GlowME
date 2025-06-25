import React from "react";

interface props{
    children:string;
    onClick?: () => void;
    active:boolean;
}

const TabButton:React.FC<props> = ({ children, onClick , active = false })=> {
    return (
      <button
        className={`px-4 py-2 font-medium text-sm ${
          active ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-900"
        }`}
        onClick={onClick}
      >
        {children}
      </button>
    )
}

export default TabButton;