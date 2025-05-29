import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store/store";

export default function LandingPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  console.log(user)
  const accessToken = localStorage.getItem("accessToken");
  const isLoggedIn = isAuthenticated || !!accessToken;
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <header className="flex justify-between items-center p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold">GlowME</h1>
        <Link to={isLoggedIn ? "/home" : "/login"}>
          <Button className="bg-black text-white hover:bg-gray-800">
            {isLoggedIn ? "Go to Home" : "Login"}
          </Button>
        </Link>
      </header>
      <section className="flex flex-col items-center justify-center text-center py-20 px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Ask, Answer, and Earn Rewards!
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
          Join our vibrant community at GlowME, where you can ask questions, share knowledge, earn XP points and coins, and redeem exciting rewards like books, pens, and stationery.
        </p>
        <Link to={isLoggedIn ? "/home" : "/login"}>
          <Button className="bg-black text-white px-6 py-3 text-lg hover:bg-gray-800">
            {isLoggedIn ? "Go to Home" : "Get Started"}
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Why Join GlowME?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Ask and Answer */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">❓</div>
              <h4 className="text-xl font-semibold mb-2">Ask & Answer Questions</h4>
              <p className="text-gray-600">
                Engage with a community of curious minds. Ask questions, share answers, and gain XP points for your contributions.
              </p>
            </div>
            {/* Feature 2: Earn Rewards */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">🎁</div>
              <h4 className="text-xl font-semibold mb-2">Earn Coins & Redeem Rewards</h4>
              <p className="text-gray-600">
                Collect coins through your activity and redeem them for exciting rewards like books, pens, and stationery items.
              </p>
            </div>
            {/* Feature 3: Buy Coins */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-xl font-semibold mb-2">Purchase Coins</h4>
              <p className="text-gray-600">
                Boost your coin balance with real money to unlock rewards faster and enhance your GlowME experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-center">
        <h3 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to Start Your GlowME Journey?
        </h3>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Sign up today to join a community of learners and earners. Ask questions, share knowledge, and unlock amazing rewards!
        </p>
        <Link to={isLoggedIn ? "/home" : "/register"}>
          <Button className="bg-black text-white px-6 py-3 text-lg hover:bg-gray-800">
            {isLoggedIn ? "Go to Home" : "Sign Up Now"}
          </Button>
        </Link>
      </section>

      <footer className="bg-black text-white py-6 px-4 text-center">
        <p>© {new Date().getFullYear()} GlowME. All rights reserved.</p>
      </footer>
    </div>
  );
}