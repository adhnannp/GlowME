import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReportedItem {
  id: number;
  user: {
    name: string;
    email: string;
    avatar: string;
    xp: string;
  };
  content: string;
  stats?: {
    coins: number;
    qe: number;
  };
  votes: number;
  tags?: string[];
}

export default function AnswersReport() {
  const [reportedAnswers] = useState<ReportedItem[]>([
    {
      id: 1,
      user: {
        name: "Adhnan P",
        email: "XP 3000",
        avatar: "/placeholder.svg?height=40&width=40",
        xp: "XP 3000",
      },
      content: "This is a simple answe headding only or simple first line or some thing like that a",
      votes: 3,
    },
    {
      id: 2,
      user: {
        name: "Adhnan P",
        email: "XP 3000",
        avatar: "/placeholder.svg?height=40&width=40",
        xp: "XP 3000",
      },
      content: "This is a simple answe headding only or simple first line or some thing like that a",
      votes: 3,
    },
  ]);

  return (
    <div className="space-y-4">
      {reportedAnswers.map((item) => (
        <ReportedAnswerCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function ReportedAnswerCard({ item }: { item: ReportedItem }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-3">{item.content}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={item.user.avatar} />
            <AvatarFallback>{item.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="text-sm text-gray-500">{item.user.xp}</div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span className="text-sm">{item.votes}</span>
          </div>
          <Button variant="secondary" size="sm">
            Unlist
          </Button>
        </div>
      </div>
    </div>
  );
}