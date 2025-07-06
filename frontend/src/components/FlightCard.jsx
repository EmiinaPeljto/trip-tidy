import React from 'react';
import { FaPlaneDeparture, FaPlaneArrival, FaArrowRight } from 'react-icons/fa';

const FlightCard = ({ flight }) => {
  const { price, airline, outbound, 'return': returnFlight, details_url } = flight || {};

  const formatTime = (dateTime) => {
    if (!dateTime) return 'N/A';
    return new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderSegment = (segment, index) => (
    <div key={index} className="flex items-center justify-between text-sm">
      <div className="flex items-center space-x-2">
        <FaPlaneDeparture className="text-gray-400" />
        <div className="text-left">
          <p className="font-bold text-gray-800">{segment.departure_airport}</p>
          <p className="text-xs text-gray-500">{formatTime(segment.departure_time)}</p>
        </div>
      </div>
      <div className="flex-grow flex justify-center">
        <FaArrowRight className="text-gray-300" />
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-right">
          <p className="font-bold text-gray-800">{segment.arrival_airport}</p>
          <p className="text-xs text-gray-500">{formatTime(segment.arrival_time)}</p>
        </div>
        <FaPlaneArrival className="text-gray-400" />
      </div>
    </div>
  );

  const renderJourney = (title, segments) => {
    if (!segments || segments.length === 0) return null;
    return (
      <div>
        <h4 className="text-md font-semibold text-gray-600 mb-3">{title}</h4>
        <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
          {segments.map(renderSegment)}
        </div>
      </div>
    );
  };

  if (!outbound || outbound.length === 0) {
    return (
      <div className="w-80 flex-shrink-0 p-4 bg-white rounded-lg shadow-md text-center text-gray-500">
        Flight details not available.
      </div>
    );
  }

  return (
    <div className="w-80 flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:-translate-y-1">
      <div className="p-5">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <p className="text-lg font-bold text-gray-900">{airline || 'Airline'}</p>
          <p className="text-lg font-bold text-green-500">{price ? `$${parseFloat(price).toFixed(2)}` : 'N/A'}</p>
        </div>
        <div className="space-y-5">
          {renderJourney('Outbound', outbound)}
          {renderJourney('Return', returnFlight)}
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
