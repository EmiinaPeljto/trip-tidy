import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import VerificationCodeInput from "../components/VerificationCodeInput";
import ResendCodeButton from "../components/ResendCodeButton";
import useVerifyEmailCode from "../hooks/useVerifyEmailCode";
import useResendVerificationCode from "../hooks/useResendVerificationCode";
import { successToast } from "../../utils/toastUtil";

const EmailVerification = () => {
  const [code, setCode] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(60);

  const location = useLocation();
  const navigate = useNavigate();
  // Get email from location state or context
  const email = location.state?.email || ""; // Adjust as needed

  const {
    verifyCode,
    loading: verifying,
    error: verifyError,
    success: verifySuccess,
  } = useVerifyEmailCode();

  const {
    resendCode,
    loading: resending,
    error: resendError,
    success: resendSuccess,
  } = useResendVerificationCode();

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  React.useEffect(() => {
    if (verifySuccess) {
      successToast("Email verified! You can now log in.");
      navigate("/login");
    }
  }, [verifySuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email) {
      setError("No email found for verification.");
      return;
    }
    const result = await verifyCode({ email, code });
    if (!result) {
      setError(verifyError);
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    setTimer(60);
    setInfo("");
    setError("");
    if (!email) {
      setError("No email found for verification.");
      return;
    }
    const result = await resendCode(email);
    if (result) {
      setInfo("Verification code resent to your email.");
    } else {
      setError(resendError);
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="bg-white rounded-lg shadow w-full sm:w-[500px] xl:p-0 border border-gray-200">
          <div className="p-6 space-y-6 sm:p-8">
            <div className="flex flex-col items-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
                alt="Email"
                className="w-16 h-16 mb-2"
              />
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
                Email Verification
              </h1>
              <p className="text-gray-600 text-center mb-4">
                Please enter the 6-digit code sent to your email address.
                <br />
                This helps us keep your account secure.
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <VerificationCodeInput code={code} setCode={setCode} />
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              {info && (
                <p className="text-[#5AB1F5] text-sm text-center">{info}</p>
              )}
              <button
                type="submit"
                disabled={verifying}
                className="w-full text-white bg-[#5AB1F5] hover:bg-[#4098db] focus:ring-4 focus:outline-none focus:ring-[#5AB1F5]/50 font-medium rounded-lg text-base px-5 py-2.5 text-center transition"
              >
                {verifying ? "Verifying..." : "Verify Email"}
              </button>
            </form>
            <ResendCodeButton
              onResend={handleResend}
              resendDisabled={resendDisabled}
              timer={timer}
            />
            <div className="text-center mt-6">
              <Link
                to="/signup"
                className="text-gray-500 hover:text-[#5AB1F5] text-sm underline"
              >
                Back to SignUp
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailVerification;
