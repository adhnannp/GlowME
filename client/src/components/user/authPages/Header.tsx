import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  page: "login" | "register" | "otp";
}

const Header: React.FC<HeaderProps> = ({ page }) => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center px-10 py-4">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">GlowME</h1>
      </div>
      {page !== "otp" && (
        <div className="flex items-center space-x-6">
          {page !== "login" && (
            <>
            <Button
              variant="default"
              className="bg-black text-white rounded-md px-4"
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
            <Button
              variant="outline"
              className=" rounded-md px-4"
            >
              Sign Up
            </Button>
            </>
          )}
          {page !== "register" && (
            <>
            <Button
              variant="outline"
              className="rounded-md px-4"
            >
              Log In
            </Button>
            <Button
              variant="default"
              className="rounded-md px-4"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </Button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;