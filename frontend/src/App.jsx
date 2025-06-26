import { Routes, Route, Link } from "react-router-dom";
import SignUpForm from "./components/SignUpForm";
import LogInForm from "./components/LogInForm";
import EmailVerification from "./pages/EmailVerification";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LogInForm />} />
        <Route path="/verify-email" element={<EmailVerification />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
