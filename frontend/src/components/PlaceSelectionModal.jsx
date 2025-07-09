import React from "react";

const PlaceSelectModal = ({
  open,
  onClose,
  onSelect,
  recommendedPlaces = [],
  day,
  dayIdx,
  dayPlaces = [],
  searchValue,
  setSearchValue,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-4 p-6 relative overflow-hidden animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          aria-label="Close"
        >
          &times;
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Add a Place to Day {day}
        </h2>

        {/* Search Field */}
        <input
          className="w-full mb-5 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5AB1F5] focus:outline-none text-sm"
          placeholder="Search for a place..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        {/* Place List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto pr-2">
          {recommendedPlaces
            .filter(
              (p) =>
                !dayPlaces.some((dp) => dp.name === p.title) &&
                (!searchValue ||
                  p.title.toLowerCase().includes(searchValue.toLowerCase()))
            )
            .map((p, idx) => (
              <div
                key={idx}
                onClick={() => onSelect(p)}
                className="bg-white border rounded-xl cursor-pointer hover:shadow-lg transition duration-200 overflow-hidden group"
              >
                <div className="h-32 bg-gray-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-gray-800 truncate">
                    {p.title}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">{p.location}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PlaceSelectModal;
