import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminRoutes from "./routes/adminRoutes/AdminRoutes";
import UserRoutes from "./routes/userRoutes/UserRoutes";
import { useSocket } from "./components/customHooks/useSocket";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";

function App() {
  const user = useSelector((state: RootState) => state.auth.user);
  useSocket(user?._id);

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes/>}/>
      </Routes>
    </Router>
  );
}

export default App;
