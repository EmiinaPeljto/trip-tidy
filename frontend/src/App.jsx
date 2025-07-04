import { Routes, Route, Link, useLocation } from "react-router-dom";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import Home from "./pages/Home";
import CreateItinerary from "./pages/CreateItinerary";
import useGoogleToken from "./hooks/useGoogleToken";
import "./App.css";
import { Toaster } from "react-hot-toast";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  useGoogleToken();
  const location = useLocation();
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="lex flex-col min-h-screen">
        {location.pathname !== "/login" &&
          location.pathname !== "/signup" &&
          location.pathname !== "/verify-email" &&
          location.pathname !== "/forgot-password" &&
          location.pathname !== "/reset-password/:token" && <NavBar />}
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />

          {/* Protected Route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/create-itinerary" element={<CreateItinerary />} />
            {/* Add any other routes you want to protect here */}
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
