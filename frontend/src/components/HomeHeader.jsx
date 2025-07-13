import React from "react";
import { Link } from "react-router-dom";

const HomeHeader = () => (
  <div
    className="relative flex flex-col items-center justify-center min-h-[100vh] text-center px-4"
    style={{
      backgroundImage: `url('/background.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Light overlay for subtle contrast */}
    <div className="absolute inset-0 bg-opacity-100 backdrop-blur-sm z-0"></div>

    {/* Content */}
    <div className="z-10 max-w-2xl">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6 drop-shadow-sm">
        Welcome to <span className="text-[#5AB1F5]">TripTidy</span>!
      </h1>
      <p className="text-lg md:text-xl font-medium text-gray-700 mb-8">
        Let TripTidy build your perfect itinerary with the power of AI— just
        enter your destination, and we’ll handle the rest. ✈️
      </p>
      <Link
        to="/create-itinerary"
        className="bg-[#5AB1F5] hover:bg-[#4098db] text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
      >
        Build Your Itinerary
      </Link>
    </div>
  </div>
);

export default HomeHeader;