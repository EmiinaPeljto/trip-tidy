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
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="bg-white rounded-lg shadow md:mt-0 w-full sm:w-[500px] xl:p-0 border border-gray-200">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
              Create your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {/* First and Last Name */}
              <div className="flex flex-col sm:flex-row sm:space-x-8">
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900"
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#5AB1F5] focus:border-[#5AB1F5] block w-full p-2.5"
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm">{errors.first_name}</p>
                  )}
                </div>
                <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                  <label
                    htmlFor="last_name"
                    className="block mb-2 text-sm font-medium text-gray-900"
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#5AB1F5] focus:border-[#5AB1F5] block w-full p-2.5"
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-sm">{errors.last_name}</p>
                  )}
                </div>
              </div>
              {/* Username and Email */}
              <div className="flex flex-col sm:flex-row sm:space-x-8">
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900"
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#5AB1F5] focus:border-[#5AB1F5] block w-full p-2.5"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username}</p>
                  )}
                </div>
                <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900"
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#5AB1F5] focus:border-[#5AB1F5] block w-full p-2.5"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
              </div>
              {/* Password and Confirm Password */}
              <div className="flex flex-col sm:flex-row sm:space-x-8">
                <div className="w-full sm:w-1/2">
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
                  {errors.password_hash && (
                    <p className="text-red-500 text-sm">
                      {errors.password_hash}
                    </p>
                  )}
                </div>
                <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                  <label
                    htmlFor="confirm_password"
                    className="block mb-2 text-sm font-medium text-gray-900"
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
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#5AB1F5] focus:border-[#5AB1F5] block w-full p-2.5"
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
                className="w-full text-white bg-[#5AB1F5] hover:bg-[#4098db] focus:ring-4 focus:outline-none focus:ring-[#5AB1F5]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition"
              >
                {loading ? "Signing Up..." : "Sign Up"}
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
                Sign up with Google
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
