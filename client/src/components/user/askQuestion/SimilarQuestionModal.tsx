import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface SimilarQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  similarQuestions: { id: string; title: string; url: string }[];
}

export function SimilarQuestionsModal({ isOpen, onClose, similarQuestions }: SimilarQuestionsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Similar Questions</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {similarQuestions.length === 0 ? (
            <p className="text-gray-600">No similar questions found.</p>
          ) : (
            <ul className="list-disc pl-5 space-y-2">
              {similarQuestions.map((question) => (
                <li key={question.id}>
                  <a
                    href={question.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {question.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}