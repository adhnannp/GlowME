import { Button } from '@/components/ui/button';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';

interface AnswerFormProps {
  yourAnswer: string;
  setYourAnswer: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function AnswerForm({ yourAnswer, setYourAnswer, onSubmit, loading }: AnswerFormProps) {
  return (
    <div className="border-t pt-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
      <div className="mb-4" data-color-mode="light">
        <MDEditor
          value={yourAnswer}
          onChange={(val: string) => setYourAnswer(val || '')}
          preview="edit"
          hideToolbar={false}
          textareaProps={{
            placeholder:
              'Write your answer in Markdown...\n\nYou can use:\n- **bold** and *italic* text\n- `code` blocks\n- Lists and tables\n- Links and images',
            style: { fontSize: 14, lineHeight: 1.6, minHeight: 200 },
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <Button
          className="bg-black hover:bg-gray-700 text-white"
          onClick={onSubmit}
          disabled={loading || !yourAnswer.trim() || yourAnswer.trim().length < 10}
        >
          {loading ? 'Posting...' : 'Post Your Answer'}
        </Button>
        <div className="flex items-center space-x-4 text-sm text-gray-500"></div>
      </div>
    </div>
  );
}