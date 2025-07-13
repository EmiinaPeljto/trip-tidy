import React from "react";
import { Link } from "react-router-dom";

const ItineraryCard = ({ itinerary }) => {
  const {
    image,
    trip_title,
    destination,
    description = "",
    tags = [],
  } = itinerary;

  return (
    <div className="relative max-w-xs w-full rounded-xl overflow-hidden shadow group hover:shadow-lg transition-shadow duration-300 bg-white">
      <div className="relative h-32 overflow-hidden">
        <img
          src={image || "https://via.placeholder.com/400x300"}
          alt={trip_title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
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
        <p
          className="mt-1 text-xs text-gray-600 line-clamp-2"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "2.5em",
            maxHeight: "2.5em",
          }}
          title={description}
        >
          {description}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link
          to={`/itinerary-details/${itinerary.id}`}
          className="mt-3 w-full py-1.5 bg-[#5AB1F5] text-white rounded-lg text-xs hover:bg-[#4098db] transition block text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ItineraryCard;
