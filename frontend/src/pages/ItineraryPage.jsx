import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { FaCalendarAlt, FaBars, FaArrowLeft } from 'react-icons/fa';
import SideNavbar from '../components/SideNavbar';
import Map from '../components/Map';
import HotelRecommendations from '../components/HotelRecommendations';
import TravelChecklist from '../components/TravelChecklist';
import FlightRecommendations from '../components/FlightRecommendations';
import DailyItinerary from '../components/DailyItinerary';
import PlaceRecommendations from '../components/PlaceRecommendations';

const ItineraryPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { itinerary } = location.state || {};


  const dummyFlights = itinerary.flights || [];

  const hotels = itinerary?.hotel_recommendations || dummyHotels;
  const places = itinerary?.place_recommendations || dummyPlaces;
  const flights = itinerary?.flights || dummyFlights;

  const mapMarkers = [...hotels, ...places].map(item => ({
    latitude: item.latitude,
    longitude: item.longitude,
    label: item.title,
  }));

  const mapCenter = {
    latitude: hotels[0]?.latitude || 40.7128,
    longitude: hotels[0]?.longitude || -74.0060,
  };

  const startDate = itinerary?.start_date ? new Date(itinerary.start_date) : new Date();
  const endDate = itinerary?.end_date ? new Date(itinerary.end_date) : new Date();
  const numDays = differenceInDays(endDate, startDate) + 1;

  if (!itinerary) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold mb-4">No Itinerary Data</h1>
        <p className="mb-8">It looks like you haven't generated an itinerary yet.</p>
        <Link to="/create-itinerary" className="bg-[#5AB1F5] hover:bg-[#4098db] text-white font-bold py-3 px-6 rounded-full shadow-md transition">
          Create an Itinerary
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Integrated Sidebar and Toggle Button */}
      <div
        className={`relative bg-white shadow-lg transition-all duration-300 ease-in-out h-full flex flex-col p-4
          ${isSidebarOpen ? 'w-full md:w-1/4' : 'w-20 items-center'}`}
      >
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="bg-gray-100 p-3 rounded-full text-gray-600 hover:bg-gray-200 focus:outline-none mb-4"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? <FaArrowLeft /> : <FaBars />}
        </button>

        <div className={isSidebarOpen ? 'block' : 'hidden'}>
          <SideNavbar itinerary={itinerary} />
        </div>
      </div>

      {/* Main Content & Map Wrapper */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <section className="bg-white p-8 rounded-lg shadow-md text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
              {itinerary.trip_title || `Your Amazing Trip to ${itinerary.destination}`}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              {itinerary.trip_description || 'An unforgettable journey filled with adventure, culture, and relaxation. Get ready to explore the best of what this destination has to offer!'}
            </p>
            <div className="flex justify-between items-center text-gray-500 border-t pt-4">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                <span>{`${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`}</span>
              </div>
              <div>
                <span>{numDays} {numDays > 1 ? 'Days' : 'Day'}</span>
              </div>
            </div>
          </section>

          <section id="travel-checklist" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Travel Checklist</h2>
            <TravelChecklist checklist={itinerary.checklist} />
          </section>

          <section id="hotel-recommendations" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Hotel Recommendations</h2>
            <HotelRecommendations hotels={hotels} />
          </section>

          <section id="flights" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Flights</h2>
            <FlightRecommendations flights={flights} />
          </section>

          <section id="place-recommendations" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Place Recommendations</h2>
            <PlaceRecommendations places={places} />
          </section>

          <section id="itinerary-details" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Daily Itinerary</h2>
            <DailyItinerary itineraryDays={itinerary.itinerary.itineraryDays} />
          </section>

          <section id="budget" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Budget</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <p>Budget details will be displayed here.</p>
            </div>
          </section>
        </main>

        {/* Map View */}
        <aside className="hidden md:block w-1/3 p-4 bg-gray-100">
          <div className="sticky top-0 h-full flex flex-col">
            <div className="flex-grow rounded-lg overflow-hidden shadow-md">
              <Map center={mapCenter} markers={mapMarkers} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ItineraryPage;
