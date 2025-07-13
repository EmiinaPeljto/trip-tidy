import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileFavorite from "./ProfileFavorite";
import { successToast } from "../../utils/toastUtil";

const ProfileFavorites = ({ favorites }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [removedIds, setRemovedIds] = useState([]);
  const navigate = useNavigate();

  const visibleFavorites = favorites.filter(
    (itinerary) => !removedIds.includes(itinerary.id)
  );

  const handleRemove = (id) => {
    setRemovedIds((prev) => [...prev, id]);
    successToast("Removed from favorites!");
  };

  if (visibleFavorites.length === 0) {
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
              d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No favorites yet
        </h2>
        <p className="text-gray-500 mb-6 max-w-md">
          You haven’t saved any trips yet. Explore curated adventures and save
          the ones you love.
        </p>
        <button
          onClick={() => navigate("/guide")}
          className="px-6 py-2 rounded-lg bg-[#5AB1F5] text-white font-semibold hover:bg-[#4298dd] transition"
        >
          Explore Trips
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6 ">
      {visibleFavorites.map((itinerary) => (
        <div key={itinerary.id} className="w-64">
          <ProfileFavorite
            itinerary={itinerary}
            showHeart
            onRemove={() => handleRemove(itinerary.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ProfileFavorites;
