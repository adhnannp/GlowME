import { Routes, Route } from "react-router-dom";
import Login from "@/pages/user/auth/Login";
import Register from "@/pages/user/auth/Register";
import Otp from "@/pages/user/auth/Otp";
import ProfilePage from "@/pages/user/profile/Profile";
import QuestionsPage from "@/pages/user/home/Home";
import NotFound from "@/pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import OtpRoute from "./OtpRoute";
import OtherUserProfile from "@/pages/user/othersProfile/OtherProfile";
import Connect from "@/pages/user/connectOthers/ConnectOthers";
import ResetPasswordForm from "@/pages/user/resetPassword/resetPassword";
import GCoinPage from "@/pages/user/GCoin/GCoin";
import PaymentSuccessPage from "@/pages/user/payment/PaymentSuccess";
import PaymentCancelledPage from "@/pages/user/payment/PaymentCancelled";
import AskQuestionPage from "@/pages/user/askQuestion/AskQuestion";
import LandingPage from "@/pages/user/landingPage/LandingPage";
import SingleQuestionPage from "@/pages/user/singleQuestion/singleQuestion";
import RewardPage from "@/pages/user/Reward/Reward";
import CheckoutPage from "@/pages/user/Reward/Checkout";
import OrderPage from "@/pages/user/order/Order";

const UserRoutes: React.FC = () => {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/question/:slug" element={<SingleQuestionPage />} />
        <Route path="/home" element={<QuestionsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/connect" element={<Connect/>}/>
        <Route path="/user/:id" element={<OtherUserProfile/>}/>
        <Route path="/GCoin" element={<GCoinPage/>} />
        <Route path="/payment/success" element={<PaymentSuccessPage/>} />
        <Route path="/payment/cancel" element={<PaymentCancelledPage/>} />
        <Route path="/ask-question" element={<AskQuestionPage/>} />
        <Route path="/redeem" element={<RewardPage/>} />
        <Route path="/redeem/:rewardId" element={<CheckoutPage/>} />
        <Route path="/order" element={<OrderPage/>} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
      </Route>

      <Route element={<OtpRoute />}>
        <Route path="/otp" element={<Otp />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoutes;
