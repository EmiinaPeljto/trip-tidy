import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLogInUser from "../hooks/useLogInUser";
import { successToast } from "../../utils/toastUtil";

const LogInForm = () => {
  const { login, loading, errors } = useLogInUser();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const navigate = useNavigate();

  const redirectPath = localStorage.getItem("redirectAfterLogin");
  if (redirectPath) {
    localStorage.removeItem("redirectAfterLogin");
    navigate(redirectPath);
  } else {
    navigate("/");
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({
      username: formData.usernameOrEmail,
      email: formData.usernameOrEmail,
      password_hash: formData.password,
    });
    if (result) {
      successToast("Login successful!");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e3f0fc] via-[#f7fbff] to-[#e3f0fc]">
      <div className="grid grid-cols-1 items-center rounded-xl bg-white max-sm:p-6 sm:p-10 shadow-2xl border border-gray-100 w-full sm:w-[500px]">
        <div className="grid grid-cols-1 gap-10">
          <div>
            <h1 className="text-lg font-semibold text-center">
              Log in to your account
            </h1>
            <form className="mt-10 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="usernameOrEmail"
                  className="block mb-2 text-sm font-medium"
                >
                  Username or Email
                </label>
                <input
                  type="text"
                  name="usernameOrEmail"
                  id="usernameOrEmail"
                  placeholder="Username or Email"
                  onChange={handleChange}
                  value={formData.usernameOrEmail}
                  required
                  className="block h-10 w-full appearance-none rounded-lg bg-white pl-3 pr-3 border border-gray-300 text-sm outline outline-1 outline-gray-950/15 focus:outline-[#5AB1F5] focus:border-[#5AB1F5] transition"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium "
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  value={formData.password}
                  required
                  className="block h-10 w-full appearance-none rounded-lg bg-white pl-3 pr-3 border border-gray-300 text-sm outline outline-1 outline-gray-950/15 focus:outline-[#5AB1F5] focus:border-[#5AB1F5] transition"
                />
                <div className="flex justify-end mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-[#5AB1F5] hover:underline text-sm"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              {errors?.general && (
                <p className="text-red-500 text-sm">{errors.general}</p>
              )}
              {errors?.message && (
                <p className="text-red-500 text-sm">{errors.message}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full inline-flex justify-center rounded-full text-sm font-semibold bg-[#5AB1F5] text-white hover:bg-[#4098db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5AB1F5] px-4 py-2 transition"
              >
                {loading ? "Logging In..." : "Log In"}
              </button>
              <div className="flex items-center my-2">
                <div className="flex-grow h-px bg-gray-200"></div>
                <span className="mx-2 text-gray-400 text-xs">or</span>
                <div className="flex-grow h-px bg-gray-200"></div>
              </div>
              <button
                type="button"
                onClick={() =>
                  (window.location.href =
                    "http://localhost:3001/api/v1/gen/users/google")
                }
                className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-5 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition mb-2"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Log in with Google
              </button>
            </form>
            <p className="text-sm text-center text-gray-600 mt-4">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#5AB1F5] hover:underline font-medium"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogInForm;
