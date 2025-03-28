// import React, { useState, useEffect } from "react";
import { Routes, Route, /*useLocation*/ } from "react-router-dom";
import Login from "@/pages/user/auth/Login";
import Register from "@/pages/user/auth/Register";
import Otp from "@/pages/user/auth/Otp";
import ProfilePage from "@/pages/user/profile/Profile";
import QuestionsPage from "@/pages/user/home/Home";
import NotFound from "@/pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import OtpRoute from "./OtpRoute";

const UserRoutes: React.FC = () => {
  // const [isLoading, setIsLoading] = useState(true);
  // const location = useLocation();

  // useEffect(() => {
  //   setIsLoading(true);
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1500);
  //   return () => clearTimeout(timer);
  // }, [location]);

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen bg-white">
  //       <img src="/loading.gif" alt="Loading..." className="w-10 h-10" />
  //     </div>
  //   );
  // }

  return (
    <Routes>
      {/* Protected Routes (Only Logged-in Users) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<QuestionsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Public Routes (Only Guests) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* OTP Route (Only if Email Exists in LocalStorage) */}
      <Route element={<OtpRoute />}>
        <Route path="/otp" element={<Otp />} />
      </Route>

      {/* Catch-all Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;
