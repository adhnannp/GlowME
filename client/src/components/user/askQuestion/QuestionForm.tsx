import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuestionForm } from './useQuestionForm';
import { TextField } from './TextField';
import { FileField } from './FileField';
import { MarkdownField } from './MarkdownField';
import { TagsField } from './TagsField';
import { BountyField } from './BountyField';
import { SimilarQuestionsModal } from './SimilarQuestionModal';

interface QuestionFormProps {
  onSubmit?: (data: any) => Promise<void>;
}

export default function QuestionForm({ onSubmit }: QuestionFormProps) {
  const {
    formData,
    formErrors,
    tagInput,
    isSubmitting,
    titleStatus,
    similarQuestions,
    isModalOpen,
    setTagInput,
    setIsModalOpen,
    handleChange,
    handleImageUpload,
    handleDocumentUpload,
    handleSubmit,
    addTag,
    removeTag,
  } = useQuestionForm(onSubmit);

  return (
    <div className="max-w-4xl mx-auto pb-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">How to Ask a Good Question</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Write a clear, specific title that summarizes your question</li>
            <li>Provide detailed information about your problem, including code samples if applicable</li>
            <li>Add relevant tags (up to 5) to categorize your question</li>
            <li>Include one image or one document (PDF, TXT, DOC, DOCX) if it helps clarify the issue</li>
            <li>Check for existing similar questions before posting</li>
            <li>If offering a bounty, set a reasonable coin amount (minimum 10)</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Ask a Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <TextField
                id="title"
                label="Title"
                value={formData.title}
                onChange={(value) => handleChange('title', value)}
                placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                error={formErrors.title}
                description="Be specific and imagine you're asking a question to another person."
              />
              {titleStatus.status === 'loading' && (
                <p className="text-sm text-gray-500">Checking availability...</p>
              )}
              {titleStatus.status === 'available' && (
                <p className="text-sm text-green-500">Title is available</p>
              )}
              {titleStatus.status === 'unavailable' && (
                <p className="text-sm text-red-500">Title is not available</p>
              )}
              {titleStatus.status === 'error' && (
                <p className="text-sm text-red-500">{titleStatus.message}</p>
              )}
              {formData.title.length >= 3 && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Check similar questions
                </button>
              )}
            </div>

            <div className="flex gap-4">
              <FileField
                id="image-upload"
                label="Attach Image"
                accept="image/*"
                onChange={handleImageUpload}
                file={formData.image}
                error={formErrors.image}
                isImage
              />
              <FileField
                id="document-upload"
                label="Attach Document"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleDocumentUpload}
                file={formData.document}
                error={formErrors.document}
              />
            </div>

            <MarkdownField
              label="What are the details of your problem?"
              value={formData.problemDetails}
              onChange={(value) => handleChange('problemDetails', value)}
              error={formErrors.problemDetails}
              description="Introduce the problem and expand on what you put in the title. Minimum 20 characters."
            />

            <TagsField
              label="Tags"
              tags={formData.tags}
              tagInput={tagInput}
              onTagInputChange={setTagInput}
              onAddTag={addTag}
              onRemoveTag={removeTag}
              error={formErrors.tags}
              description="Add up to 5 tags to categorize your question (e.g., mongodb, wordpress, iphone)."
            />

            <BountyField
              isBounty={formData.isBounty}
              bountyCoins={formData.bountyCoins}
              onBountyToggle={(checked) => {
                handleChange('isBounty', checked);
                if (!checked) handleChange('bountyCoins', 0);
              }}
              onBountyCoinsChange={(value) => handleChange('bountyCoins', value)}
              error={formErrors.bountyCoins}
            />

            <div className="flex justify-end">
              {formErrors.general && <p className="text-sm text-red-500 mr-4">{formErrors.general}</p>}
              <Button
                type="submit"
                disabled={isSubmitting || titleStatus.status === 'unavailable'}
                className="px-8 py-2 bg-black text-white hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Asking...' : 'ASK'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <SimilarQuestionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        similarQuestions={similarQuestions}
      />
    </div>
  );
}