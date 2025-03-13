import React from "react"

const CommunityItem:React.FC = ()=> {
    return (
      <div className="border rounded-md p-3 flex items-center">
        <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center mr-2 text-xs">G</div>
        <span className="text-blue-500">greate stack</span>
      </div>
    )
}

export default CommunityItem;