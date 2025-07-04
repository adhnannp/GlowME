import { useState } from 'react';
import { ArrowUp, ArrowDown, Bookmark, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/interfaces/user.questions.interface';
import MDEditor from '@uiw/react-md-editor';
import UserCard from '@/components/ui/user-card';

interface QuestionContentProps {
  question: Question;
}

export default function QuestionContent({ question }: QuestionContentProps) {
  const [votes, setVotes] = useState(18);

  const handleVote = (direction: 'up' | 'down') => {
    setVotes((prev) => (direction === 'up' ? prev + 1 : prev - 1));
  };

  return (
    <div className="flex gap-4 mb-8">
      <div className="flex flex-col items-center space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleVote('up')}
          className="p-1 hover:bg-gray-100"
        >
          <ArrowUp className="w-6 h-6" />
        </Button>
        <span className="text-xl font-semibold">{votes}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleVote('down')}
          className="p-1 hover:bg-gray-100"
        >
          <ArrowDown className="w-6 h-6" />
        </Button>
        <Button variant="ghost" size="sm" className="p-1">
          <Bookmark className="w-5 h-5" />
        </Button>
      </div>
      <div className="flex-1">
        <div className="mb-4 flex items-center justify-center">
          <img src={question.header_image} alt="" />
        </div>
        <MDEditor.Markdown 
          source={question.description} 
          style={{ 
            whiteSpace: 'pre-wrap', 
            backgroundColor: '#ffffff',
            color: '#000000',
          }} 
        />
        <div className="flex space-x-2 mb-4 mt-2">
          {question.tags?.map((tag) => (
            <Badge key={tag._id} variant="secondary">
              {tag.name}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
           <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          </div>
           <UserCard user={question.createdBy} />
        </div>
      </div>
    </div>
  );
}