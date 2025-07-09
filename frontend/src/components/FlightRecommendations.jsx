import React from "react";
import FlightCard from "./FlightCard";
import HorizontalScrollContainer from "./HorizontalScrollContainer";

const FlightRecommendations = ({ flights }) => {
  // If there are no flights, display a fallback message.
  if (!flights || flights.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
        <div className="mb-2 font-semibold text-gray-700">
          No flights found for your selected dates.
        </div>
        <div className="mb-2">Try the following:</div>
        <ul className="list-disc list-inside text-left text-gray-500 mb-2">
          <li>Change your departure or return dates</li>
          <li>Try a nearby airport</li>
          <li>Increase the number of days for your trip</li>
          <li>Check back later for new offers</li>
        </ul>
        
      </div>
      
    );
  }

  return (
    <div>
      <HorizontalScrollContainer
        items={flights}
        title={`${flights.length} flights found based on your preferences`}
      >
        {flights.map((flight, index) => (
          <FlightCard key={index} flight={flight} />
        ))}
      </HorizontalScrollContainer>
    </div>
  );
};

export default FlightRecommendations;
