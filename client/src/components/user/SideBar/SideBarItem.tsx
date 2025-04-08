import React from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  expanded?: boolean;
  onClick?: () => void;
  className?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  expanded = true,
  onClick,
  className,
}) => {
  return (
    <div
      className={`flex items-center ${
        expanded ? "px-5" : "px-0 justify-center"
      } py-3 ${active ? "bg-gray-200" : "hover:bg-gray-100"} ${className || ""}`}
      onClick={onClick}
    >
      <div className="text-gray-600">{icon}</div>
      {expanded && (
        <span className={`ml-3 ${active ? "font-medium" : ""}`}>{label}</span>
      )}
    </div>
  );
};

export default SidebarItem;