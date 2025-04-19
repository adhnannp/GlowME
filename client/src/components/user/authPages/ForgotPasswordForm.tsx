import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import api from '@/utils/axios';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email').nonempty('Email is required'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ isOpen, setIsOpen }) => {
  const forgotForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onForgotSubmit = async (data: ForgotPasswordFormData, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    try {
      await api.post('/forgot-password', { email: data.email });
      toast.success('If the email exists, a reset link has been sent.');
      setIsOpen(false);
      forgotForm.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) forgotForm.reset();
    }}>
      <DialogTrigger asChild>
        <button type="button" className="text-sm text-blue-500 hover:underline">
          Forgot Password?
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Forgot Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-4">
          <div className="relative">
            <div className="text-xs text-gray-500 absolute top-1 left-3 z-10">Email</div>
            <Input
              type="email"
              {...forgotForm.register('email')}
              className="rounded-md border-gray-300 pt-4"
            />
            {forgotForm.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {forgotForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="bg-black text-white rounded-md px-6 w-full"
            disabled={forgotForm.formState.isSubmitting}
          >
            {forgotForm.formState.isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordForm;