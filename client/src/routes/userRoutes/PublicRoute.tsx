import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { updateUser } from "@/feature/authSlice";
import { logout } from "@/feature/authThunks";
import api from "@/utils/axios";
import toast from "react-hot-toast";

const PublicRoute: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const verify = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const userResponse = await api.get("/verify-user");
        dispatch(updateUser({ user: userResponse.data.user }));
      } catch (userErr:any) {
        const status = userErr.response?.status;
        const message = userErr.response?.data?.message;
        if (status === 400 && message === "User invalid or banned.") {
          toast.error("Invalid or Banned User.");
          dispatch(logout());
          navigate("/login");
          setLoading(false);
          return;
        }
        try {
          const adminResponse = await api.get("/admin/verify-admin");
          dispatch(updateUser({ user: adminResponse.data.user }));
        } catch (adminErr) {
          await dispatch(logout());
        }
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [dispatch, accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <img src="/loading.gif" alt="Loading..." className="w-10 h-10" />
      </div>
    );
  }

  if (isAuthenticated && user && isAdmin) {
    return <Navigate to="/admin/users" replace />;
  }

  if (isAuthenticated && user && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;