import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { UserWithBadge } from "@/interfaces/auth.interface";
import UserCard from "@/components/ui/user-card";

interface Props {
  slug: string;
  title: string;
  created_at: string;
  voteScore: number;
  answerCount: number;
  tags: { _id: string; name: string; isListed: boolean; created_at: string; edited_at: string }[];
  header_image: string;
  createdBy: UserWithBadge;
}

const QuestionCard: React.FC<Props> = ({
  slug,
  title,
  created_at,
  voteScore,
  answerCount,
  tags,
  header_image,
  createdBy,
}) => {
  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="text-xs text-gray-500 mb-1">
            Posted at • {timeAgo}
          </div>
          <Link to={`/question/${slug}`} className="font-medium mb-2 text-blue-600 hover:underline">
            {title}
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <Badge
                key={tag._id}
                variant="secondary"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                {voteScore} Votes
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                {answerCount} Answers
              </div>
            </div>
            <UserCard user={createdBy} />
          </div>
        </div>
        {header_image?
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={header_image || "/placeholder.svg"}
                alt="Question thumbnail"
                className="object-cover w-full h-full"
              />
          </div>
        :<div></div> }
      </div>
    </div>
  );
};

export default QuestionCard;