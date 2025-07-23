import React, { useState, useEffect } from "react";
import useStockItineraries from "../hooks/useStockItineraries";
import ItineraryCard from "../components/ItineraryCard";
import SearchBar from "../components/SearchBar";
import TripTypeFilter from "../components/TripTypeFilter";

const GuidePage = () => {
  const { itineraries, loading, error } = useStockItineraries();
  const [filteredItineraries, setFilteredItineraries] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTripType, setSelectedTripType] = useState(null);

  useEffect(() => {
    if (itineraries) {
      setFilteredItineraries(itineraries);
    }
  }, [itineraries]);

  // Live search effect
  useEffect(() => {
    if (!itineraries) return;
    let filtered = itineraries;
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((itinerary) =>
        itinerary.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedTag) {
      filtered = filtered.filter((itinerary) =>
        itinerary.tags?.includes(selectedTag)
      );
    }
    if (selectedTripType) {
      filtered = filtered.filter(
        (itinerary) => itinerary.trip_type === selectedTripType
      );
    }
    setFilteredItineraries(filtered);
  }, [searchTerm, selectedTag, selectedTripType, itineraries]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleClearFilters = () => {
    setSelectedTag(null);
    setSearchTerm("");
    setSelectedTripType(null);
  };

  return (
    <div className="guide-page">
      {/* Hero Section */}
      <header className="relative flex flex-col items-center justify-center min-h-[320px] text-center mt-6 overflow-hidden px-2 sm:px-4">
        {/* Header Content */}
        <div className="z-10 w-full max-w-2xl flex flex-col items-center">
          <h1 className="text-4xl xs:text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
            Trip <span className="text-[#5AB1F5]">Guide</span>
          </h1>
          <p className="text-base xs:text-lg md:text-xl font-medium text-gray-600 mb-4 xs:mb-8">
            Explore top destinations with expertly crafted travel plans powered
            by AI.
          </p>
          {/* Responsive SearchBar */}
          <div className="w-full">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          </div>
        </div>
      </header>

      <main className="py-8 xs:py-12">
        <div className="max-w-[1440px] mx-auto px-2 xs:px-4 md:px-8">
          {/* Responsive Filter Section */}
          <div className="flex flex-col xs:flex-row flex-wrap xs:justify-between xs:items-center mb-6 gap-2 xs:gap-4">
            <div className="flex flex-col xs:flex-row gap-2 flex-wrap items-center">
              <TripTypeFilter
                selectedTripType={selectedTripType}
                onSelect={setSelectedTripType}
              />
              <button
                className="text-sm underline text-gray-500 mt-1 xs:mt-0"
                onClick={handleClearFilters}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Itinerary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error loading itineraries.</p>
            ) : filteredItineraries.length === 0 ? (
              <p className="text-gray-500 text-center col-span-full">
                No itineraries found.
              </p>
            ) : (
              filteredItineraries.map((itinerary) => (
                <ItineraryCard key={itinerary.id} itinerary={itinerary} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GuidePage;
