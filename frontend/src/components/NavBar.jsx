import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { FiUser, FiMenu, FiX } from "react-icons/fi";

const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("jwt_token")
  );
  const mobileMenuRef = useRef();

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem("jwt_token"));
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
    setDropdownOpen(false);
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src={logo} alt="TripTidy Logo" />
              <span className="ml-2 text-xl font-bold text-[#5AB1F5]">
                TripTidy
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:space-x-8 items-center mx-auto">
            <Link
              to="/"
              className="border-b-2 border-transparent text-gray-700 hover:border-[#5AB1F5] hover:text-[#5AB1F5] px-3 py-2 text-sm font-medium transition"
            >
              Home
            </Link>
            <Link
              to="/create-itinerary"
              className="border-b-2 border-transparent text-gray-700 hover:border-[#5AB1F5] hover:text-[#5AB1F5] px-3 py-2 text-sm font-medium transition"
            >
              Planner
            </Link>
            <Link
              to="/guide"
              className="border-b-2 border-transparent text-gray-700 hover:border-[#5AB1F5] hover:text-[#5AB1F5] px-3 py-2 text-sm font-medium transition"
            >
              Guides
            </Link>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center relative">
            {!isLoggedIn ? (
              <Link
                to="/signup"
                className="bg-[#5AB1F5] px-4 py-2 rounded-full text-white text-sm font-semibold hover:bg-[#4098db] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5AB1F5] transition"
              >
                Sign Up
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((open) => !open)}
                  className="flex items-center justify-center p-0 focus:outline-none bg-transparent hover:bg-transparent"
                  style={{ height: "40px", width: "40px" }}
                  aria-label="User menu"
                >
                  <FiUser className="text-[1.3rem] text-gray-700" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-gray-200 py-2 animate-fade-in">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-[#e3f0fc] hover:text-[#5AB1F5] font-medium transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-[#e3f0fc] hover:text-[#5AB1F5] font-medium transition"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="text-gray-700 focus:outline-none"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg z-50 animate-fade-in"
        >
          <div className="flex flex-col px-4 py-4 space-y-2">
            <Link
              to="/"
              className="text-gray-700 px-3 py-2 rounded hover:bg-[#e3f0fc] hover:text-[#5AB1F5] font-medium transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/create-itinerary"
              className="text-gray-700 px-3 py-2 rounded hover:bg-[#e3f0fc] hover:text-[#5AB1F5] font-medium transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Planner
            </Link>
            <Link
              to="/guide"
              className="text-gray-700 px-3 py-2 rounded hover:bg-[#e3f0fc] hover:text-[#5AB1F5] font-medium transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Guides
            </Link>
            <hr className="my-2 border-gray-200" />
            {!isLoggedIn ? (
              <Link
                to="/signup"
                className="text-gray-700 px-3 py-2 rounded hover:bg-[#e3f0fc] hover:text-[#5AB1F5] font-medium transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="text-gray-700 px-3 py-2 rounded hover:bg-[#e3f0fc] hover:text-[#5AB1F5] font-medium transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-gray-700 px-3 py-2 rounded hover:bg-[#e3f0fc] hover:text-[#5AB1F5] font-medium transition text-left"
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 0.18s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-8px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </nav>
  );
};

export default NavBar;