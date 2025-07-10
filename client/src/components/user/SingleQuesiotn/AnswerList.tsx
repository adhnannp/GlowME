import { Button } from '@/components/ui/button';
import { AnswerItem } from './AnswerItem';
import { UserWithBadge } from '@/interfaces/auth.interface';
import { Answer } from '@/services/user/user.answer.service';

interface AnswerListProps {
  answers: Answer[];
  totalAnswers: number;
  page: number;
  answersPerPage: number;
  onPrevious: () => void;
  onNext: () => void;
  onVote: (answerId: string, direction: 'up' | 'down') => void;
  onOpenQualityDialog: (answerId: string, quality: 'good' | 'correct') => void;
  loading: boolean;
  createdBy: UserWithBadge;
}

export function AnswerList({
  answers,
  totalAnswers,
  page,
  answersPerPage,
  onPrevious,
  onNext,
  onVote,
  onOpenQualityDialog,
  loading,
  createdBy,
}: AnswerListProps) {
  const totalPages = Math.ceil(totalAnswers / answersPerPage);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">{totalAnswers} Answers</h2>
      {loading && <div>Loading answers...</div>}
      {!loading && answers.length === 0 && <div>No answers yet</div>}
      {answers.map((answer) => (
        <AnswerItem
          key={answer._id}
          answer={answer}
          onVote={onVote}
          onOpenQualityDialog={onOpenQualityDialog}
          loading={loading}
          createdBy={createdBy}
        />
      ))}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button onClick={onPrevious} disabled={page === 1} variant="outline">
            Previous
          </Button>
          <span className="px-4 py-2 text-sm font-medium">{page}</span>
          <Button onClick={onNext} disabled={page === totalPages} variant="outline">
            Next
          </Button>
        </div>
      )}
    </>
  );
}