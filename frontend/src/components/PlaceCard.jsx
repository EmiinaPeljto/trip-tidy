import React from 'react';
import { FaMapMarkerAlt, FaImage } from 'react-icons/fa';

const PlaceCard = ({ place }) => {
  const {
    title = 'Place Name',
    imageUrl,
    location = 'No address provided',
    details_url = '#',
  } = place || {};

  const isImageAvailable = !!imageUrl;

  return (
    <a
      href={details_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-64 flex-shrink-0 mr-6 bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group"
    >
      <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {isImageAvailable ? (
          <img
            src={imageUrl}
            alt={`Photo of ${title}`}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = ''; // Trigger fallback rendering
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <FaImage className="text-4xl mb-2" />
            <span className="text-sm">No Image Available</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 truncate">{title}</h3>
        <div className="flex items-center mt-2 text-gray-500">
          <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
          <p className="text-sm truncate">{location}</p>
        </div>
      </div>
    </a>
  );
};

export default PlaceCard;
