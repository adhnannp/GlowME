import { useState } from 'react';
import { ArrowUp, ArrowDown, Share2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Question } from '@/interfaces/user.questions.interface';
import MDEditor from '@uiw/react-md-editor';
import UserCard from '@/components/ui/user-card';
import { IAnswer } from '@/interfaces/user.answer.interface';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface QuestionContentProps {
  question: Question;
  userReaction: 'upvote' | 'devote' | null;
  totalVotes: number;
  correctAnswer?: IAnswer;
  onReact: (type: 'upvote' | 'devote') => void;
}


export default function QuestionContent({ question, userReaction, totalVotes, correctAnswer, onReact }: QuestionContentProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex gap-4 mb-8">
      <div className="flex flex-col items-center space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReact('upvote')}
          className="p-1 hover:bg-gray-100"
        >
          <ArrowUp className={`w-6 h-6 ${userReaction === 'upvote' ? 'text-blue-500' : ''}`} />
        </Button>
        <span className="text-xl font-semibold">{totalVotes}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onReact('devote')}
          className="p-1 hover:bg-gray-100"
        >
          <ArrowDown className={`w-6 h-6 ${userReaction === 'devote' ? 'text-red-500' : ''}`} />
        </Button>

        {/* <Button variant="ghost" size="sm" className="p-1">
          <Bookmark className="w-5 h-5" />
        </Button> */}

        {correctAnswer && (
          <Button
            variant="ghost"
            size="sm"
            className="p-1 text-green-600"
            onClick={() => setShowModal(true)}
            title="View correct answer"
          >
            <CheckCircle className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="flex-1">
        <div className="mb-4 flex items-center justify-center ">
          <img src={question.header_image} alt="" />
        </div>
         <div className="prose max-w-none" data-color-mode="light">
            <MDEditor.Markdown 
              source={question.description} 
              style={{ 
                whiteSpace: 'pre-wrap', 
              }} 
            />
        </div>
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

      {showModal && correctAnswer && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-green-600">Correct Answer</DialogTitle>
          </DialogHeader>
          <div data-color-mode="light">
            <MDEditor.Markdown
              source={correctAnswer?.answer}
              style={{ whiteSpace: 'pre-wrap' }}
            />
          </div>
          <DialogClose asChild>
            <Button variant="ghost" className="mt-4">Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      )}
    </div>
  );
}
