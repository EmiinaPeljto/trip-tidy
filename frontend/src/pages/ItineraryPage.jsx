import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaHotel,
  FaPlane,
  FaMapMarkedAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import SideNavbar from "../components/SideNavbar";
import Map from "../components/Map";
import HotelRecommendations from "../components/HotelRecommendations";
import TravelChecklist from "../components/TravelChecklist";
import FlightRecommendations from "../components/FlightRecommendations";
import DailyItinerary from "../components/DailyItinerary";
import PlaceRecommendations from "../components/PlaceRecommendations";
import BudgetTracker from "../components/BudgetTracker";
import useSaveOrUpdateItinerary from "../hooks/useSaveOrUpdateItinerary";
import useFetchItinerary from "../hooks/useFetchItinerary";
import { successToast, errorToast } from "../../utils/toastUtil";

const ItineraryPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const initialItinerary = location.state?.itinerary || {};
  const [itinerary, setItinerary] = useState(initialItinerary);
  const [expenses, setExpenses] = useState(initialItinerary.expenses || []);
  const navigate = useNavigate();
  const [openDayIdx, setOpenDayIdx] = useState(0);

  // Fetch itinerary if id in URL and not loaded yet
  useEffect(() => {
    if (id && (!itinerary.id || itinerary.id !== Number(id))) {
      fetchItinerary(id).then((data) => {
        if (data) {
          setItinerary(data);
          setExpenses(data.expenses || []);
        }
      });
    }
    // eslint-disable-next-line
  }, [id]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const user_id = user.id || itinerary?.user_id;

  const { saveOrUpdateItinerary } = useSaveOrUpdateItinerary();
  const { fetchItinerary } = useFetchItinerary();

  const hotels = itinerary?.hotel_recommendations || [];
  const places =
    itinerary?.place_recommendations?.length > 0
      ? itinerary.place_recommendations
      : itinerary.places || [];
  const flights = itinerary?.flights || [];

  const hotelMarkers = (hotels || [])
    .filter(
      (hotel) =>
        hotel.coordinates &&
        typeof hotel.coordinates.lat === "number" &&
        typeof hotel.coordinates.lng === "number"
    )
    .map((hotel) => ({
      position: [hotel.coordinates.lat, hotel.coordinates.lng],
      popupContent: hotel.title,
      imageUrl: hotel.imageUrl,
      detailsUrl: hotel.details_url,
      type: "hotel",
    }));

  const placeMarkers = (places || [])
    .filter(
      (place) =>
        place.coordinates &&
        typeof place.coordinates.lat === "number" &&
        (typeof place.coordinates.lng === "number" ||
          typeof place.coordinates.lon === "number")
    )
    .map((place) => ({
      position: [
        place.coordinates.lat,
        typeof place.coordinates.lng === "number"
          ? place.coordinates.lng
          : place.coordinates.lon,
      ],
      popupContent: place.title,
      imageUrl: place.imageUrl,
      detailsUrl: place.details_url,
      type: "place",
    }));

  const mapMarkers = [...hotelMarkers, ...placeMarkers];

  const mapCenter =
    hotelMarkers.length > 0
      ? hotelMarkers[0].position
      : placeMarkers.length > 0
      ? placeMarkers[0].position
      : [43.8563, 18.4131]; // Default: Sarajevo

  const startDate = itinerary?.start_date
    ? new Date(itinerary.start_date)
    : new Date();
  const endDate = itinerary?.end_date
    ? new Date(itinerary.end_date)
    : new Date();
  const numDays = differenceInDays(endDate, startDate) + 1;

  // Save itinerary and refresh from backend
  const handleSaveItinerary = async () => {
    const payload = {
      id: itinerary.id,
      user_id,
      destination: itinerary.destination || "",
      start_date: itinerary.start_date
        ? format(new Date(itinerary.start_date), "yyyy-MM-dd")
        : "",
      end_date: itinerary.end_date
        ? format(new Date(itinerary.end_date), "yyyy-MM-dd")
        : "",
      adults: itinerary.adults || 1,
      budget: itinerary.budget,
      trip_type: itinerary.trip_type,
      trip_title: itinerary.trip_title,
      description: itinerary.description || "",
      packing_notes: itinerary.checklist,
      total_days: numDays,
      accommodation: itinerary.hotel_recommendations,
      transportation_details: itinerary.flights,
      places: itinerary.place_recommendations,
      origin: itinerary.origin || "",
      image: itinerary.image || "",
      itineraryDays: itinerary.itinerary?.itineraryDays || [],
      expenses,
    };

    const result = await saveOrUpdateItinerary(payload);
    if (result && result.itinerary_id) {
      // Fetch the updated itinerary from backend and update state
      const updated = await fetchItinerary(result.itinerary_id);
      if (updated) {
        setItinerary(updated);
        setExpenses(updated.expenses || []);
        navigate(`/itinerary/${result.itinerary_id}`, { replace: true });
      }
      successToast("Itinerary saved successfully!");
    } else {
      errorToast("Failed to save itinerary.");
    }
  };

  if (!itinerary || !itinerary.id) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          No Itinerary Data
        </h1>
        <p className="text-gray-600 mb-6">
          It looks like you haven't generated an itinerary yet.
        </p>
        <Link
          to="/create-itinerary"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition"
        >
          Create an Itinerary
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <aside className="hidden md:block w-64">
        <SideNavbar
          itinerary={itinerary}
          onSave={handleSaveItinerary}
          onDaySelect={setOpenDayIdx}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-12">
          {/* Header Section */}
          <section
            className="relative w-full flex items-center justify-center mb-8"
            style={{
              minHeight: 340,
              backgroundImage: `url(${
                itinerary.image ||
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "1.5rem",
              overflow: "hidden",
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
            }}
          >
            {/* Decorative X lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <line
                x1="0"
                y1="0"
                x2="100"
                y2="100"
                stroke="#fff"
                strokeWidth="1.5"
                strokeOpacity="0.25"
              />
              <line
                x1="100"
                y1="0"
                x2="0"
                y2="100"
                stroke="#fff"
                strokeWidth="1.5"
                strokeOpacity="0.25"
              />
            </svg>

            {/* Overlay for darkening the image */}
            <div className="absolute inset-0 bg-black/30 z-10" />

            {/* Centered info card */}
            <div className="relative z-20 flex justify-center w-full">
              <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-2xl mx-4 my-12 flex flex-col gap-2 border border-gray-100">
                <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-2 text-center">
                  {itinerary.trip_title ||
                    `Your Amazing Trip to ${itinerary.destination}`}
                </h1>
                <p className="text-gray-700 mb-3 text-center">
                  {itinerary.description || "No description yet."}
                </p>
                <div className="flex flex-row items-center justify-between border-t pt-4 gap-4 text-sm text-gray-700">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-500" />
                    <span>
                      {`${format(startDate, "MMM d, yyyy")} - ${format(
                        endDate,
                        "MMM d, yyyy"
                      )}`}
                    </span>
                  </div>
                  <div className="font-medium flex items-center">
                    <span className="mr-1">Days:</span>
                    <span>{numDays}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Travel Checklist */}
          <section id="travel-checklist">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <FaClipboardList className="mr-3 text-[#5AB1F5]" />
              Travel Packing Checklist
            </h2>
            <TravelChecklist
              checklist={itinerary.checklist}
              editable={true}
              onChecklistChange={(updated) =>
                setItinerary((prev) => ({ ...prev, checklist: updated }))
              }
            />
          </section>

          {/* Hotels */}
          <section id="hotel-recommendations">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <FaHotel className="mr-3 text-[#5AB1F5]" />
              Hotel Recommendations
            </h2>
            <HotelRecommendations hotels={hotels} />
          </section>

          {/* Flights */}
          <section id="flights">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <FaPlane className="mr-3 text-[#5AB1F5]" />
              Flights
            </h2>
            <FlightRecommendations flights={flights} />
          </section>

          {/* Places */}
          <section id="place-recommendations">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <FaMapMarkedAlt className="mr-3 text-[#5AB1F5]" />
              Place Recommendations
            </h2>
            <PlaceRecommendations places={places} />
          </section>

          {/* Daily Itinerary */}
          <section id="itinerary-details">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <FaCalendarAlt className="mr-3 text-[#5AB1F5]" />
              Daily Itinerary
            </h2>
            <DailyItinerary
              itineraryDays={itinerary.itinerary?.itineraryDays || []}
              editable={true}
              openDay={openDayIdx}
              setOpenDay={setOpenDayIdx}
              onItineraryDaysChange={(updatedDays) =>
                setItinerary((prev) => ({
                  ...prev,
                  itinerary: {
                    ...prev.itinerary,
                    itineraryDays: updatedDays,
                  },
                }))
              }
              recommendedPlaces={places} // Pass your 20 places here
            />
          </section>

          {/* Budget */}
          <section id="budget">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <FaMoneyBillWave className="mr-3 text-[#5AB1F5]" />
              Budget
            </h2>
            <BudgetTracker
              budget={itinerary.budget}
              setBudget={(budget) =>
                setItinerary((prev) => ({ ...prev, budget }))
              }
              expenses={expenses}
              setExpenses={setExpenses}
            />
          </section>
        </main>

        {/* Map View */}
        <aside className="hidden md:block w-1/3  bg-gray-100">
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
