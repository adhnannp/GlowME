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
import GCoinPage from "@/pages/user/GCoin/GCoin";

const UserRoutes: React.FC = () => {

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<QuestionsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/connect" element={<Connect/>}/>
        <Route path="/user/:id" element={<OtherUserProfile/>}/>
        <Route path="/GCoin" element={<GCoinPage/>} />
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
