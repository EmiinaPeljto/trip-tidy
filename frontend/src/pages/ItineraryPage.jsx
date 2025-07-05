import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import SideNavbar from '../components/SideNavbar';
import Map from '../components/Map';

const ItineraryPage = () => {
  const location = useLocation();
  const { itinerary } = location.state || {};

  // Dummy data for presentation with coordinates
  const dummyHotels = [
    { title: 'Grand Plaza Hotel', description: 'Luxury hotel with stunning city views.', location: '123 Main Street', rating: 4.8, imageUrl: '...', latitude: 40.7128, longitude: -74.0060 },
    { title: 'The Cozy Inn', description: 'A charming and affordable inn near downtown.', location: '456 Oak Avenue', rating: 4.5, imageUrl: '...', latitude: 40.7228, longitude: -74.0160 },
    { title: 'Seaside Resort', description: 'Relax by the beach in this beautiful resort.', location: '789 Beach Blvd', rating: 4.7, imageUrl: '...', latitude: 40.7028, longitude: -73.9960 },
  ];

  const dummyPlaces = [
    { title: 'Historic Museum', description: 'Explore the rich history of the region.', location: '101 Museum Drive', rating: 4.6, imageUrl: '...', latitude: 40.7328, longitude: -74.0010 },
    { title: 'Central Park', description: 'A perfect spot for a relaxing afternoon stroll.', location: '202 Park Lane', rating: 4.9, imageUrl: '...', latitude: 40.7829, longitude: -73.9654 },
    { title: 'The Food Market', description: 'Taste local delicacies and fresh produce.', location: '303 Market Street', rating: 4.8, imageUrl: '...', latitude: 40.7158, longitude: -73.9990 },
  ];

  const hotels = itinerary?.hotel_recommendations || dummyHotels;
  const places = itinerary?.place_recommendations || dummyPlaces;

  const mapMarkers = [...hotels, ...places].map(item => ({
    latitude: item.latitude,
    longitude: item.longitude,
    label: item.title,
  }));

  const mapCenter = {
    latitude: hotels[0]?.latitude || 40.7128,
    longitude: hotels[0]?.longitude || -74.0060,
  };

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
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* Side Navbar */}
      <div className="w-full md:w-1/4 md:h-full md:shadow-lg overflow-y-auto">
        <SideNavbar itinerary={itinerary} />
      </div>

      {/* Main Content */}
      <div className="w-full md:w-1/2 p-4 md:p-8 overflow-y-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">Your Itinerary for {itinerary.destination}</h1>
        
        <section id="travel-checklist" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Travel Checklist</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p>{itinerary.travel_checklist || 'Checklist items go here...'}</p>
          </div>
        </section>

        <section id="hotel-recommendations" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Hotel Recommendations</h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p>{itinerary.hotel_recommendations || 'Hotel cards go here...'}</p>
          </div>
        </section>

        <section id="flights" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Flights</h2>
           <div className="bg-white p-6 rounded-lg shadow-sm">
            <p>{itinerary.flights || 'Flight details go here...'}</p>
          </div>
        </section>

        <section id="place-recommendations" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Place Recommendations</h2>
           <div className="bg-white p-6 rounded-lg shadow-sm">
            <p>{itinerary.place_recommendations || 'Place cards go here...'}</p>
          </div>
        </section>

        <section id="itinerary-details" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Daily Itinerary</h2>
          {itinerary.itinerary_days && itinerary.itinerary_days.map((day, i) => (
            <div key={i} id={`day-${i + 1}`} className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Day {i + 1}</h3>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p>{day.activities || `Details for Day ${i + 1} go here...`}</p>
              </div>
            </div>
          ))}
        </section>

        <section id="budget" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Budget</h2>
           <div className="bg-white p-6 rounded-lg shadow-sm">
            <p>{itinerary.budget_summary || 'Budget details go here...'}</p>
          </div>
        </section>
      </div>

      {/* Map */}
      <div className="hidden md:block md:w-1/4 h-full">
        <Map center={mapCenter} markers={mapMarkers} />
      </div>
    </div>
  );
};

export default ItineraryPage;
