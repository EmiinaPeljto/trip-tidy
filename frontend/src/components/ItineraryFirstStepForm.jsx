import React, { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format, addDays } from "date-fns";

const locations = [
  { value: "SJJ", label: "Sarajevo (SJJ)" },
  { value: "LON", label: "London (LON)" },
  { value: "NYC", label: "New York (NYC)" },
  { value: "PAR", label: "Paris (PAR)" },
  { value: "BER", label: "Berlin (BER)" },
  { value: "IST", label: "Istanbul (IST)" },
  { value: "ROM", label: "Rome (ROM)" },
  { value: "MAD", label: "Madrid (MAD)" },
  { value: "AMS", label: "Amsterdam (AMS)" },
  { value: "BCN", label: "Barcelona (BCN)" },
  { value: "VIE", label: "Vienna (VIE)" },
  { value: "ZRH", label: "Zurich (ZRH)" },
  { value: "ATH", label: "Athens (ATH)" },
  { value: "BUD", label: "Budapest (BUD)" },
  { value: "PRG", label: "Prague (PRG)" },
  { value: "DUB", label: "Dublin (DUB)" },
  { value: "BRU", label: "Brussels (BRU)" },
  { value: "CPH", label: "Copenhagen (CPH)" },
  { value: "MUC", label: "Munich (MUC)" },
  { value: "FCO", label: "Rome Fiumicino (FCO)" },
];

const ItineraryFirstStepForm = ({ onNext, initialData = {} }) => {
  const [formData, setFormData] = useState({
    origin: initialData.origin || "",
    destination: initialData.destination || "",
    budget: initialData.budget || "",
  });

  const [dateRange, setDateRange] = useState(
    initialData.dateRange
      ? [initialData.dateRange]
      : [
          {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: "selection",
          },
        ]
  );

  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const datePickerRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextClick = () => {
    const finalData = {
      ...formData,
      dateRange: dateRange[0],
    };
    if (onNext) onNext(finalData);
  };

  // Close date picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setDatePickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [datePickerRef]);

  // Safe date formatting
  const formatDateSafe = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return "";
    return format(d, "MM/dd/yyyy");
  };

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-white p-8">
      <div className="text-center w-full max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">
          Let us take care of everything for your perfect trip!
        </h1>
        <p className="mt-3 text-gray-600 text-lg">Help us tailor your trip</p>

        <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 items-start">
          {/* Origin */}
          <div className="flex flex-col text-left">
            <label
              htmlFor="origin"
              className="mb-2 text-sm font-medium text-gray-700"
            >
              Select origin
            </label>
            <select
              id="origin"
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              required
              className="h-10 rounded-md border border-gray-300 px-3 text-sm focus:border-[#5AB1F5] focus:outline-none bg-white"
            >
              <option value="" disabled>
                Select an origin
              </option>
              {locations.map((loc) => (
                <option
                  key={loc.value}
                  value={loc.value}
                  disabled={loc.value === formData.destination}
                >
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Destination */}
          <div className="flex flex-col text-left">
            <label
              htmlFor="destination"
              className="mb-2 text-sm font-medium text-gray-700"
            >
              Enter destination
            </label>
            <select
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
              className="h-10 rounded-md border border-gray-300 px-3 text-sm focus:border-[#5AB1F5] focus:outline-none bg-white"
            >
              <option value="" disabled>
                Select a destination
              </option>
              {locations.map((loc) => (
                <option
                  key={loc.value}
                  value={loc.value}
                  disabled={loc.value === formData.origin}
                >
                  {loc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Picker */}
          <div className="flex flex-col text-left relative" ref={datePickerRef}>
            <label
              htmlFor="date"
              className="mb-2 text-sm font-medium text-gray-700"
            >
              Choose date
            </label>
            <input
              type="text"
              id="date"
              readOnly
              value={
                dateRange[0]?.startDate && dateRange[0]?.endDate
                  ? `${formatDateSafe(dateRange[0].startDate)} | ${formatDateSafe(dateRange[0].endDate)}`
                  : ""
              }
              onClick={() => setDatePickerOpen(!isDatePickerOpen)}
              className="h-10 rounded-md border border-gray-300 px-3 text-sm focus:border-[#5AB1F5] focus:outline-none cursor-pointer"
            />
            {isDatePickerOpen && (
              <div className="absolute top-full mt-2 z-10">
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setDateRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                />
              </div>
            )}
          </div>

          {/* Budget */}
          <div className="flex flex-col text-left">
            <label
              htmlFor="budget"
              className="mb-2 text-sm font-medium text-gray-700"
            >
              Enter your budget (USD)
            </label>
            <input
              id="budget"
              name="budget"
              type="number"
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g., 1500"
              className="h-10 rounded-md border border-gray-300 px-3 text-sm focus:border-[#5AB1F5] focus:outline-none"
            />
          </div>

          {/* Spacer */}
          <div className="md:col-span-1"></div>

          {/* Next Button */}
          <div className="flex justify-end md:col-span-1">
            <button
              type="button"
              onClick={handleNextClick}
              className="w-40 h-10 rounded-full bg-[#5AB1F5] text-white text-sm font-semibold hover:bg-[#4098db] transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItineraryFirstStepForm;