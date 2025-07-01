import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuestionForm } from './useQuestionForm';
import { TextField } from './TextField';
import { FileField } from './FileField';
import { MarkdownField } from './MarkdownField';
import { TagsField } from './TagsField';
import { BountyField } from './BountyField';
import { SimilarQuestionsModal } from './SimilarQuestionModal';
import { QuestionFormData } from '@/validations/question/questionSchema';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils'; 
import { Loader2 } from 'lucide-react';

interface QuestionFormProps {
  onSubmit?: (data: QuestionFormData) => Promise<void>;
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
    handleSimilarQuestionsCheck,
    hasCheckedSimilarQuestions,
    noSimilarQuestionsConfirmed,
    setNoSimilarQuestionsConfirmed,
  } = useQuestionForm(onSubmit);

  const [isFileFieldsEnabled, setIsFileFieldsEnabled] = useState(false);
  const [isMarkdownFieldEnabled, setIsMarkdownFieldEnabled] = useState(false);
  const [isTagsFieldEnabled, setIsTagsFieldEnabled] = useState(false);
  const [isBountyFieldEnabled, setIsBountyFieldEnabled] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  const isTitleValid: boolean = !!formData.title && formData.title.length > 0 && !formErrors.title && titleStatus.status === 'available';
  const isProblemDetailsValid: boolean = !!formData.problemDetails && formData.problemDetails.length >= 20 && !formErrors.problemDetails;
  const isTagsValid: boolean = !!formData.tags && formData.tags.length > 0 && !formErrors.tags;
  const isBountyValid: boolean = !formData.isBounty || (formData.isBounty && formData.bountyCoins >= 10 && !formErrors.bountyCoins);

  useEffect(() => {
    setIsFileFieldsEnabled(isTitleValid);
    setIsMarkdownFieldEnabled(isTitleValid);
    setIsTagsFieldEnabled(isTitleValid && isProblemDetailsValid);
    setIsBountyFieldEnabled(isTitleValid && isProblemDetailsValid && isTagsValid);
    setIsSubmitEnabled(isTitleValid && isProblemDetailsValid && isTagsValid && isBountyValid && noSimilarQuestionsConfirmed);
  }, [isTitleValid, isProblemDetailsValid, isTagsValid, isBountyValid, noSimilarQuestionsConfirmed]);

  const progressSteps = [
    { valid: isTitleValid, label: 'Title' },
    { valid: isProblemDetailsValid, label: 'Details' },
    { valid: isTagsValid, label: 'Tags' },
    { valid: isBountyValid, label: 'Bounty' },
    { valid: noSimilarQuestionsConfirmed, label: 'Similar Check' },
  ];
  const completedSteps = progressSteps.filter((step) => step.valid).length;
  const progressPercentage = (completedSteps / progressSteps.length) * 100;

  const handleNoSimilarQuestions = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNoSimilarQuestionsConfirmed(e.target.checked);
  };

  const queryText = `${formData.title || 'No title provided'} ${formData.problemDetails || 'No description provided'}`;

  return (
    <div className="max-w-4xl mx-auto pb-6 space-y-6 px-4 sm:px-0">
      <h1 className="text-3xl font-bold text-gray-900">Ask a Question</h1>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-black h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
        <div className="flex justify-between mt-2 bg-white">
          {progressSteps.map((step, index) => (
            <span
              key={index}
              className={cn(
                "text-sm",
                step.valid ? "text-green-600" : "text-gray-400"
              )}
            >
              {step.valid ? "✓" : "○"} {step.label}
            </span>
          ))}
        </div>
      </div>

      <Card className="border-none shadow-sm bg-gray-50 rounded-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-gray-800">
            How to Ask a Good Question
          </CardTitle>
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

      <Card className="border-none shadow-sm bg-gray-50 rounded-lg">
        <CardContent className="pt-6">
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
                className="transition-opacity duration-200"
              />
              {!formErrors.title && (
                <>
                  {titleStatus.status === 'loading' && (
                    <p className="text-sm text-gray-500">Checking availability...</p>
                  )}
                  {titleStatus.status === 'available' && (
                    <p className="text-sm text-green-500">✓ Title is available</p>
                  )}
                  {titleStatus.status === 'unavailable' && (
                    <p className="text-sm text-red-500">○ Title is not available</p>
                  )}
                  {titleStatus.status === 'error' && (
                    <p className="text-sm text-red-500">{titleStatus.message}</p>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <FileField
                id="image-upload"
                label="Attach Image"
                accept="image/*"
                onChange={handleImageUpload}
                file={formData.image}
                error={formErrors.image}
                isImage
                disabled={!isFileFieldsEnabled}
                className={cn("transition-opacity duration-200", isFileFieldsEnabled ? '' : 'opacity-50')}
              />
              <FileField
                id="document-upload"
                label="Attach Document"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleDocumentUpload}
                file={formData.document}
                error={formErrors.document}
                disabled={!isFileFieldsEnabled}
                className={cn("transition-opacity duration-200", isFileFieldsEnabled ? '' : 'opacity-50')}
              />
            </div>

            <MarkdownField
              label="What are the details of your problem?"
              value={formData.problemDetails}
              onChange={(value) => handleChange('problemDetails', value)}
              error={formErrors.problemDetails}
              description="Introduce the problem and expand on what you put in the title. Minimum 20 characters."
              disabled={!isMarkdownFieldEnabled}
              className={cn("transition-opacity duration-200", isMarkdownFieldEnabled ? '' : 'opacity-50')}
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
              disabled={!isTagsFieldEnabled}
              className={cn("transition-opacity duration-200", isTagsFieldEnabled ? '' : 'opacity-50')}
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
              disabled={!isBountyFieldEnabled}
              className={cn("transition-opacity duration-200", isBountyFieldEnabled ? '' : 'opacity-50')}
            />

            <div className="space-y-6">
              {formData.title.length >= 3 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Review Your Question Before Posting:&nbsp;
                  </label>
                  <button
                    type="button"
                    onClick={handleSimilarQuestionsCheck}
                    disabled={isSubmitting || !isTitleValid}
                    className={cn(
                      "text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors",
                      isTitleValid ? '' : 'opacity-50 cursor-not-allowed'
                    )}
                    aria-label="Check for similar questions"
                  >
                    Check similar questions
                  </button>
                  <p className="text-sm text-gray-500">
                    Ensure your question is unique by checking for similar questions.
                  </p>
                </div>
              )}
              {hasCheckedSimilarQuestions && (
                <div className={cn(
                  "space-y-2 transition-opacity duration-200",
                  isBountyFieldEnabled ? '' : 'opacity-50'
                )}>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={noSimilarQuestionsConfirmed}
                      onChange={handleNoSimilarQuestions}
                      disabled={isSubmitting || !isBountyFieldEnabled}
                      className={cn(
                        "h-4 w-4 rounded border-gray-300 text-black focus:ring-black disabled:opacity-50",
                        isBountyFieldEnabled ? '' : 'cursor-not-allowed'
                      )}
                      aria-label="Confirm no similar questions found"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Do you find any similar questions?
                    </span>
                  </label>
                  <p className="text-sm text-gray-500">
                    Check this box to confirm that no similar questions were found to enable posting.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end items-center gap-4">
              {formErrors.general && (
                <p className="text-sm text-red-500">{formErrors.general}</p>
              )}
              <Button
                type="submit"
                disabled={isSubmitting || !isSubmitEnabled}
                className={cn(
                  "px-8 py-2 bg-black text-white hover:bg-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors",
                  isSubmitEnabled ? '' : 'opacity-50'
                )}
                aria-label={isSubmitting ? "Submitting question" : "Submit question"}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Ask Question'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <SimilarQuestionsModal
        isOpen={isModalOpen}
        text={queryText}
        onClose={() => setIsModalOpen(false)}
        similarQuestions={similarQuestions}
      />
    </div>
  );
}