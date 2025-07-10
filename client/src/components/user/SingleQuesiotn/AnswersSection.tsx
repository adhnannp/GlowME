import { useState, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AnswerList } from './AnswerList';
import { AnswerForm } from './AnswerForm';
import QualityDialog from './QualityDialog';
import { Answer, createAnswer, fetchAnswersByQuestion, reactToAnswer, removeAnswerReaction, canUserAnswer, updateAnswerQuality } from '@/services/user/user.answer.service';
import { toast } from 'react-hot-toast';
import { UserWithBadge } from '@/interfaces/auth.interface';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

interface AnswersSectionProps {
  questionId: string;
  createdBy: UserWithBadge;
}

export default function AnswersSection({ questionId, createdBy }: AnswersSectionProps) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [yourAnswer, setYourAnswer] = useState('');
  const [canAnswer, setCanAnswer] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [showQualityDialog, setShowQualityDialog] = useState(false);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<'good' | 'correct' | null>(null);
  const authUser = useSelector((state: RootState) => state.auth.user);

  const answersPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const canAnswerResponse = await canUserAnswer(questionId);
        setCanAnswer(canAnswerResponse.canAnswer);
        const answersResponse = await fetchAnswersByQuestion(questionId, page, answersPerPage);
        setAnswers(answersResponse.answers);
        setTotalAnswers(answersResponse.total);
      } catch (error) {
        toast.error('Failed to load answers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [questionId, page]);

  const handleVote = async (answerId: string, direction: 'up' | 'down') => {
    try {
      const currentAnswer = answers.find((ans) => ans._id === answerId);
      const reactionType = direction === 'up' ? 'upvote' : 'devote';

      if (currentAnswer?.userReaction === reactionType) {
        await removeAnswerReaction(answerId);
        setAnswers((prev) =>
          prev.map((ans) =>
            ans._id === answerId
              ? {
                  ...ans,
                  voteScore: ans.voteScore + (direction === 'up' ? -1 : 1),
                  userReaction: undefined,
                }
              : ans
          )
        );
      } else {
        await reactToAnswer(answerId, { type: reactionType });
        setAnswers((prev) =>
          prev.map((ans) =>
            ans._id === answerId
              ? {
                  ...ans,
                  voteScore:
                    ans.voteScore +
                    (direction === 'up' ? 1 : -1) +
                    (ans.userReaction === 'upvote' ? -1 : ans.userReaction === 'devote' ? 1 : 0),
                  userReaction: reactionType,
                }
              : ans
          )
        );
      }
      toast.success('Vote recorded successfully');
    } catch (error) {
      toast.error('Failed to record vote');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!yourAnswer.trim() || yourAnswer.trim().length < 10) return;
    setLoading(true);
    try {
      const response = await createAnswer({
        question_id: questionId,
        answer: yourAnswer,
      });
      const rawAnswer = response.answer;
      const enrichedAnswer: Answer = {
        _id: rawAnswer._id,
        answer: rawAnswer.answer,
        quality: rawAnswer.quality ?? 'ordinary',
        user: authUser!,
        voteScore: 0,
        totalReactions: 0,
        userReaction: undefined,
        replyCount: 0,
      };
      setAnswers((prev) => [...prev, enrichedAnswer]);
      setTotalAnswers((prev) => prev + 1);
      setYourAnswer('');
      setCanAnswer(false);
      toast.success('Answer posted successfully');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenQualityDialog = (answerId: string, newQuality: 'good' | 'correct') => {
    setSelectedAnswerId(answerId);
    setSelectedQuality(newQuality);
    setShowQualityDialog(true);
  };

  const handleUpdateQuality = async () => {
    if (!selectedAnswerId || !selectedQuality) return;
    try {
      await updateAnswerQuality(selectedAnswerId, { quality: selectedQuality });
      toast.success('Answer quality updated');
      setAnswers((prev) =>
        prev.map((ans) =>
          ans._id === selectedAnswerId ? { ...ans, quality: selectedQuality } : ans
        )
      );
      setShowQualityDialog(false);
      setSelectedAnswerId(null);
      setSelectedQuality(null);
    } catch (error) {
      console.error('Error updating quality:', error);
      toast.error((error as Error).message || 'Failed to update quality');
    }
  };

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < Math.ceil(totalAnswers / answersPerPage)) setPage((prev) => prev + 1);
  };

  return (
    <TooltipProvider>
      <div className="border-t pt-6">
        <AnswerList
          answers={answers}
          totalAnswers={totalAnswers}
          page={page}
          answersPerPage={answersPerPage}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onVote={handleVote}
          onOpenQualityDialog={handleOpenQualityDialog}
          loading={loading}
          createdBy={createdBy}
        />
        {canAnswer && (
          <AnswerForm
            yourAnswer={yourAnswer}
            setYourAnswer={setYourAnswer}
            onSubmit={handleSubmitAnswer}
            loading={loading}
          />
        )}
        <QualityDialog
          open={showQualityDialog}
          onOpenChange={(open) => {
            setShowQualityDialog(open);
            if (!open) {
              setSelectedAnswerId(null);
              setSelectedQuality(null);
            }
          }}
          selectedQuality={selectedQuality}
          onConfirm={handleUpdateQuality}
          loading={loading}
        />
      </div>
    </TooltipProvider>
  );
}