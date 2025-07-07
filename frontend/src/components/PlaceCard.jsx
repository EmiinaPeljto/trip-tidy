import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const placeholderImage = `data:image/svg+xml;charset=UTF-8,%3csvg width='400' height='300' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='none'%3e%3crect width='100%25' height='100%25' fill='%23cccccc'/%3e%3ctext x='50%25' y='50%25' fill='%23333333' dy='.3em' font-family='Arial, sans-serif' font-size='18' text-anchor='middle'%3eNo Image%3c/text%3e%3c/svg%3e`;

const PlaceCard = ({ place }) => {
  const {
    title = 'Place Name',
    imageUrl,
    location = 'No address provided',
    details_url = '#',
  } = place || {};

  const displayImage = imageUrl || placeholderImage;

  return (
    <a
      href={details_url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-64 flex-shrink-0 mr-6 bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group"
    >
      <div className="h-40 overflow-hidden">
      <img
  src={displayImage}
  alt={`Photo of ${title}`}
  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
  onError={e => { e.target.onerror = null; e.target.src = placeholderImage; }}
/>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 truncate">{title || 'Unnamed Place'}</h3>
        <div className="flex items-center mt-2 text-gray-500">
          <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
          <p className="text-sm truncate">{location || 'No location provided'}</p>
        </div>
      </div>
    </a>
  );
};

export default PlaceCard;
