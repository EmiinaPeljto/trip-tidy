import React from "react";
import HotelCard from "./HotelCard";
import HorizontalScrollContainer from "./HorizontalScrollContainer";

const HotelRecommendations = ({ hotels }) => {
  if (!hotels || hotels.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center text-gray-500">
        <div className="mb-2 font-semibold text-gray-700">
          No hotel recommendations available for your selected destination and
          dates.
        </div>
        <div className="mb-2">Try the following:</div>
        <ul className="list-disc list-inside text-left text-gray-500 mb-2">
          <li>Change your travel dates</li>
          <li>Try a different destination or area</li>
          <li>Increase your budget or adjust preferences</li>
          <li>Check back later for new offers</li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      <HorizontalScrollContainer
        items={hotels}
        title={`${hotels.length} hotels found based on your interests`}
      >
        {hotels.map((hotel, index) => (
          <HotelCard key={index} hotel={hotel} />
        ))}
      </HorizontalScrollContainer>
    </div>
  );
};

export default HotelRecommendations;
