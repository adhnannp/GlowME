import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

const LoginForm: React.FC = () => {
    return(
        <>
        <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-2">Log In</h2>
            <p className="text-sm mb-6">Login Bro! Something Amazing Will Be Wating For You</p>
            <div className="space-y-4">
              <div className="relative">
                <div className="text-xs text-gray-500 absolute top-1 left-3 z-10">Username</div>
                <Input 
                  type="text" 
                  className="rounded-md border-gray-300 pt-4"
                />
              </div>
              <div className="relative">
                <div className="text-xs text-gray-500 absolute top-1 left-3 z-10">Password</div>
                <Input 
                  type="password" 
                  className="rounded-md border-gray-300 pt-4"
                />
              </div>
              <div className="flex space-x-2">
                <Button className="bg-black text-white rounded-md px-6">Log In</Button>
                <Button variant="outline" className="rounded-md px-6 flex items-center space-x-2">
                  <FcGoogle className="text-xl" />
                  <span>Sign in with Google</span>
                </Button>
              </div>
            </div>
        </div>
        </>
    )
}

export default LoginForm