import React, { useState, useRef, useEffect } from "react";
import useGetPreferences from "../hooks/useGetPreferences";
import {
  FaMountain, // For Adventure
  FaSpa, // For Relaxation
  FaLandmark, // For Culture
  FaUtensils, // For Foodie
  FaCocktail, // For Nightlife
  FaUsers, // For Family Friendly
  FaPiggyBank, // For Budget Friendly
  FaGem, // For Luxury
  FaTheaterMasks, // For Arts and Entertainment
} from "react-icons/fa";

const iconMap = {
  Adventure: <FaMountain size={40} />,
  Relaxation: <FaSpa size={40} />,
  Culture: <FaLandmark size={40} />,
  Foodie: <FaUtensils size={40} />,
  Nightlife: <FaCocktail size={40} />,
  "Family Friendly": <FaUsers size={40} />,
  "Budget Friendly": <FaPiggyBank size={40} />,
  Luxury: <FaGem size={40} />,
  "Arts and Entertainment": <FaTheaterMasks size={40} />,
};

const ItineraryThirdStepForm = ({ onNext, onBack, initialData = {} }) => {
  const { preferences, loading, error } = useGetPreferences();
  const [selectedPreferences, setSelectedPreferences] = useState(
    initialData.preferences || []
  );
  const sectionRef = useRef(null);

  useEffect(() => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleSelectPreference = (preferenceId) => {
    setSelectedPreferences(
      (prev) =>
        prev.includes(preferenceId)
          ? prev.filter((id) => id !== preferenceId) // Deselect
          : [...prev, preferenceId] // Select
    );
  };

  const handleGenerate = () => {
    if (onNext) {
      onNext({ preferences: selectedPreferences });
    }
  };

  if (loading) return <p>Loading preferences...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-white p-8">
      <div className="text-center w-full max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">
          Tailor Your Trip
        </h1>
        <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto">
          Tell us what you love! We'll shape your trip around your travel vibe,
          favorite activities, and comfort level.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {preferences.map((preference) => (
            <button
              key={preference.id}
              type="button"
              onClick={() => handleSelectPreference(preference.id)}
              className={`p-6 rounded-lg border-2 text-center transition-all duration-200 flex flex-col items-center justify-center gap-4 ${
                selectedPreferences.includes(preference.id)
                  ? "bg-[#5AB1F5] border-[#5AB1F5] text-white shadow-lg"
                  : "bg-white border-gray-300 hover:border-[#5AB1F5] hover:bg-gray-50"
              }`}
            >
              {iconMap[preference.name] || <FaUtensils size={40} />}
              <span className="text-lg font-semibold">{preference.name}</span>
            </button>
          ))}
        </div>

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
            onClick={handleGenerate}
            disabled={selectedPreferences.length === 0}
            className="w-40 h-10 rounded-full bg-[#5AB1F5] text-white text-sm font-semibold hover:bg-[#4098db] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Generate
          </button>
        </div>
      </div>
    </section>
  );
};

export default ItineraryThirdStepForm;
