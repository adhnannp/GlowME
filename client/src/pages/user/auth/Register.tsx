import React from 'react';
import Header from '../../../components/user/authPages/Header'
import RegisterForm from '@/components/user/authPages/RegisterForm';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header page="register"/>
      <main className="flex justify-center items-center px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
          <RegisterForm/>
          <div className="hidden md:flex justify-center items-center">
            <div className="relative">
              <div className="w-64">
                {/* Illustration of person with phone */}
                <img src="Animation - 1741701078258.gif" alt="Illustration of person with phone" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;