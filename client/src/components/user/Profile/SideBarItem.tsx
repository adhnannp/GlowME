import React from "react";

interface props{
    icon:any,
    label:string,
    active:boolean,
    expanded:boolean
}

const SidebarItem:React.FC<props> = ({ icon, label, active = false, expanded = true })=> {
    return (
      <div
        className={`flex items-center ${expanded ? "px-5" : "px-0 justify-center"} py-3 ${active ? "bg-gray-100" : "hover:bg-gray-50"}`}
      >
        <div className="text-gray-600">{icon}</div>
        {expanded && <span className={`ml-3 ${active ? "font-medium" : ""}`}>{label}</span>}
      </div>
    )
}

export default SidebarItem