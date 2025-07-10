import { ArrowUp, ArrowDown, MoreVertical, CheckCircle2, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import MDEditor from '@uiw/react-md-editor';
import UserCard from '@/components/ui/user-card';
import { UserWithBadge } from '@/interfaces/auth.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Answer } from '@/services/user/user.answer.service';

interface AnswerItemProps {
  answer: Answer;
  onVote: (answerId: string, direction: 'up' | 'down') => void;
  onOpenQualityDialog: (answerId: string, quality: 'good' | 'correct') => void;
  loading: boolean;
  createdBy: UserWithBadge;
}

export function AnswerItem({ answer, onVote, onOpenQualityDialog, loading, createdBy }: AnswerItemProps) {
  const authUser = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex gap-4 mb-8 pb-8 border-b">
      <div className="flex flex-col items-center space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onVote(answer._id, 'up')}
          className="p-1 hover:bg-gray-100"
          disabled={loading}
        >
          <ArrowUp className={`w-6 h-6 ${answer.userReaction === 'upvote' ? 'text-blue-500' : ''}`} />
        </Button>
        <span className="text-xl font-semibold">{answer.voteScore}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onVote(answer._id, 'down')}
          className="p-1 hover:bg-gray-100"
          disabled={loading}
        >
          <ArrowDown className={`w-6 h-6 ${answer.userReaction === 'devote' ? 'text-red-500' : ''}`} />
        </Button>
        {answer.quality !== 'ordinary' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center">
                {answer.quality === 'correct' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <ThumbsUp className="w-5 h-5 text-yellow-500" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {answer.quality === 'correct'
                ? 'This answer is marked as the correct solution'
                : 'This answer is marked as good but not the final solution'}
            </TooltipContent>
          </Tooltip>
        )}
        {createdBy._id === authUser?._id && answer.quality !== 'correct' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {answer.quality === 'ordinary' && (
                <>
                  <DropdownMenuItem onClick={() => onOpenQualityDialog(answer._id, 'good')}>
                    Mark as Good
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onOpenQualityDialog(answer._id, 'correct')}>
                    Mark as Correct
                  </DropdownMenuItem>
                </>
              )}
              {answer.quality === 'good' && (
                <DropdownMenuItem onClick={() => onOpenQualityDialog(answer._id, 'correct')}>
                  Upgrade to Correct
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className="flex-1">
        <div className="prose max-w-none" data-color-mode="light">
          <MDEditor.Markdown source={answer.answer} style={{ whiteSpace: 'pre-wrap' }} />
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm">Share</Button>
          </div>
          <div className="flex items-center space-x-2">
            <UserCard user={answer.user} />
          </div>
        </div>
      </div>
    </div>
  );
}