import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const OtpRoute: React.FC = () => {
  const { isAuthenticated,user,isAdmin } = useSelector((state: any) => state.auth);
  const email = localStorage.getItem("otp_email");
  const accessToken = localStorage.getItem("accessToken")

  if (isAuthenticated && user && isAdmin &&accessToken) return <Navigate to="/admin" replace />;
  else if (isAuthenticated && user && !isAdmin && accessToken) return <Navigate to="/" replace />;
  else if (!email) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default OtpRoute;
