import React from 'react';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const HotelCard = ({ hotel }) => {
  // Use the exact field names from your JSON data, with fallbacks.
  const { 
    title = 'Hotel Name',
    imageUrl,
    location = 'No address provided',
    rating = 'N/A',
    details_url = '#',
  } = hotel || {};

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/300x200?text=Hotel+Image';
  };

  return (
    <a
      href={details_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden m-2 transform hover:scale-105 transition-transform duration-300 ease-in-out block"
    >
      <img
        className="w-full h-40 object-cover"
        src={imageUrl || 'https://placehold.co/300x200?text=Hotel+Image'}
        alt={title}
        onError={handleImageError}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate" title={title}>
          {title}
        </h3>
        <div className="flex items-center text-sm text-gray-600 mt-2">
          <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
          <p className="truncate" title={location}>
            {location}
          </p>
        </div>
        <div className="flex items-center text-sm text-yellow-500 mt-2">
          <FaStar className="mr-2 flex-shrink-0" />
          <span>{rating}</span>
        </div>
      </div>
    </a>
  );
};

export default HotelCard;
