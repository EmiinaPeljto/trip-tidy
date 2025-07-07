import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import {
  FaCalendarAlt,
  FaClipboardList,
  FaHotel,
  FaPlane,
  FaMapMarkedAlt,
  FaMoneyBillWave,
  FaBars,
  FaArrowLeft
} from 'react-icons/fa';
import SideNavbar from '../components/SideNavbar';
import Map from '../components/Map';
import HotelRecommendations from '../components/HotelRecommendations';
import TravelChecklist from '../components/TravelChecklist';
import FlightRecommendations from '../components/FlightRecommendations';
import DailyItinerary from '../components/DailyItinerary';
import PlaceRecommendations from '../components/PlaceRecommendations';
import BudgetTracker from '../components/BudgetTracker';

const ItineraryPage = () => {
  const location = useLocation();
  const { itinerary } = location.state || {};

  const dummyFlights = itinerary?.flights || [];
  const hotels = itinerary?.hotel_recommendations || [];
  const places = itinerary?.place_recommendations || [];
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
      <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">No Itinerary Data</h1>
        <p className="text-gray-600 mb-6">It looks like you haven't generated an itinerary yet.</p>
        <Link to="/create-itinerary" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition">
          Create an Itinerary
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <aside className="hidden md:block w-64">
        <SideNavbar itinerary={itinerary} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-12">

          {/* Header Section */}
          <section className="bg-white p-8 rounded-xl border border-gray-200 shadow">
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-3">
              {itinerary.trip_title || `Your Amazing Trip to ${itinerary.destination}`}
            </h1>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              {itinerary.trip_description || 'An unforgettable journey filled with adventure, culture, and relaxation. Get ready to explore the best of what this destination has to offer!'}
            </p>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t pt-4 gap-4 text-sm text-gray-700">
              <div className="flex items-center bg-gray-100 border border-gray-200 px-4 py-2 rounded-xl">
                <FaCalendarAlt className="mr-2 text-gray-500" />
                <span>{`${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`}</span>
              </div>
              <div className="font-medium">
                <span>{numDays} {numDays > 1 ? 'Days' : 'Day'}</span>
              </div>
            </div>
          </section>

          {/* Travel Checklist */}
          <section id="travel-checklist">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center"><FaClipboardList className="mr-3 text-gray-500" />Travel Packing Checklist</h2>
            <TravelChecklist checklist={itinerary.checklist} />
          </section>

          {/* Hotels */}
          <section id="hotel-recommendations">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center"><FaHotel className="mr-3 text-gray-500" />Hotel Recommendations</h2>
            <HotelRecommendations hotels={hotels} />
          </section>

          {/* Flights */}
          <section id="flights">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center"><FaPlane className="mr-3 text-gray-500" />Flights</h2>
            <FlightRecommendations flights={flights} />
          </section>

          {/* Places */}
          <section id="place-recommendations">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center"><FaMapMarkedAlt className="mr-3 text-gray-500" />Place Recommendations</h2>
            <PlaceRecommendations places={places} />
          </section>

          {/* Daily Itinerary */}
          <section id="itinerary-details">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center"><FaCalendarAlt className="mr-3 text-gray-500" />Daily Itinerary</h2>
            <DailyItinerary itineraryDays={itinerary.itinerary.itineraryDays} />
          </section>

          {/* Budget */}
          <section id="budget">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center"><FaMoneyBillWave className="mr-3 text-gray-500" />Budget</h2>
            <BudgetTracker budget={itinerary.budget} />
          </section>
        </main>

        {/* Map View */}
        <aside className="hidden md:block w-1/3 p-4 bg-gray-100">
          <div className="sticky top-0 h-full flex flex-col">
            <div className="flex-grow rounded-lg overflow-hidden border border-gray-300 shadow-sm">
              <Map center={mapCenter} markers={mapMarkers} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ItineraryPage;
