import { useState, useEffect } from 'react';
import { baseQuestionFormSchema, questionFormSchema, QuestionFormData } from '../../../validations/question/questionSchema';
import { useDebounce } from '@/components/customHooks/useDebounce';
import { checkTitleAvailability, fetchSimilarQuestions } from '@/services/user/user.AddQuestion.service';

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
  const [similarQuestions, setSimilarQuestions] = useState<{ id: string; title: string; url: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedTitle = useDebounce(formData.title, 500);

  useEffect(() => {
    if (debouncedTitle.length < 3) {
      setTitleStatus({ status: 'idle' });
      setSimilarQuestions([]);
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

    const fetchSimilar = async () => {
      try {
        const response = await fetchSimilarQuestions(debouncedTitle);
        setSimilarQuestions(response.similarQuestions);
      } catch (error) {
        setSimilarQuestions([]);
        console.error('Fetching similar questions failed:', error);
      }
    };

    setTitleStatus({ status: 'loading' });
    checkTitle();
    fetchSimilar();

  }, [debouncedTitle]);

  const validateField = (field: keyof QuestionFormData, value: any) => {
    const result = baseQuestionFormSchema.shape[field].safeParse(value);
    setFormErrors((prev) => ({
      ...prev,
      [field]: result.success ? undefined : result.error.errors[0]?.message,
    }));

    if (field === 'isBounty' || field === 'bountyCoins') {
      const fullResult = questionFormSchema.safeParse({ ...formData, [field]: value });
      setFormErrors((prev) => ({
        ...prev,
        bountyCoins: fullResult.success
          ? undefined
          : fullResult.error.errors.find((err) => err.path[0] === 'bountyCoins')?.message,
      }));
    }
  };

  const handleChange = <K extends keyof QuestionFormData>(field: K, value: QuestionFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormErrors((prev) => ({ ...prev, image: 'Only image files are allowed' }));
        return;
      }
      handleChange('image', file);
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
      handleChange('document', file);
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
    } catch (error) {
      console.error('Error submitting question:', error);
      setFormErrors({ general: 'Failed to post question. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

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
  };
}