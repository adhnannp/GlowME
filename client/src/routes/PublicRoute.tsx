import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { logout } from "@/feature/authSlice";

const PublicRoute: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const accessToken = localStorage.getItem("accessToken");
  const otpEmail = localStorage.getItem("otp_email")
  if(!accessToken && !otpEmail){
    dispatch(logout())
  }
  
  return isAuthenticated || accessToken ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;