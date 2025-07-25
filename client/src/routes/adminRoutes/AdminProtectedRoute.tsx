import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { updateUser } from "@/feature/authSlice";
import { logout } from "@/feature/authThunks";
import api from "@/utils/axios";
import { clearNotifications } from "@/feature/socketSlice";
import { disconnectSocket } from "@/utils/socket";

const AdminProtectedRoute: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const otpEmail = localStorage.getItem("otp_email")

      if (!accessToken && !otpEmail) {
        dispatch(clearNotifications());
        disconnectSocket();
        dispatch(logout());
        navigate("/admin/login");
        return;
      }

      if(otpEmail){
        navigate("/otp");
        return
      } 

      try {
        const adminRes = await api.get("/admin/verify-admin");
        dispatch(updateUser({ user: adminRes.data.user }));
      } catch (adminErr) {
        try {
          const userRes = await api.get("/verify-user");
          dispatch(updateUser({ user: userRes.data.user }));
          navigate("/");
          return;
        } catch (userErr) {
          dispatch(clearNotifications());
          disconnectSocket();
          dispatch(logout());
          navigate("/admin/login");
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <img src="/loading.gif" alt="Loading..." className="w-10 h-10" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
