import React, { useState, useEffect } from 'react';
import { FaUser, FaUsers, FaUserFriends, FaHeart } from 'react-icons/fa';

const tripTypes = [
  { id: 'solo', label: 'Solo', icon: <FaUser size={40} /> },
  { id: 'family', label: 'Family', icon: <FaUsers size={40} /> },
  { id: 'friends', label: 'Friends', icon: <FaUserFriends size={40} /> },
  { id: 'couple', label: 'Couple', icon: <FaHeart size={40} /> },
];

const ItinerarySecondStepForm = ({ onNext, onBack, initialData = {} }) => {
  const [tripType, setTripType] = useState(initialData.tripType || '');
  const [adults, setAdults] = useState(initialData.adults || 1);

  useEffect(() => {
    if (tripType === 'solo') {
      setAdults(1);
    } else if (tripType === 'couple') {
      setAdults(2);
    } else if (tripType === 'friends' && adults < 1) {
      setAdults(1);
    } else if (tripType === 'family' && adults < 2) {
      setAdults(2);
    }
  }, [tripType]);

  const handleNext = () => {
    if (onNext) {
      onNext({ tripType, adults });
    }
  };

  const showAdultsInput = tripType === 'family' || tripType === 'friends';

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-white p-8">
      <div className="text-center w-full max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">
          Create unforgettable memories—solo or with others.
        </h1>
        <p className="mt-3 text-gray-600 text-lg">
          Tell us who you're traveling with so we can personalize your journey.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {tripTypes.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTripType(id)}
              className={`p-6 rounded-lg border-2 text-left transition-all duration-200 flex flex-col items-center justify-center gap-4 ${ 
                tripType === id
                  ? 'bg-[#5AB1F5] border-[#5AB1F5] text-white shadow-lg'
                  : 'bg-white border-gray-300 hover:border-[#5AB1F5] hover:bg-gray-50'
              }`}
            >
              {icon}
              <span className="text-lg font-semibold">{label}</span>
            </button>
          ))}
        </div>

        {showAdultsInput && (
          <div className="mt-8 max-w-xs mx-auto text-left">
            <label htmlFor="adults" className="block mb-2 text-sm font-medium text-gray-700">
              Number of adults
            </label>
            <input
              type="number"
              id="adults"
              name="adults"
              min={tripType === 'family' ? 2 : 1}
              value={adults}
              onChange={(e) => setAdults(parseInt(e.target.value, 10) || (tripType === 'family' ? 2 : 1))}
              required
              className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm focus:border-[#5AB1F5] focus:outline-none"
            />
          </div>
        )}

        <div className="mt-10 flex justify-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-40 h-10 rounded-full bg-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-300 transition"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!tripType}
            className="w-40 h-10 rounded-full bg-[#5AB1F5] text-white text-sm font-semibold hover:bg-[#4098db] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ItinerarySecondStepForm;
