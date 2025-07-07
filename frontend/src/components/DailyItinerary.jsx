import React, { useState } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaMapMarkerAlt,
  FaRegClock,
  FaImage,
} from 'react-icons/fa';

const DailyItinerary = ({ itineraryDays }) => {
  const [openDay, setOpenDay] = useState(0); // Open the first day by default

  if (!itineraryDays || itineraryDays.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-500 text-center">Your daily itinerary will appear here.</p>
      </div>
    );
  }

  const toggleDay = (index) => {
    setOpenDay(openDay === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {itineraryDays.map((day, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <button
            onClick={() => toggleDay(index)}
            className="w-full flex justify-between items-center p-5 text-left font-bold text-xl text-gray-800 focus:outline-none"
          >
            <span>Day {day.day}</span>
            {openDay === index ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {openDay === index && (
            <div className="px-5 pb-5">
              {/* Activities List */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Activities</h3>
                <ul className="space-y-2">
                  {day.activities.map((activity, i) => (
                    <li key={i} className="flex items-center text-gray-600">
                      <FaRegClock className="mr-3 text-blue-500" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Places to Visit */}
              {day.places && day.places.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Places to Visit</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {day.places.map((place, i) => {
                      const hasImage = !!place.image;

                      return (
                        <a
                          href={place.details_url || '#'}
                          key={i}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group block bg-white rounded-lg shadow-sm overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                        >
                          <div className="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                            {hasImage ? (
                              <img
                                src={place.image}
                                alt={place.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = ''; // fallback to placeholder block
                                }}
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-gray-400">
                                <FaImage className="text-4xl mb-2" />
                                <span className="text-sm">No Image Available</span>
                              </div>
                            )}

                            {hasImage && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-4">
                                <h4 className="text-white font-bold text-md truncate">{place.name}</h4>
                              </div>
                            )}
                          </div>

                          {!hasImage && (
                            <div className="p-4">
                              <h4 className="font-semibold text-gray-800 text-md truncate">{place.name}</h4>
                            </div>
                          )}
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DailyItinerary;
