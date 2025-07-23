import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useRegisterUser from "../hooks/useRegisterUser";
import { successToast } from "../../utils/toastUtil";

const SignUpForm = () => {
  const { register, loading, errors = {}, success } = useRegisterUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }
    const result = await register({
      first_name: formData.first_name,
      last_name: formData.last_name,
      username: formData.username,
      email: formData.email,
      password_hash: formData.password,
    });
    if (result) {
      successToast(
        "Verification code sent to your email. Please verify to complete registration."
      );
      navigate("/verify-email", { state: { email: formData.email } });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e3f0fc] via-[#f7fbff] to-[#e3f0fc]">
      <div className="grid grid-cols-1 items-center rounded-xl bg-white max-sm:p-6 sm:p-10 shadow-2xl border border-gray-100 w-full sm:w-[500px]">
        <div className="grid grid-cols-1 gap-10">
          <div>
            <h1 className="text-lg font-semibold text-center">
              Create your account
            </h1>
            <form className="mt-10 space-y-4" onSubmit={handleSubmit}>
              {/* First and Last Name */}
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="first_name"
                    className="block mb-2 text-sm font-medium "
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    placeholder="First Name"
                    onChange={handleChange}
                    value={formData.first_name}
                    required
                    className="block h-10 w-full appearance-none rounded-lg bg-white pl-3 pr-3 border border-gray-300 text-sm outline outline-1 outline-gray-950/15 focus:outline-[#5AB1F5] focus:border-[#5AB1F5] transition"
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm">{errors.first_name}</p>
                  )}
                </div>
                <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                  <label
                    htmlFor="last_name"
                    className="block mb-2 text-sm font-medium"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    placeholder="Last Name"
                    onChange={handleChange}
                    value={formData.last_name}
                    required
                    className="block h-10 w-full appearance-none rounded-lg bg-white pl-3 pr-3 border border-gray-300 text-sm outline outline-1 outline-gray-950/15 focus:outline-[#5AB1F5] focus:border-[#5AB1F5] transition"
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm">{errors.last_name}</p>
                  )}
                </div>
              </div>
              {/* Username and Email */}
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    onChange={handleChange}
                    value={formData.username}
                    required
                    className="block h-10 w-full appearance-none rounded-lg bg-white pl-3 pr-3 border border-gray-300 text-sm outline outline-1 outline-gray-950/15 focus:outline-[#5AB1F5] focus:border-[#5AB1F5] transition"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username}</p>
                  )}
                </div>
                <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="name@company.com"
                    onChange={handleChange}
                    value={formData.email}
                    required
                    className="block h-10 w-full appearance-none rounded-lg bg-white pl-3 pr-3 border border-gray-300 text-sm outline outline-1 outline-gray-950/15 focus:outline-[#5AB1F5] focus:border-[#5AB1F5] transition"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
              </div>
              {/* Password and Confirm Password */}
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text"
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
                  {errors.password_hash && (
                    <p className="text-red-500 text-sm">
                      {errors.password_hash}
                    </p>
                  )}
                </div>
                <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                  <label
                    htmlFor="confirm_password"
                    className="block mb-2 text-sm font-medium text"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    value={formData.confirm_password}
                    required
                    className="block h-10 w-full appearance-none rounded-lg bg-white pl-3 pr-3 border border-gray-300 text-sm outline outline-1 outline-gray-950/15 focus:outline-[#5AB1F5] focus:border-[#5AB1F5] transition"
                  />
                  {/* You can add client-side error for confirm_password if needed */}
                </div>
              </div>
              {errors.general && (
                <p className="text-red-500 text-sm">{errors.general}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full inline-flex justify-center rounded-full text-sm font-semibold bg-[#5AB1F5] text-white hover:bg-[#4098db] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5AB1F5] px-4 py-2 transition"
              >
                {loading ? "Signing Up..." : "Sign Up"}
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
                    "https://trip-tidy.onrender.com/api/v1/gen/users/google")
                }
                className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-5 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition mb-2"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Sign in with Google
              </button>
            </form>
            <p className="text-sm text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#5AB1F5] hover:underline font-medium"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpForm;
