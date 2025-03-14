import LoginPage from "@/pages/admin/auth/Login";
import ReportsPage from "@/pages/admin/reports/Reports";
import UserDashboard from "@/pages/admin/users/Users";
import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

const AdminRoutes:React.FC = () => {
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/users" element={<UserDashboard />} />
      <Route path="/Reports" element={<ReportsPage />} />
    </Routes>
  );
};

export default AdminRoutes;
