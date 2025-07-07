import React from 'react';
import HotelCard from './HotelCard';
import HorizontalScrollContainer from './HorizontalScrollContainer';

const HotelRecommendations = ({ hotels }) => {
  if (!hotels || hotels.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-gray-500">
        No hotel recommendations available.
      </div>
    );
  }

  return (
    <div>
      <HorizontalScrollContainer items={hotels} title={`${hotels.length} hotels found based on your interests`}>
        {hotels.map((hotel, index) => (
          <HotelCard key={index} hotel={hotel} />
        ))}
      </HorizontalScrollContainer>
    </div>
  );
};

export default HotelRecommendations;
