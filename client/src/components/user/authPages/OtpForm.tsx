import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate} from "react-router-dom";
import { verifyOtp } from "@/feature/authThunks";
import { AppDispatch, RootState } from "@/store/store";

const OtpForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const email = localStorage.getItem("email") || "";
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await dispatch(verifyOtp({ email, otp: enteredOtp })).unwrap();
      console.log(response)
      localStorage.removeItem("email")
      navigate("/");
    } catch (err) {
      setErrorMessage("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-semibold">Enter OTP</h2>
      <p className="text-sm text-gray-500">Please enter the 6-digit code sent to {email}</p>

      {/* OTP Inputs */}
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

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Submit Button */}
      <Button onClick={handleSubmit} disabled={loading} className="bg-black text-white rounded-md px-6 mt-4">
        {loading ? "Verifying..." : "Verify OTP"}
      </Button>
    </div>
  );
};

export default OtpForm;
