import React from "react";
interface props{
    title:string, 
    imageUrl:string, 
    color:string, 
    required:string, 
    requiredColor:string, 
    acquired:boolean, 
    current: boolean
}

const BadgeCard:React.FC<props> = ({ title, imageUrl, color, required, requiredColor, acquired = false, current = false }) => {
    return (
      <div className="border rounded-md p-4 flex flex-col items-center">
        <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
          <img src={imageUrl || "/placeholder.svg"} width={50} height={50} alt={title} className="opacity-0" />
        </div>
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
    )
  }
  
  
export default BadgeCard;  