import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const OtpForm: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Ensure only numbers are entered
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only allow one digit per field
    setOtp(newOtp);

    // Move to next input field
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-semibold">Enter OTP</h2>
      <p className="text-sm text-gray-500">Please enter the 6-digit code sent to you</p>

      {/* OTP Input Fields */}
      <div className="flex space-x-2">
        {otp.map((value, index) => (
          <Input
            key={index}
            id={`otp-${index}`}
            type="text"
            value={value}
            maxLength={1}
            onChange={(e) => handleChange(index, e.target.value)}
            className="w-12 h-12 text-center text-lg font-semibold border-gray-300 rounded-md focus:ring-2 focus:ring-black"
          />
        ))}
      </div>

      {/* Submit Button */}
      <Button className="bg-black text-white rounded-md px-6 mt-4">Verify OTP</Button>
    </div>
  );
};

export default OtpForm;
