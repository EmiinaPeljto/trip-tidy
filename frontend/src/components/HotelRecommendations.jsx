import React, { useRef } from 'react';
import HotelCard from './HotelCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const HotelRecommendations = ({ hotels }) => {
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
        {hotels.map((hotel, index) => (
          <HotelCard key={index} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default HotelRecommendations;
