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
      <header className="relative flex flex-col items-center justify-center min-h-[360px] text-center     mt-6 overflow-hidden">
        {/* Header Content */}
        <div className="z-10 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
            Trip <span className="text-[#5AB1F5]">Guide</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-gray-600 mb-8">
            Explore top destinations with expertly crafted travel plans powered
            by AI.
          </p>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>
      </header>

      <main className="py-12">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex gap-2 flex-wrap items-center">
              <TripTypeFilter
                selectedTripType={selectedTripType}
                onSelect={setSelectedTripType}
              />
              <button
                className="text-sm underline text-gray-500"
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
