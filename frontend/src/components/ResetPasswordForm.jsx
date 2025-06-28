import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import useResetPassword from "../hooks/useResetPassword";
import { successToast } from "../../utils/toastUtil";
import { FiLock } from "react-icons/fi";
import logo from "../assets/logo.png";

const ResetPasswordForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { resetPassword, loading, error, success } = useResetPassword();
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (password !== confirm) {
      setFormError("Passwords do not match.");
      return;
    }
    const result = await resetPassword({ token, password });
    if (result) {
      successToast("Password reset successful! You can now log in.");
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e3f0fc] via-[#f7fbff] to-[#e3f0fc]">
      <div className="grid grid-cols-1 items-center rounded-xl bg-white max-sm:p-6 sm:p-10 shadow-2xl border border-gray-100 w-full sm:w-[400px]">
        <div className="grid grid-cols-1 gap-10">
          <div className="flex items-start">
            <a tabIndex="-1" href="/">
              {/* Brand SVG or logo */}
              <img
                src={logo}
                alt="TripTidy Logo"
                className="h-16 w-auto"
                style={{ objectFit: "contain" }}
              />
            </a>
          </div>
          <div>
            <h1 className="text-lg font-semibold">Set a new password</h1>
            <p className="mt-4 text-sm text-gray-600">
              Enter your new password below.
            </p>
            <form className="mt-10" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiLock className="text-[#5AB1F5] text-lg" />
                  </span>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block h-10 w-full appearance-none rounded-lg bg-white pl-10 pr-3 border border-gray-300 text-sm outline outline-1 outline-gray-950/15 focus:outline-[#5AB1F5] data-error:outline-rose-500 transition"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <label htmlFor="confirm" className="block text-sm font-medium">
                  Confirm New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiLock className="text-[#5AB1F5] text-lg" />
                  </span>
                  <input
                    type="password"
                    name="confirm"
                    id="confirm"
                    placeholder="Confirm New Password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="block h-10 w-full appearance-none rounded-lg bg-white pl-10 pr-3 border border-gray-300 text-sm outline outline-1 outline-gray-950/15 focus:outline-[#5AB1F5] data-error:outline-rose-500 transition"
                  />
                </div>
              </div>
              {formError && (
                <p className="mt-2 text-red-500 text-sm text-center">
                  {formError}
                </p>
              )}
              {error && (
                <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
              )}
              {success && (
                <p className="mt-2 text-[#5AB1F5] text-sm text-center">
                  Password reset successful! Redirecting to login...
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="mt-10 w-full inline-flex justify-center rounded-full text-sm font-semibold bg-[#5AB1F5] text-white hover:bg-[#4098db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5AB1F5] px-4 py-2 transition"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
              <p className="mt-6 text-sm text-gray-600 text-center">
                Remembered your password?{" "}
                <Link
                  className="font-semibold hover:text-[#4098db] transition"
                  to="/login"
                >
                  Log in <span aria-hidden="true">→</span>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPasswordForm;
