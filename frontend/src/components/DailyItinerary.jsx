import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaPlus,
  FaTrash,
  FaImage,
  FaRegClock,
} from "react-icons/fa";
import PlaceSelectModal from "./PlaceSelectionModal";

const DailyItinerary = ({
  itineraryDays = [],
  editable = false,
  onItineraryDaysChange,
  recommendedPlaces = [],
  openDay = 0,
  setOpenDay
}) => {
  const [activityInput, setActivityInput] = useState({});
  const [editingActivity, setEditingActivity] = useState({});
  const [showPlaceModal, setShowPlaceModal] = useState({});
  const [placeSearch, setPlaceSearch] = useState({});
  const [editingPlace, setEditingPlace] = useState({});

  if (!Array.isArray(itineraryDays) || itineraryDays.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-gray-500 text-center">
          Your daily itinerary will appear here.
        </p>
      </div>
    );
  }

  const toggleDay = (index) => setOpenDay(openDay === index ? null : index);

  // --- Activity Handlers ---
  const handleAddActivity = (dayIdx) => {
    const value = (activityInput[dayIdx] || "").trim();
    if (!value) return;
    const updatedDays = itineraryDays.map((day, idx) =>
      idx === dayIdx ? { ...day, activities: [...day.activities, value] } : day
    );
    onItineraryDaysChange(updatedDays);
    setActivityInput((prev) => ({ ...prev, [dayIdx]: "" }));
  };

  const handleRemoveActivity = (dayIdx, actIdx) => {
    const updatedDays = itineraryDays.map((day, idx) =>
      idx === dayIdx
        ? { ...day, activities: day.activities.filter((_, i) => i !== actIdx) }
        : day
    );
    onItineraryDaysChange(updatedDays);
  };

  const handleActivityEdit = (dayIdx, actIdx, value) => {
    setEditingActivity({ dayIdx, actIdx, value });
  };

  const handleActivityEditChange = (e, dayIdx, actIdx) => {
    setEditingActivity({ dayIdx, actIdx, value: e.target.value });
  };

  const handleActivityEditBlur = (dayIdx, actIdx) => {
    const value = (editingActivity.value || "").trim();
    if (value) {
      const updatedDays = itineraryDays.map((day, idx) =>
        idx === dayIdx
          ? {
              ...day,
              activities: day.activities.map((a, i) =>
                i === actIdx ? value : a
              ),
            }
          : day
      );
      onItineraryDaysChange(updatedDays);
    }
    setEditingActivity({});
  };

  const handleActivityEditKeyDown = (e, dayIdx, actIdx) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  // --- Place Handlers ---
  const handleAddPlace = (dayIdx, placeObj) => {
    if (!placeObj) return;
    const newPlace = {
      name: placeObj.title,
      image: placeObj.imageUrl,
      details_url: placeObj.details_url,
      location: placeObj.location,
      coordinates: placeObj.coordinates,
    };
    const updatedDays = itineraryDays.map((day, idx) =>
      idx === dayIdx
        ? { ...day, places: [...(day.places || []), newPlace] }
        : day
    );
    onItineraryDaysChange(updatedDays);
    setShowPlaceModal((prev) => ({ ...prev, [dayIdx]: false }));
    setPlaceSearch((prev) => ({ ...prev, [dayIdx]: "" }));
  };

  const handleRemovePlace = (dayIdx, placeIdx) => {
    const updatedDays = itineraryDays.map((day, idx) =>
      idx === dayIdx
        ? { ...day, places: day.places.filter((_, i) => i !== placeIdx) }
        : day
    );
    onItineraryDaysChange(updatedDays);
  };

  const handlePlaceEdit = (dayIdx, placeIdx, value) => {
    setEditingPlace({ dayIdx, placeIdx, value });
  };

  const handlePlaceEditChange = (e, dayIdx, placeIdx) => {
    setEditingPlace({ dayIdx, placeIdx, value: e.target.value });
  };

  const handlePlaceEditBlur = (dayIdx, placeIdx) => {
    const value = (editingPlace.value || "").trim();
    if (value) {
      const updatedDays = itineraryDays.map((day, idx) =>
        idx === dayIdx
          ? {
              ...day,
              places: day.places.map((p, i) =>
                i === placeIdx ? { ...p, name: value } : p
              ),
            }
          : day
      );
      onItineraryDaysChange(updatedDays);
    }
    setEditingPlace({});
  };

  const handlePlaceEditKeyDown = (e, dayIdx, placeIdx) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  const openPlaceModal = (dayIdx) =>
    setShowPlaceModal((prev) => ({ ...prev, [dayIdx]: true }));
  const closePlaceModal = (dayIdx) =>
    setShowPlaceModal((prev) => ({ ...prev, [dayIdx]: false }));

  return (
    <div className="space-y-4">
      {itineraryDays.map((day, dayIdx) => (
        <div
          key={dayIdx}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <button
            onClick={() => toggleDay(dayIdx)}
            className="w-full flex justify-between items-center p-5 text-left font-bold text-xl text-gray-800 focus:outline-none"
          >
            <span>Day {day.day}</span>
            {openDay === dayIdx ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {openDay === dayIdx && (
            <div className="px-5 pb-5">
              {/* Activities List */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Activities
                </h3>
                <ul className="space-y-2">
                  {day.activities.map((activity, actIdx) => (
                    <li
                      key={actIdx}
                      className="flex items-center text-gray-600 group"
                      style={{ minHeight: 36 }}
                    >
                      <FaRegClock className="mr-3 text-blue-500" />
                      {editable &&
                      editingActivity.dayIdx === dayIdx &&
                      editingActivity.actIdx === actIdx ? (
                        <input
                          className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                          value={editingActivity.value}
                          autoFocus
                          onChange={(e) =>
                            handleActivityEditChange(e, dayIdx, actIdx)
                          }
                          onBlur={() => handleActivityEditBlur(dayIdx, actIdx)}
                          onKeyDown={(e) =>
                            handleActivityEditKeyDown(e, dayIdx, actIdx)
                          }
                        />
                      ) : (
                        <span
                          className={`flex-1 cursor-pointer ${
                            editable ? "hover:bg-blue-50 rounded px-1" : ""
                          }`}
                          onClick={() =>
                            editable &&
                            handleActivityEdit(dayIdx, actIdx, activity)
                          }
                        >
                          {activity}
                        </span>
                      )}
                      {editable && (
                        <button
                          className="ml-2 text-red-400 opacity-0 group-hover:opacity-100 transition"
                          onClick={() => handleRemoveActivity(dayIdx, actIdx)}
                          title="Remove"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </li>
                  ))}
                  {/* Add input at the end, just like TravelChecklist */}
                  {editable && (
                    <li className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="Add new activity..."
                        className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                        value={activityInput[dayIdx] || ""}
                        onChange={(e) =>
                          setActivityInput((prev) => ({
                            ...prev,
                            [dayIdx]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleAddActivity(dayIdx)
                        }
                      />
                      <button
                        onClick={() => handleAddActivity(dayIdx)}
                        className="flex items-center justify-center px-3 py-1 text-white bg-[#5AB1F5] rounded-md hover:bg-blue-600 transition"
                        title="Add"
                      >
                        <FaPlus />
                      </button>
                    </li>
                  )}
                </ul>
              </div>

              {/* Places to Visit */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Places to Visit
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(day.places || []).map((place, placeIdx) => {
                    const hasImage = !!place.image;
                    return (
                      <div
                        key={placeIdx}
                        className="relative group bg-white rounded-lg shadow-sm overflow-hidden"
                      >
                        <div className="relative h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                          {hasImage ? (
                            <img
                              src={place.image}
                              alt={place.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                              <FaImage className="text-4xl mb-2" />
                              <span className="text-sm">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex items-center">
                          {editable &&
                          editingPlace.dayIdx === dayIdx &&
                          editingPlace.placeIdx === placeIdx ? (
                            <input
                              className="border rounded px-2 py-1 mr-2 flex-1"
                              value={editingPlace.value}
                              autoFocus
                              onChange={(e) =>
                                handlePlaceEditChange(e, dayIdx, placeIdx)
                              }
                              onBlur={() =>
                                handlePlaceEditBlur(dayIdx, placeIdx)
                              }
                              onKeyDown={(e) =>
                                handlePlaceEditKeyDown(e, dayIdx, placeIdx)
                              }
                            />
                          ) : (
                            <span
                              className={`flex-1 font-semibold cursor-pointer ${
                                editable ? "hover:bg-blue-50 rounded px-1" : ""
                              }`}
                              onClick={() =>
                                editable &&
                                handlePlaceEdit(dayIdx, placeIdx, place.name)
                              }
                            >
                              {place.name}
                            </span>
                          )}
                          {editable && (
                            <button
                              className="ml-2 text-red-400 opacity-0 group-hover:opacity-100 transition"
                              onClick={() =>
                                handleRemovePlace(dayIdx, placeIdx)
                              }
                              title="Remove"
                            >
                              <FaTrash />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {editable && (
                  <>
                    <button
                      className="mt-3 px-4 py-2 bg-[#5AB1F5] text-white rounded hover:bg-blue-600 transition w-fit"
                      onClick={() => openPlaceModal(dayIdx)}
                    >
                      + Add Place
                    </button>
                    <PlaceSelectModal
                      open={!!showPlaceModal[dayIdx]}
                      onClose={() => closePlaceModal(dayIdx)}
                      onSelect={(p) => {
                        handleAddPlace(dayIdx, p);
                        closePlaceModal(dayIdx);
                      }}
                      recommendedPlaces={recommendedPlaces}
                      day={day.day}
                      dayIdx={dayIdx}
                      dayPlaces={day.places || []}
                      searchValue={placeSearch[dayIdx] || ""}
                      setSearchValue={(val) =>
                        setPlaceSearch((prev) => ({ ...prev, [dayIdx]: val }))
                      }
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DailyItinerary;
