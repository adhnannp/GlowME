import React from "react";
import {
  ThumbsUp,
  MessageCircle,
} from "lucide-react"

interface props{
  title:string,
  timeAgo:string,
  votes:string,
  comments:string,
  tag:string,
  image:string,
}

const QuestionCard:React.FC<props> = ({ title, timeAgo, votes, comments, tag, image })=> {
    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">• {timeAgo}</div>
            <h3 className="font-medium mb-2">{title}</h3>
            <div className="text-xs text-gray-500">{tag}</div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <ThumbsUp className="h-4 w-4" />
                {votes}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MessageCircle className="h-4 w-4" />
                {comments}
              </div>
            </div>
          </div>
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            <img src={image || "/placeholder.svg"} alt="Question thumbnail" className="object-cover fill" />
          </div>
        </div>
      </div>
    )
}

export default QuestionCard;