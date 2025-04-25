import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin } from '@/feature/authThunks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Define the validation schema with Zod
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email').nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
});

// Infer the TypeScript type from the schema
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: any) => state.auth);

  // Initialize React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await dispatch(adminLogin(data) as any);
      if (adminLogin.fulfilled.match(result)) {
        toast.success('Login successful!');
        navigate('/admin/users');
      } else {
        toast.error(error || 'Login failed. Please try again.');
      }
    } catch (err) {
      toast.error('Something went wrong. Try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
      <h1 className="mb-8 text-2xl font-bold">Login</h1>
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="pl-3 pr-10 py-2 rounded-full"
              {...register('email')}
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              className="pl-3 pr-10 py-2 rounded-full"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <Button
          type="submit"
          className="w-full rounded-full bg-[#FF9838] hover:bg-[#e88a2f] text-white"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </form>
  );
}