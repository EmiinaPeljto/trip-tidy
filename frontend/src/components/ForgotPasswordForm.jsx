import React, { useState } from "react";
import useForgotPassword from "../hooks/useForgotPassword";
import { successToast } from "../../utils/toastUtil";
import { FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const { forgotPassword, loading, error, success } = useForgotPassword();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    if (!error && !loading) {
      successToast("A reset link has been sent to your email.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e3f0fc] via-[#f7fbff] to-[#e3f0fc]">
      <div className="grid grid-cols-1 items-center rounded-xl bg-white max-sm:p-6 sm:p-10 shadow-2xl border border-gray-100 w-full sm:w-[400px]">
        <div className="grid grid-cols-1 gap-10">
          <div className="flex items-start">
            <a tabIndex="-1" href="/">
              <img
                src={logo}
                alt="TripTidy Logo"
                className="h-16 w-auto"
                style={{ objectFit: "contain" }}
              />
            </a>
          </div>
          <div>
            <h1 className="text-lg font-semibold">Reset your password</h1>
            <p className="mt-4 text-sm text-gray-600">
              Enter your email and we'll send you a link to reset your password.
            </p>
            <form className="mt-10" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiMail className="text-[#5AB1F5] text-lg" />
                  </span>
                  <input
                    type="email"
                    id="email"
                    className="block h-10 w-full appearance-none rounded-lg bg-white pl-10 pr-3 border border-gray-300 text-sm outline outline-1 outline-gray-950/15 focus:outline-[#5AB1F5] data-error:outline-rose-500 transition"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              {error && (
                <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
              )}
              {success && (
                <p className="mt-2 text-[#5AB1F5] text-sm text-center">
                  A reset link has been sent to your email.
                </p>
              )}
              <button
                type="submit"
                disabled={loading || !email}
                className="mt-10 w-full inline-flex justify-center rounded-full text-sm font-semibold bg-[#5AB1F5] text-white hover:bg-[#4098db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5AB1F5] px-4 py-2 transition"
              >
                {loading ? "Sending..." : "Reset your password"}
              </button>
              <p className="mt-6 text-sm text-gray-600 text-center">
                Don&apos;t have an account?{" "}
                <Link
                  className="font-semibold text-[#4098db] transition"
                  to="/signup"
                >
                  Get access <span aria-hidden="true">→</span>
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordForm;
