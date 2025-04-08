import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { registerUser } from "@/feature/authThunks";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "@/store/store"; 
import { toast } from 'react-hot-toast';

const RegisterForm: React.FC = () => {
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
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await dispatch(registerUser(form)).unwrap();
      if (response?.email) {
        localStorage.setItem("otp_email",response.email)
        toast.success('Please check you Email for OTP');
        navigate(`/otp`);
      }
    } catch (error) {
      toast.error('registration failed');
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <h2 className="text-2xl font-semibold mb-2">Sign Up</h2>
      <p className="text-sm mb-6">You are a step away from something great!</p>

      <div className="space-y-4">
        <div className="relative">
          <div className="text-xs text-gray-500 absolute top-1 left-3 z-10">Username</div>
          <Input type="text" name="username" value={form.username} onChange={handleChange} className="rounded-md border-gray-300 pt-4" />
        </div>

        <div className="relative">
          <div className="text-xs text-gray-500 absolute top-1 left-3 z-10">Email</div>
          <Input type="email" name="email" value={form.email} onChange={handleChange} className="rounded-md border-gray-300 pt-4" />
        </div>

        <div className="relative">
          <div className="text-xs text-gray-500 absolute top-1 left-3 z-10">Password</div>
          <Input type="password" name="password" value={form.password} onChange={handleChange} className="rounded-md border-gray-300 pt-4" />
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleSubmit} className="bg-black text-white rounded-md px-6">Sign Up</Button>
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
      </div>
    </div>
  );
};

export default RegisterForm;
