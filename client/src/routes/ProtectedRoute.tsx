import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { logout, updateUser } from "@/feature/authSlice";
import api from "@/utils/axios";

const ProtectedRoute: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const { isAuthenticated, user, isAdmin } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyTokenAndFetchUser = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        dispatch(logout())
        setLoading(false);
        navigate("/login")
        return;
      }

      if (isAuthenticated && user && accessToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/verify-user")
        dispatch(
          updateUser({
            user: response.data.user,
          })
        );
      } catch (error) {
        console.error("Token validation failed:", error);
        dispatch(logout())
        navigate("/login")
      } finally {
        setLoading(false);
      }
    };

    verifyTokenAndFetchUser();
  }, [dispatch, isAuthenticated, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <img src="/loading.gif" alt="Loading..." className="w-10 h-10" />
      </div>
    );
  }

  if ((!isAuthenticated && !localStorage.getItem("accessToken")) || !user) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;