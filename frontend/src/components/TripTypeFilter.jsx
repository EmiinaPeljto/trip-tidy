import React from "react";
import { FaUser, FaUsers, FaHeart, FaChild } from "react-icons/fa";

const tripTypes = [
  { id: "solo", label: "Solo", icon: <FaUser /> },
  { id: "friends", label: "Friends", icon: <FaUsers /> },
  { id: "family", label: "Family", icon: <FaChild /> },
  { id: "couple", label: "Couple", icon: <FaHeart /> },
];

const TripTypeFilter = ({ selectedTripType, onSelect }) => (
  <div className="flex gap-1 items-center ml-2">
    <span className="text-gray-600 text-sm mr-1">Trip type:</span>
    {tripTypes.map((type) => (
      <button
        key={type.id}
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm border transition
          ${
            selectedTripType === type.id
              ? "bg-[#5AB1F5] text-white border-[#5AB1F5] shadow"
              : "bg-white text-gray-700 border-gray-300 hover:bg-[#e6f3fc]"
          }
        `}
        onClick={() => onSelect(selectedTripType === type.id ? null : type.id)}
        type="button"
      >
        {type.icon}
        {type.label}
      </button>
    ))}
  </div>
);

export default TripTypeFilter;
