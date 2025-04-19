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
import OtherUserProfile from "@/pages/user/othersProfile/OtherProfile";
import Connect from "@/pages/user/connectOthers/ConnectOthers";
import ResetPasswordForm from "@/pages/user/resetPassword/resetPassword";

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

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<QuestionsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/connect" element={<Connect/>}/>
        <Route path="/user/:id" element={<OtherUserProfile/>}/>
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
      </Route>

      <Route element={<OtpRoute />}>
        <Route path="/otp" element={<Otp />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;
