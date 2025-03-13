import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "@/pages/user/auth/Login";
import Register from "@/pages/user/auth/Register";
import Otp from "@/pages/user/auth/Otp";
import BreadIllustration from "@/pages/NotFound/NotFound";
import ProfilePage from "@/pages/user/profile/Profile";
import QuestionsPage from "@/pages/user/home/Home";

const UserRoutes:React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);

    // Simulate a 3-second loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <img src="/loading.gif" alt="Loading..." className="w-10 h-10" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/home" element={<QuestionsPage />} />
      <Route path="*" element={<BreadIllustration />} />
    </Routes>
  );
};

export default UserRoutes;
