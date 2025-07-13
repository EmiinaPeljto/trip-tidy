import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileTripCard = ({ itinerary }) => {
  const { image, trip_title, destination, id } = itinerary;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/itinerary/${id}`);
  };

  return (
    <div
      className="max-w-xs w-full rounded-xl overflow-hidden shadow bg-white cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
    >
      <div className="relative h-32 overflow-hidden">
        <img
          src={image || "https://via.placeholder.com/400x300"}
          alt={trip_title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-2 left-3 text-white text-base font-semibold drop-shadow-md">
          {destination}
        </div>
      </div>
      <div className="px-4 py-3">
        <h3 className="text-base font-bold text-gray-800 truncate">
          {trip_title}
        </h3>
      </div>
    </div>
  );
};

export default ProfileTripCard;
