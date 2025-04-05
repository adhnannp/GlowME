import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { updateUser } from "@/feature/authSlice";
import { logout } from "@/feature/authThunks";
import api from "@/utils/axios";

const AdminPublicRoute: React.FC = () => {
  const { isAuthenticated, isAdmin, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }
      try {
        const adminResponse = await api.get("/verify-admin");
        dispatch(updateUser({ user: adminResponse.data.user }));
      } catch (adminErr) {
        try {
          const userResponse = await api.get("/verify-user");
          dispatch(updateUser({ user: userResponse.data.user }));
        } catch (userErr) {
          await dispatch(logout());
        }
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [accessToken, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <img src="/loading.gif" alt="Loading..." className="w-10 h-10" />
      </div>
    );
  }

  if (isAuthenticated && isAdmin && user) {
    return <Navigate to="/admin/users" replace />;
  }

  if (isAuthenticated && !isAdmin && user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminPublicRoute;
