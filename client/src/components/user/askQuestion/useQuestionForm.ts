import { useState, useEffect } from 'react';
import { baseQuestionFormSchema, questionFormSchema, QuestionFormData } from '../../../validations/question/questionSchema';
import { useDebounce } from '@/components/customHooks/useDebounce';
import { checkTitleAvailability, fetchSimilarQuestions } from '@/services/user/user.AddQuestion.service';
import toast from 'react-hot-toast';
import { SimilarQuestion } from '@/interfaces/user.questions.interface';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export function useQuestionForm(onSubmit?: (data: QuestionFormData) => Promise<void>) {
  const [formData, setFormData] = useState<QuestionFormData>({
    title: '',
    problemDetails: '',
    tags: [],
    isBounty: false,
    bountyCoins: 0,
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof QuestionFormData | 'general', string>>>({});
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleStatus, setTitleStatus] = useState<{ status: 'idle' | 'loading' | 'available' | 'unavailable' | 'error'; message?: string }>({
    status: 'idle',
  });
  const [similarQuestions, setSimilarQuestions] = useState<SimilarQuestion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);
  const userCoins = user?.coin_balance ?? 0;

  const debouncedTitle = useDebounce(formData.title, 500);

  useEffect(() => {
    if (debouncedTitle.length < 10) {
      setTitleStatus({ status: 'idle' });
      return;
    }

    const checkTitle = async () => {
      try {
        const response = await checkTitleAvailability(debouncedTitle);
        setTitleStatus({
          status: response.isAvailable ? 'available' : 'unavailable',
          message: response.message,
        });
      } catch (error) {
        setTitleStatus({ status: 'error', message: 'Title check failed. Please try again.' });
      }
    };

    setTitleStatus({ status: 'loading' });
    checkTitle();
  }, [debouncedTitle]);

  const validateField = (field: keyof QuestionFormData, value: any) => {
    const result = baseQuestionFormSchema.shape[field].safeParse(value);
    setFormErrors((prev) => ({
      ...prev,
      [field]: result.success ? undefined : result.error.errors[0]?.message,
    }));

    if (field === 'isBounty' || field === 'bountyCoins') {
      const fullResult = questionFormSchema.safeParse({ ...formData, [field]: value });
      let bountyError: string | undefined;

      if (field === 'isBounty' && value && userCoins < 10) {
        bountyError = 'You need at least 10 coins to set a bounty.';
        toast.error(bountyError);
      } else if (field === 'bountyCoins' && value > userCoins) {
        bountyError = `You only have ${userCoins} coins available.`;
        toast.error(bountyError);
      } else {
        bountyError = fullResult.success
          ? undefined
          : fullResult.error.errors.find((err) => err.path[0] === 'bountyCoins')?.message;
      }

      setFormErrors((prev) => ({
        ...prev,
        bountyCoins: bountyError,
      }));
    }
  };

  const handleChange = <K extends keyof QuestionFormData>(field: K, value: QuestionFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; 
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setFormErrors((prev) => ({ ...prev, image: 'Only PNG, JPG, or JPEG files are allowed' }));
        return;
      }
      setFormErrors((prev) => ({ ...prev, image: undefined })); 
      handleChange('image', file);
    } else {
      setFormErrors((prev) => ({ ...prev, image: undefined })); 
      handleChange('image', null);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(file.type)) {
        setFormErrors((prev) => ({ ...prev, document: 'Only PDF, TXT, DOC, or DOCX files are allowed' }));
        return;
      }
      setFormErrors((prev) => ({ ...prev, document: undefined }));
      handleChange('document', file);
    } else {
      setFormErrors((prev) => ({ ...prev, document: undefined }));
      handleChange('document', null);
    }
  };

  const addTag = (tagId: string) => {
    if (tagId && !formData.tags.includes(tagId) && formData.tags.length < 5) {
      const newTags = [...formData.tags, tagId];
      handleChange('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = formData.tags.filter((tag) => tag !== tagToRemove);
    handleChange('tags', newTags);
  };

  const handleSimilarQuestionsCheck = async () => {
    setHasCheckedSimilarQuestions(true);
    setIsModalOpen(true);

    try {
      const queryText = `${formData.title } ${formData.problemDetails}`;
      const response = await fetchSimilarQuestions(queryText);
      setSimilarQuestions(response.similarQuestions);
    } catch (error) {
      setSimilarQuestions([]);
      console.error('Fetching similar questions failed:', error);
      toast.error('Failed to fetch similar questions. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (titleStatus.status === 'unavailable') {
      setFormErrors((prev) => ({ ...prev, title: 'Title is already taken' }));
      return;
    }
    setIsSubmitting(true);
    setFormErrors({});

    const result = questionFormSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Partial<Record<keyof QuestionFormData | 'general', string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof QuestionFormData | 'general';
        newErrors[field] = err.message;
      });
      setFormErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit?.(result.data);
      toast.success('Question posted successfully');
      setFormData({
        title: '',
        problemDetails: '',
        tags: [],
        isBounty: false,
        bountyCoins: 0,
      });
      setTagInput('');
      setTitleStatus({ status: 'idle' });
      setSimilarQuestions([]);
      setHasCheckedSimilarQuestions(false);
      setNoSimilarQuestionsConfirmed(false);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
      console.error('Error submitting question:', error);
      setFormErrors({ general: 'Failed to post question. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [hasCheckedSimilarQuestions, setHasCheckedSimilarQuestions] = useState(false);
  const [noSimilarQuestionsConfirmed, setNoSimilarQuestionsConfirmed] = useState(false);

  return {
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
    validateField,
    handleSimilarQuestionsCheck,
    hasCheckedSimilarQuestions,
    noSimilarQuestionsConfirmed,
    setNoSimilarQuestionsConfirmed,
  };
}