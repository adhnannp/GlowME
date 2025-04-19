// components/ResetPasswordForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '@/utils/axios';

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters').nonempty('Password is required'),
    confirmPassword: z.string().nonempty('Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid or missing token');
      return;
    }

    try {
      await api.post('/reset-password', { token, password: data.password });
      toast.success('Password reset successful! Please log in.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid or expired token');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full p-4">
        <h1 className="text-2xl font-bold text-black tracking-tight">GlowME</h1>
      </header>
      {/* Centered Form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col justify-center max-w-sm w-full">
          <h2 className="text-2xl font-semibold mb-2 text-center">Reset Password</h2>
          <p className="text-sm mb-6 text-gray-600 text-center">
            Enter your new password below.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <div className="text-xs text-gray-500 absolute top-1 left-3 z-10">
                New Password
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className="rounded-md border-gray-300 pt-4 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            <div className="relative">
              <div className="text-xs text-gray-500 absolute top-1 left-3 z-10">
                Confirm Password
              </div>
              <Input
                type="password"
                {...register('confirmPassword')}
                className="rounded-md border-gray-300 pt-4"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="bg-black text-white rounded-md px-6 w-full cursor-pointer"
              disabled={isSubmitting || !token}
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
          <button
            type="button"
            className="text-sm text-blue-500 hover:underline mt-4 text-center w-full"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;