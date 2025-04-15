import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { updateUser } from "@/feature/authSlice";
import { logout } from "@/feature/authThunks";
import api from "@/utils/axios";
import toast from "react-hot-toast";

const ProtectedRoute: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyTokenAndFetchUser = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const otpEmail = localStorage.getItem("otp_email")

      if (!accessToken && !otpEmail) {
        dispatch(logout());
        navigate("/login");
        setLoading(false);
        return;
      }

      if(otpEmail){
        navigate("/otp");
        return
      } 

      try {
        const userRes = await api.get("/verify-user");
        dispatch(updateUser({ user: userRes.data.user }));
      } catch (userErr:any) {
        const status = userErr.response?.status;
        const message = userErr.response?.data?.message;

        // If user is banned or invalid, just logout and show toast
        if (status === 400 && message === "User invalid or banned.") {
          toast.error("Invalid or Banned User.");
          dispatch(logout());
          navigate("/login");
          setLoading(false);
          return;
        }
        try {
          const adminRes = await api.get("/admin/verify-admin");
          dispatch(updateUser({ user: adminRes.data.user }));
          navigate("/admin/users");
          return;
        } catch (adminErr) {
          dispatch(logout());
          navigate("/login");
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthenticated || !user) {
      verifyTokenAndFetchUser();
    } else {
      setLoading(false);
    }
  }, [dispatch, isAuthenticated, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <img src="/loading.gif" alt="Loading..." className="w-10 h-10" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin/users" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;