import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaHotel,
  FaMapMarkedAlt,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import Map from "../components/Map";
import HotelRecommendations from "../components/HotelRecommendations";
import TravelChecklist from "../components/TravelChecklist";
import PlaceRecommendations from "../components/PlaceRecommendations";
import DailyItinerary from "../components/DailyItinerary";
import useFetchItinerary from "../hooks/useFetchItinerary";
import useFavoriteItinerary from "../hooks/useFavoriteItinerary";
import { errorToast } from "../../utils/toastUtil";

const ItineraryGuidPage = () => {
  const { id } = useParams();
  const { fetchItinerary } = useFetchItinerary();
  const [itinerary, setItinerary] = useState(null);
  const [openDay, setOpenDay] = useState(0);

  // Get user from localStorage (adjust as needed for your auth)
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  // Fetch itinerary
  useEffect(() => {
    if (id) {
      fetchItinerary(id).then((data) => {
        if (data) setItinerary(data);
        else errorToast("Itinerary not found.");
      });
    }
    // eslint-disable-next-line
  }, [id]);

  const favoriteProps = useFavoriteItinerary(userId, itinerary?.id);

  // Check favorite status when itinerary or user changes (only if logged in)
  useEffect(() => {
    if (userId && itinerary?.id && favoriteProps?.checkFavorite) {
      favoriteProps.checkFavorite();
    }
    // eslint-disable-next-line
  }, [userId, itinerary?.id]);

  const handleToggleFavorite = () => {
    if (!userId) {
      errorToast("You must be logged in to favorite itineraries.");
      return;
    }
    if (favoriteProps.isFavorite) {
      favoriteProps.removeFavorite();
    } else {
      favoriteProps.addFavorite();
    }
  };

  if (!itinerary) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading itinerary...
      </div>
    );
  }

  const hotels = itinerary.hotel_recommendations || [];
  const places =
    itinerary.place_recommendations?.length > 0
      ? itinerary.place_recommendations
      : itinerary.places || [];

  const hotelMarkers = (hotels || [])
    .filter(
      (hotel) =>
        hotel.coordinates &&
        typeof hotel.coordinates.lat === "number" &&
        typeof hotel.coordinates.lng === "number"
    )
    .map((hotel) => ({
      position: [hotel.coordinates.lat, hotel.coordinates.lng],
      popupContent: hotel.title || hotel.name,
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
      popupContent: place.title || place.name,
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

  return (
    <div className="flex h-screen ">
      {/* Left: Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto p-12">
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
          {/* Centered info card */}
          <div className="relative z-20 flex justify-center w-full">
            <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-2xl mx-4 my-12 flex flex-col gap-2 border border-gray-100">
              {/* Heart icon in top right of the card */}
              {userId && favoriteProps && (
                <button
                  onClick={handleToggleFavorite}
                  className="absolute top-6 right-6 z-30 hover:scale-110 transition"
                  title={
                    favoriteProps.isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                  disabled={favoriteProps.favLoading}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                  }}
                >
                  {favoriteProps.isFavorite ? (
                    <FaHeart className="text-[#F43F5E] text-2xl" />
                  ) : (
                    <FaRegHeart className="text-gray-400 text-2xl" />
                  )}
                </button>
              )}
              <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-2 text-center">
                {itinerary.trip_title || `Trip to ${itinerary.destination}`}
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

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 space-y-12 max-w-3xl mx-auto w-full">
          {/* Travel Checklist */}
          <section id="travel-checklist">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <FaClipboardList className="mr-3 text-[#5AB1F5]" />
              Travel Packing Checklist
            </h2>
            <TravelChecklist checklist={itinerary.checklist} editable={false} />
          </section>

          {/* Hotels */}
          <section id="hotel-recommendations">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <FaHotel className="mr-3 text-[#5AB1F5]" />
              Hotel Recommendations
            </h2>
            <HotelRecommendations hotels={hotels} />
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
              editable={false}
              openDay={openDay}
              setOpenDay={setOpenDay}
              recommendedPlaces={places}
            />
          </section>
        </main>
      </div>

      {/* Right: Map (fixed/sticky, full height) */}
      <aside className="hidden md:flex w-[420px] bg-gray-100 h-screen sticky top-0 right-0 flex-col">
        <div className="flex-1 rounded-lg overflow-hidden border border-gray-300 shadow-sm bg-white min-h-[400px]">
          <Map center={mapCenter} markers={mapMarkers} />
        </div>
      </aside>
    </div>
  );
};

export default ItineraryGuidPage;
