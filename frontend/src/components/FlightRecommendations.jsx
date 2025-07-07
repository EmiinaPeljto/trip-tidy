import React from 'react';
import FlightCard from './FlightCard';

const FlightRecommendations = ({ flights }) => {
  // If there are no flights, display a fallback message.
  if (!flights || flights.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
        No flight recommendations available.
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4">
      {flights.map((flight, index) => (
        <div key={index} className="flex-shrink-0">
          <FlightCard flight={flight} />
        </div>
      ))}
    </div>
  );
};

export default FlightRecommendations;
