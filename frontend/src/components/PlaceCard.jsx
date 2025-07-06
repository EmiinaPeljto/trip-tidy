import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const PlaceCard = ({ place }) => {
  // Use a fallback image if image_url is missing
  const imageUrl = place.image_url || 'https://placehold.co/400x300?text=Place';

  return (
    <a
      href={place.details_url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-64 flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group"
    >
      <div className="h-40 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={`Photo of ${place.name}`}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 truncate">{place.name || 'Unnamed Place'}</h3>
        <div className="flex items-center mt-2 text-gray-500">
          <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
          <p className="text-sm truncate">{place.location || 'No location provided'}</p>
        </div>
      </div>
    </a>
  );
};

export default PlaceCard;
