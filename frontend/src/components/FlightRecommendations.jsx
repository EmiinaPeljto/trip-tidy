import React from 'react';
import FlightCard from './FlightCard';

const FlightRecommendations = ({ flights }) => {
  // If there are no flights, display a fallback message.
  if (!flights || flights.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md text-center text-gray-500">
        No flight recommendations available.
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {flights.map((flight, index) => (
        <FlightCard key={index} flight={flight} />
      ))}
    </div>
  );
};

export default FlightRecommendations;
