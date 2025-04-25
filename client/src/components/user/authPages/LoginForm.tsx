// components/user/authPages/LoginForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '@/feature/authThunks';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm from './ForgotPasswordForm';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email').nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: any) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
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
        navigate('/');
      } else {
        toast.error('Google login failed.');
      }

      window.removeEventListener('message', messageListener);
      popup?.close();
    };

    window.addEventListener('message', messageListener);
  };

  const onLoginSubmit = async (data: LoginFormData, event?: React.BaseSyntheticEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    try {
      const result = await dispatch(userLogin(data) as any);
      if (userLogin.fulfilled.match(result)) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(result.payload || 'Login failed. Please try again.');
      }
    } catch (err) {
      toast.error('Something went wrong. Try again later.');
    }
  };

  return (
    <div className="flex flex-col justify-center max-w-sm mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Log In</h2>
      <p className="text-sm mb-6">Login Bro! Something Amazing Will Be Waiting For You</p>
      <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
        <div className="relative">
          <div className="text-xs text-gray-500 absolute top-1 left-3 z-10">Email</div>
          <Input
            type="email"
            {...loginForm.register('email')}
            className="rounded-md border-gray-300 pt-4"
          />
          {loginForm.formState.errors.email && (
            <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.email.message}</p>
          )}
        </div>
        <div className="relative">
          <div className="text-xs text-gray-500 absolute top-1 left-3 z-10">Password</div>
          <Input
            type="password"
            {...loginForm.register('password')}
            className="rounded-md border-gray-300 pt-4"
          />
          {loginForm.formState.errors.password && (
            <p className="text-red-500 text-sm mt-1">{loginForm.formState.errors.password.message}</p>
          )}
        </div>
        <div className="flex justify-left gap-2 items-center">
          <Button
            type="submit"
            className="bg-black text-white rounded-md px-6"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-md px-6 flex items-center"
          onClick={handleGoogleLogin}
          >
          <FcGoogle className="text-xl" />
          <span>Log In with Google</span>
        </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
      <br />
      <ForgotPasswordForm isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
};

export default LoginForm;