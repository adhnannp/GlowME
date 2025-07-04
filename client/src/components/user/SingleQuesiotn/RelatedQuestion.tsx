import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { fetchRelatedQuestions } from '@/services/user/user.listQuestion.service';
import { SimilarQuestion } from '@/interfaces/user.questions.interface';
interface RelatedQuestionsProps {
  questionId: string;
}

export default function RelatedQuestions({ questionId }: RelatedQuestionsProps) {
  const [relatedQuestions, setRelatedQuestions] = useState<SimilarQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRelatedQuestions = async () => {
      try {
        const questions = await fetchRelatedQuestions(questionId);
        setRelatedQuestions(questions);
        setError(null);
      } catch (err) {
        setError('No related questions found');
        setRelatedQuestions([]);
      }
    };

    loadRelatedQuestions();
  }, [questionId]);

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Related Questions</h3>
        {error ? (
          <p className="text-sm text-gray-500">{error}</p>
        ) : relatedQuestions.length === 0 ? (
          <p className="text-sm text-gray-500">No related questions found</p>
        ) : (
          <div className="space-y-3">
            {relatedQuestions.map((question) => (
              <div key={question.id} className="flex items-start space-x-2">
                <Link
                  to={`/question/${question.slug}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {question.title}
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}