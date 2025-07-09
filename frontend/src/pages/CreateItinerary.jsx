import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import ItineraryFirstStepForm from "../components/ItineraryFirstStepForm";
import ItinerarySecondStepForm from "../components/ItinerarySecondStepForm";
import ItineraryThirdStepForm from "../components/ItineraryThirdStepForm";
import useCreateItinerary from "../hooks/useCreateItinerary";

const initialFormData = {
  origin: "",
  destination: "",
  budget: "",
  dateRange: {
    startDate: null,
    endDate: null,
    key: "selection",
  },
  tripType: "",
  adults: 1,
  preferences: [],
};

const CreateItinerary = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);

  const {
    createItinerary,
    data: itineraryData,
    loading,
    error,
    reset,
  } = useCreateItinerary();
  const navigate = useNavigate();

  useEffect(() => {
    if (itineraryData) {
      navigate("/itinerary", { state: { itinerary: itineraryData } });
    }
  }, [itineraryData, navigate]);

  const handleNext = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleGenerate = (newData) => {
    const finalData = { ...formData, ...newData };

    // Defensive: ensure required fields are present
    const startDate = finalData.dateRange?.startDate
      ? new Date(finalData.dateRange.startDate)
      : null;
    const endDate = finalData.dateRange?.endDate
      ? new Date(finalData.dateRange.endDate)
      : null;

    if (!startDate || isNaN(startDate)) {
      alert("Start date is missing or invalid. Please return to the first step.");
      setStep(1);
      return;
    }
    if (!endDate || isNaN(endDate)) {
      alert("End date is missing or invalid. Please return to the first step.");
      setStep(1);
      return;
    }

    // Get user_id from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Build the payload for backend
    const payload = {
      user_id: user.id,
      origin: finalData.origin || "SJJ",
      destination: finalData.destination || "",
      budget: finalData.budget || "",
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
      adults: finalData.adults || 1,
      trip_type: finalData.tripType || "",
      preference_id: finalData.preferences || [],
      // Add other fields as needed
    };

    createItinerary(payload);
  };

  const handleReset = () => {
    setStep(1);
    setFormData(initialFormData);
    reset();
  };

  if (loading) {
    return <div className="text-center p-10">Generating your itinerary...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={handleReset}
          className="mt-4 px-4 py-2 bg-gray-300 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (itineraryData) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Your Itinerary is Ready!</h1>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(itineraryData, null, 2)}
        </pre>
        <button
          onClick={handleReset}
          className="mt-6 px-6 py-2 bg-[#5AB1F5] text-white rounded-lg hover:bg-[#4098db]"
        >
          Create Another Itinerary
        </button>
      </div>
    );
  }

  return (
    <div>
      {step === 1 && (
        <ItineraryFirstStepForm onNext={handleNext} initialData={formData} />
      )}
      {step === 2 && (
        <ItinerarySecondStepForm
          onNext={handleNext}
          onBack={handleBack}
          initialData={formData}
        />
      )}
      {step === 3 && (
        <ItineraryThirdStepForm
          onNext={handleGenerate}
          onBack={handleBack}
          initialData={formData}
        />
      )}
    </div>
  );
};

export default CreateItinerary;