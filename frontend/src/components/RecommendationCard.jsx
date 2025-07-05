import React from 'react';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const RecommendationCard = ({ imageUrl, title, description, location, rating }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0; // Future use

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
      } else {
        stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400">Image Placeholder</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{title}</h3>
        <p className="text-sm text-gray-600 mb-3 h-10 overflow-hidden">{description}</p>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
          <span className="truncate">{location}</span>
        </div>
        <div className="flex items-center">
          {renderStars()}
          <span className="text-sm text-gray-500 ml-2">{rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
