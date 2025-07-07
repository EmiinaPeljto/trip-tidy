import React from 'react';
import FlightCard from './FlightCard';
import HorizontalScrollContainer from './HorizontalScrollContainer';

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
    <div>
      <HorizontalScrollContainer items={flights} title={`${flights.length} flights found based on your preferences`}>
        {flights.map((flight, index) => (
          <FlightCard key={index} flight={flight} />
        ))}
      </HorizontalScrollContainer>
    </div>
  );
};

export default FlightRecommendations;
