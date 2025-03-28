import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "@/feature/authThunks";
import { AppDispatch, RootState } from "@/store/store";
import { toast } from "react-hot-toast";
import api from "@/utils/axios";

const OtpForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const email = localStorage.getItem("otp_email") || "";
  const { loading } = useSelector((state: RootState) => state.auth);

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState<number>(50);
  const [expiryTimer, setExpiryTimer] = useState<number>(300);
  const [expired, setExpired] = useState<boolean>(false);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '') {
        if (index > 0) {
          const newOtp = [...otp];
          newOtp[index - 1] = '';
          setOtp(newOtp);
          document.getElementById(`otp-${index - 1}`)?.focus()
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  useEffect(() => {
    const storedExpiryTime = localStorage.getItem("otpExpiryTime");
    const storedResendTime = localStorage.getItem("otpResendTime");

    if (storedExpiryTime) {
      const remainingExpiry = Math.floor((parseInt(storedExpiryTime) - Date.now()) / 1000);
      setExpiryTimer(remainingExpiry > 0 ? remainingExpiry : 0);
      setExpired(remainingExpiry <= 0);
    } else {
      localStorage.setItem("otpExpiryTime", (Date.now() + 300000).toString()); // 5 mins
    }

    if (storedResendTime) {
      const remainingResend = Math.floor((parseInt(storedResendTime) - Date.now()) / 1000);
      setResendTimer(remainingResend > 0 ? remainingResend : 0);
    } else {
      localStorage.setItem("otpResendTime", (Date.now() + 50000).toString()); // 50 secs
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      setExpiryTimer((prev) => {
        if (prev > 1) return prev - 1;
  
        if (prev === 1) {
          toast.error("Session expired!");
          setExpired(true);
        }
  
        return 0;
      });
    }, 1000);
  
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (expired) {
      const redirectTimeout = setTimeout(() => {
        localStorage.removeItem("otp_email");
        localStorage.removeItem("otpExpiryTime");
        localStorage.removeItem("otpResendTime");
        navigate("/register");
      }, 5000);
      return () => clearTimeout(redirectTimeout);
    }
  }, [expired, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value) || expired) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = async () => {
    if (expired) {
      setErrorMessage("Time limit exceeded. Please register again.");
      toast.error(errorMessage)
      return;
    }

    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP.");
      toast.error(errorMessage)
      return;
    }

    try {
      await dispatch(verifyOtp({ email, otp: enteredOtp })).unwrap();
      localStorage.removeItem("otp_email");
      localStorage.removeItem("otpExpiryTime");
      localStorage.removeItem("otpResendTime");
      navigate("/");
    } catch(error:any) {
      setErrorMessage("Invalid OTP. Please try again.");
      toast.error(error||errorMessage)
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    try {
      await api.post("/resend-otp", { email });
      toast.success("OTP resent successfully.");
      setResendTimer(50);
      localStorage.setItem("otpResendTime", (Date.now() + 50000).toString());
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Failed to resend OTP. Try again later.");
    }
  };

  if (expired) {
    return (
      <div className="flex items-center justify-center h-full py-10 flex-col space-y-4">
        <img src="/loading.gif" alt="Loading..." className="w-10 h-10" />
        <p className="text-gray-600 text-sm">Session expired. Redirecting to register...</p>
        <p className="text-gray-500 text-xs">Use the same email to try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-semibold">Enter OTP</h2>
      <p className="text-sm text-gray-500">A 6-digit code has been sent to {email}</p>
      <p className="text-sm text-gray-500 mt-2">
        Session expires in{" "}
        {expiryTimer >= 60
          ? `${Math.floor(expiryTimer / 60)}m ${expiryTimer % 60}s`
          : `${expiryTimer}s`}
      </p>
      <div className="flex space-x-2">
        {otp.map((value, index) => (
          <Input
            key={index}
            id={`otp-${index}`}
            type="text"
            value={value}
            maxLength={1}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-12 h-12 text-center text-lg font-semibold border-gray-300 rounded-md focus:ring-2 ${
              expired ? "bg-gray-200 cursor-not-allowed" : "focus:ring-black"
            }`}
            disabled={expired}
          />
        ))}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading || expired}
        className={`text-white rounded-md px-6 mt-4 ${
          expired ? "bg-gray-400 cursor-not-allowed" : "bg-black"
        }`}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </Button>

      {resendTimer === 0 && !expired ? (
        <a onClick={handleResendOtp} className="cursor-pointer text-sm text-blue-600 underline underline-offset-1">Resend OTP</a>
      ) : (
        <p className="text-sm text-gray-500 mt-2">
          Resend OTP in{" "}
          {resendTimer >= 60
            ? `${Math.floor(resendTimer / 60)}m ${resendTimer % 60}s`
            : `${resendTimer}s`}
        </p>
      )}
    </div>
  );
};

export default OtpForm;