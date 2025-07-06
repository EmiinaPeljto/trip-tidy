import React, { useRef } from 'react';
import PlaceCard from './PlaceCard';

const PlaceRecommendations = ({ places }) => {
  if (!places || places.length === 0) {
    return <p className="text-gray-500">Place recommendations will appear here.</p>;
  }
 const scrollContainerRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto py-4 scroll-smooth scrollbar-hide"
      >
      {places.map((place, index) => (
        <PlaceCard key={index} place={place} />
      ))} 
      </div>
    </div>
  );
};

export default PlaceRecommendations;
