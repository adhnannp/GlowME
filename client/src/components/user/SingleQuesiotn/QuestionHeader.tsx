import { Button } from '@/components/ui/button';
import { Question } from '@/interfaces/user.questions.interface';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface QuestionHeaderProps {
  question: Question;
}

export default function QuestionHeader({ question }: QuestionHeaderProps) {
  const navigate = useNavigate(); 

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go back</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <h1 className="text-2xl font-semibold text-gray-900">{question.title}</h1>
        </div>
        <Link to="/ask-question">
          <Button variant="default" className="bg-black text-white hover:bg-gray-600">
            Ask Question
          </Button>
        </Link>
      </div>
      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4 pl-11">
        <span>Asked {new Date(question.created_at).toLocaleDateString()}</span>
        <span>Modified {new Date(question.edited_at).toLocaleDateString()}</span>
        {question.document && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={question.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600 hover:text-blue-800"
                >
                  View Document
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Preview: {decodeURIComponent(question.document.split('/').pop() || "document")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <hr className="border-t border-gray-200" />
    </div>
  );
}