import React from 'react';
import { FaPlane } from 'react-icons/fa';

const FlightCard = ({ flight }) => {
  const { price, outbound, 'return': returnFlight, details_url } = flight || {};

  const formatTime = (dateTime) => {
    if (!dateTime) return { time: 'N/A', period: '' };
    const date = new Date(dateTime);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const time = `${hours}:${minutes}`;
    return { time, period };
  };

  const formatDate = (dateTime) => {
    if (!dateTime) return '';
    return new Date(dateTime).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const calculateDuration = (departure, arrival) => {
    if (!departure || !arrival) return '';
    const diffMs = new Date(arrival) - new Date(departure);
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  const renderSegment = (segment) => {
    const departure = formatTime(segment.departure_time);
    const arrival = formatTime(segment.arrival_time);
    return (
      <div className="flex justify-between items-center w-full text-center">
        <div>
          <div className="text-xl font-bold">{departure.time}</div>
          <div className="font-semibold">{departure.period}</div>
          <div className="text-sm text-gray-500 mt-1 uppercase">{segment.departure_code || ''}</div>
        </div>

        <div className="flex flex-col items-center text-xs text-gray-400 mx-2">
          <FaPlane className="mb-1 text-[#5AB1F5]" />
          <div>{calculateDuration(segment.departure_time, segment.arrival_time)}</div>
          <div>Direct</div>
        </div>

        <div>
          <div className="text-xl font-bold">{arrival.time}</div>
          <div className="font-semibold">{arrival.period}</div>
          <div className="text-sm text-gray-500 mt-1 uppercase">{segment.arrival_code || ''}</div>
        </div>
      </div>
    );
  };

  if (!outbound || outbound.length === 0) {
    return (
      <div className="w-full max-w-xl p-6 bg-white rounded-lg border border-gray-200 text-center text-gray-500">
        Flight details not available.
      </div>
    );
  }

  return (
    <div className="w-96 flex bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="flex-grow p-4 space-y-4">
        {/* Outbound */}
        <div>
          <div className="text-xs text-gray-500 mb-2">
            {outbound[0]?.departure_time && formatDate(outbound[0].departure_time)} – Departure
          </div>
          {renderSegment(outbound[0])}
        </div>

        {/* Return */}
        {returnFlight && returnFlight.length > 0 && (
          <div>
            <div className="text-xs text-gray-500 mb-2 mt-4">
              {returnFlight[0]?.departure_time && formatDate(returnFlight[0].departure_time)} – Return
            </div>
            {renderSegment(returnFlight[0])}
          </div>
        )}
      </div>

      {/* Price and button */}
      <div className="w-32 bg-gray-50 flex flex-col justify-center items-center p-4 space-y-3 border-l border-gray-200">
        <div className="text-2xl font-bold">${price ? parseFloat(price).toFixed(0) : 'N/A'}</div>
        <a
          href={details_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#5AB1F5] hover:bg-[#4098db] text-white text-sm font-semibold px-4 py-2 rounded-md text-center"
        >
          Select this flight
        </a>
      </div>
    </div>
  );
};

export default FlightCard;
