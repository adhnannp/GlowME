import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '@/feature/authThunks';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const handleGoogleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;
  
    const popup = window.open(
      'http://localhost:3000/api/auth/google',
      'googleLogin',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  
    const messageListener = (event: MessageEvent) => {
      // Optional: check origin
      if (event.origin !== 'http://localhost:3000') return;
  
      const { token } = event.data;
      if (token) {
        // Save the token and redirect
        localStorage.setItem('accessToken', token); // or dispatch Redux action
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

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: any) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const result = await dispatch(userLogin(formData) as any);
      if (userLogin.fulfilled.match(result)) {
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(result.payload || 'Login failed. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Try again later.');
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <h2 className="text-2xl font-semibold mb-2">Log In</h2>
      <p className="text-sm mb-6">Login Bro! Something Amazing Will Be Waiting For You</p>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="relative">
          <div className="text-xs text-gray-500 absolute top-1 left-3 z-10">Email</div>
          <Input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="rounded-md border-gray-300 pt-4"
          />
        </div>
        <div className="relative">
          <div className="text-xs text-gray-500 absolute top-1 left-3 z-10">Password</div>
          <Input 
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="rounded-md border-gray-300 pt-4"
          />
        </div>
        <div className="flex space-x-2">
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
            className="rounded-md px-6 flex items-center space-x-2"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="text-xl" />
            <span>Sign in with Google</span>
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
