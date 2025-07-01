import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimilarQuestion } from '@/interfaces/user.questions.interface';

interface SimilarQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  similarQuestions: SimilarQuestion[];
  text: string;
}

export function SimilarQuestionsModal({ isOpen, onClose, similarQuestions }: SimilarQuestionsModalProps) {
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Similar Questions</DialogTitle>
        </DialogHeader>
        <div className="py-4 flex-1 overflow-y-auto">
          {similarQuestions.length === 0 ? (
            <p className="text-gray-600">No similar questions found.</p>
          ) : (
            <div className="space-y-4">
              {similarQuestions.map((question) => (
                <Card key={question.id} className="border">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">
                      <a
                        href={`/question/${question.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {truncateText(question.title, 50)}
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {truncateText(question.description, 100)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}