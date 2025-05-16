import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

export default function QuestionsReport() {
  const [reportedQuestions] = useState<ReportedItem[]>([
    {
      id: 1,
      user: {
        name: "Adhnan P",
        email: "XP 3000",
        avatar: "/placeholder.svg?height=40&width=40",
        xp: "XP 3000",
      },
      content: "The full Executive Order is out! ⚠️ This is the biggest executive",
      votes: 3,
      tags: ["tag"],
    },
    {
      id: 2,
      user: {
        name: "Adhnan P",
        email: "XP 3000",
        avatar: "/placeholder.svg?height=40&width=40",
        xp: "XP 3000",
      },
      content: "The full Executive Order is out! ⚠️ This is the biggest executive",
      votes: 3,
      tags: ["tag"],
    },
    {
      id: 3,
      user: {
        name: "Adhnan P",
        email: "XP 3000",
        avatar: "/placeholder.svg?height=40&width=40",
        xp: "XP 3000",
      },
      content: "The full Executive Order is out! ⚠️ This is the biggest executive",
      votes: 3,
      tags: ["tag"],
    },
  ]);

  return (
    <div className="space-y-4">
      {reportedQuestions.map((item) => (
        <ReportedQuestionCard key={item.id} item={item} />
      ))}
    </div>
  );
}

function ReportedQuestionCard({ item }: { item: ReportedItem }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">{item.content}</h3>
        {item.tags?.map((tag, index) => (
          <Badge key={index} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
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