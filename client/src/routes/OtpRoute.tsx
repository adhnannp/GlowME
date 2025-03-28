import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const OtpRoute: React.FC = () => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const email = localStorage.getItem("otp_email");

  if (isAuthenticated) return <Navigate to="/" replace />;
  if (!email) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default OtpRoute;
