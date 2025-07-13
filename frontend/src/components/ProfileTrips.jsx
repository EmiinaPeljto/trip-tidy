import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileTripCard from "./ProfileTripCard";

const ProfileTrips = ({ trips }) => {
  const navigate = useNavigate();

  if (trips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full py-20 text-center">
        <div className="w-20 h-20 bg-[#5AB1F5]/10 text-[#5AB1F5] flex items-center justify-center rounded-full mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6v6l4 2m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No trips yet
        </h2>
        <p className="text-gray-500 mb-6 max-w-md">
          Start planning your next adventure with TripTidy. Create personalized
          itineraries tailored to your travel style.
        </p>
        <button
          onClick={() => navigate("/create-itinerary")}
          className="px-6 py-2 rounded-lg bg-[#5AB1F5] text-white font-semibold hover:bg-[#4298dd] transition"
        >
          Create Your First Trip
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6 ">
      {trips.map((itinerary) => (
        <div key={itinerary.id} className="w-64">
          <ProfileTripCard itinerary={itinerary} />
        </div>
      ))}
    </div>
  );
};

export default ProfileTrips;
