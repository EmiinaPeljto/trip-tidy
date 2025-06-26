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
      // Redirect if needed, e.g. navigate("/dashboard");
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="bg-white rounded-lg shadow md:mt-0 w-full sm:w-[500px] xl:p-0 border border-gray-200">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
              Log in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="usernameOrEmail"
                  className="block mb-2 text-sm font-medium text-gray-900"
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#5AB1F5] focus:border-[#5AB1F5] block w-full p-2.5"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
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
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#5AB1F5] focus:border-[#5AB1F5] block w-full p-2.5"
                />
              </div>
              {/* Show backend error message */}
              {errors?.general && (
                <p className="text-red-500 text-sm">{errors.general}</p>
              )}
              {/* Show backend message property if present */}
              {errors?.message && (
                <p className=" text-red-500 text-sm">{errors.message}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-[#5AB1F5] hover:bg-[#4098db] focus:ring-4 focus:outline-none focus:ring-[#5AB1F5]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition"
              >
                {loading ? "Logging In..." : "Log In"}
              </button>
              <div className="flex items-center">
                <div className="flex-grow h-px bg-gray-200"></div>
                <span className="mx-2 text-gray-400 text-xs">or</span>
                <div className="flex-grow h-px bg-gray-200"></div>
              </div>
              <button
                type="button"
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
