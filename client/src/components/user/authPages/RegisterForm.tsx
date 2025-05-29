import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch } from 'react-redux';
import { registerUser } from '@/feature/authThunks';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '@/store/store';
import { toast } from 'react-hot-toast';

const registerSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters').nonempty('Username is required'),
    email: z.string().email('Please enter a valid email').nonempty('Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters').nonempty('Password is required'),
    confirmPassword: z.string().nonempty('Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const popup = window.open(
      import.meta.env.VITE_GOOGLE_AUTH_API,
      'googleLogin',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    const messageListener = (event: MessageEvent) => {
      if (event.origin !== import.meta.env.VITE_BASE_URL) return;

      const { token } = event.data;
      if (token) {
        localStorage.setItem('accessToken', token);
        toast.success('Google login successful!');
        navigate('/home');
      } else {
        toast.error('Google login failed.');
      }

      window.removeEventListener('message', messageListener);
      popup?.close();
    };

    window.addEventListener('message', messageListener);
  };

  // Handle form submission
  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...formData } = data; 
      const response = await dispatch(registerUser(formData)).unwrap();
      if (response?.email) {
        localStorage.setItem('otp_email', response.email);
        toast.success('Please check your Email for OTP');
        navigate('/otp');
      }
    } catch (error :any) {
      toast.error(error);
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <h2 className="text-2xl font-semibold mb-2">Sign Up</h2>
      <p className="text-sm mb-6">You are a step away from something great!</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <div className="text-xs text-gray-500 absolute top-1 left-3 z-10">Username</div>
          <Input
            type="text"
            {...register('username')}
            className="rounded-md border-gray-300 pt-4"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <div className="relative">
          <div className="text-xs text-gray-500 absolute top-1 left-3 z-10">Email</div>
          <Input
            type="email"
            {...register('email')}
            className="rounded-md border-gray-300 pt-4"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="relative">
          <div className="text-xs text-gray-500 absolute top-1 left-3 z-10">Password</div>
          <Input
            type="password"
            {...register('password')}
            className="rounded-md border-gray-300 pt-4"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <div className="relative">
          <div className="text-xs text-gray-500 absolute top-1 left-3 z-10">Confirm Password</div>
          <Input
            type="password"
            {...register('confirmPassword')}
            className="rounded-md border-gray-300 pt-4"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="flex space-x-2">
          <Button
            type="submit"
            className="bg-black text-white rounded-md px-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-md px-6 flex items-center space-x-2"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="text-xl" />
            <span>Sign in with Google</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;