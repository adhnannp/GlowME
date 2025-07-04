import { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';

interface Answer {
  id: string;
  content: string;
  votes: number;
  isAccepted: boolean;
  author: {
    username: string;
    xp: number;
  };
}

interface AnswersSectionProps {
  questionId: string;
}

export default function AnswersSection({ questionId }: AnswersSectionProps) {
  const [votes, setVotes] = useState({ answer1: 4, answer2: 1 });
  const [yourAnswer, setYourAnswer] = useState('');

  const handleVote = (answerId: string, direction: 'up' | 'down') => {
    setVotes((prev) => ({
      ...prev,
      [answerId]: direction === 'up' ? prev[answerId as keyof typeof prev] + 1 : prev[answerId as keyof typeof prev] - 1,
    }));
  };

  const answers: Answer[] = [
    {
      id: 'answer1',
      content: `**As you've marked out**, \`final\` - no other class can extend \`final\`.

**As you've marked again**, \`non-sealed\` - any class can extend \`sealed\`.

When marking a class as \`sealed\` - all directly extending classes the ones after the \`permits\` - keyword have to be marked either as \`final\` - \`sealed\` - or \`non-sealed\`.

Marking a class that extends a \`sealed\` - class as \`sealed\` - opens the same effect as 1. Only classes specified after the \`permits\` - clause are allowed to extend it.

Marking a class that extends a \`sealed\` - class as \`final\` - stops the inheritance hierarchy. The extending class is open sealed by being extended by unknown subclasses itself.

Marking a class that extends a \`sealed\` - class as \`non-sealed\` - without any control - classes. Hence that specifying nothing after \`permits\` - is not possible, so \`sealed\` - cannot replace \`final\`.

### Example Code

\`\`\`java
public final class Cat implements Animal {
    @Override
    public void makeSound() {
        System.out.println("Meow");
    }
}
\`\`\``,
      votes: votes.answer1,
      isAccepted: true,
      author: { username: 'Adham P', xp: 3000 },
    },
    {
      id: 'answer2',
      content: `**Final and non-sealed classes have some differences:**

- **Final class**: you can't inherit this class, it's impossible to extend this class to other class as the other hand.
- **non-sealed class**: it's possible to inherit this class from others.

For example, this sealed interface which interface may permitted for Cat & Duck class. Note that Cat & Duck must be final, non-sealed, or sealed class.
`,
      votes: votes.answer2,
      isAccepted: false,
      author: { username: 'Adham P', xp: 3000 },
    },
  ];

  return (
    <div className="border-t pt-6">
      <h2 className="text-xl font-semibold mb-4">{answers.length} Answers</h2>
      {answers.map((answer) => (
        <div key={answer.id} className="flex gap-4 mb-8 pb-8 border-b">
          <div className="flex flex-col items-center space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote(answer.id, 'up')}
              className="p-1 hover:bg-gray-100"
            >
              <ArrowUp className="w-6 h-6" />
            </Button>
            <span className="text-xl font-semibold">{answer.votes}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote(answer.id, 'down')}
              className="p-1 hover:bg-gray-100"
            >
              <ArrowDown className="w-6 h-6" />
            </Button>
            {answer.isAccepted && (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="prose max-w-none" data-color-mode="light">
              <MDEditor.Markdown source={answer.content} style={{ whiteSpace: 'pre-wrap' }} />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">
                  Share
                </Button>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  Follow
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-blue-500 text-white text-xs">
                    {answer.author.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{answer.author.username}</div>
                  <div className="text-gray-500">XP {answer.author.xp}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
        <div className="mb-4" data-color-mode="light">
          <MDEditor
            value={yourAnswer}
            onChange={(val:string) => setYourAnswer(val || '')}
            preview="edit"
            hideToolbar={false}
            visibleDragBar={false}
            textareaProps={{
              placeholder:
                'Write your answer in Markdown...\n\nYou can use:\n- **bold** and *italic* text\n- `code` blocks\n- Lists and tables\n- Links and images',
              style: { fontSize: 14, lineHeight: 1.6, minHeight: 200 },
            }}
          />
        </div>
        <div className="flex items-center justify-between">
          <Button className="bg-black hover:bg-gray-700 text-white" disabled={!yourAnswer.trim()}>
            Post Your Answer
          </Button>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
          </div>
        </div>
      </div>
    </div>
  );
}