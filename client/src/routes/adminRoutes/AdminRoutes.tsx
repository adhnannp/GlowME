import LoginPage from "@/pages/admin/auth/Login";
import ReportsPage from "@/pages/admin/reports/Reports";
import UserDashboard from "@/pages/admin/users/Users";
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPublicRoute from "@/routes/adminRoutes/AdminPublicRoute";
import AdminProtectedRoute from "@/routes/adminRoutes/AdminProtectedRoute";
import BadgeDashboard from "@/pages/admin/badges/Badges";
import GCoinDashboard from "@/pages/admin/GCoin/GCoinDashboard";
import CouponDashboard from "@/pages/admin/coupons/CouponDashboard";

const AdminRoutes:React.FC = () => {
  // const [isLoading, setIsLoading] = useState(true);
  // const location = useLocation();

  // useEffect(() => {
  //   setIsLoading(true);

  //   // Simulate a 3-second loading time
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 3000);

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
      <Route element={<AdminPublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<AdminProtectedRoute />}>
        <Route path="/users" element={<UserDashboard />} />
        <Route path="/badges" element={<BadgeDashboard />} />
        <Route path="/GCoins" element={<GCoinDashboard />} />
        <Route path="/coupons" element={<CouponDashboard />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
