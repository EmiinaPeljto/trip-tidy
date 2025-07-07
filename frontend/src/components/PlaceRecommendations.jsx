import React from 'react';
import PlaceCard from './PlaceCard';
import HorizontalScrollContainer from './HorizontalScrollContainer';

const PlaceRecommendations = ({ places }) => {
  if (!places || places.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-gray-500">
        No place recommendations available.
      </div>
    );
  }

  return (
    <div>
      <HorizontalScrollContainer items={places} title={`${places.length} places found based on your interests`}>
        {places.map((place, index) => (
          <PlaceCard key={index} place={place} />
        ))}
      </HorizontalScrollContainer>
    </div>
  );
};

export default PlaceRecommendations;
