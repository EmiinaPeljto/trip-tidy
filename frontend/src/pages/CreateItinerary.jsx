import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ItineraryFirstStepForm from '../components/ItineraryFirstStepForm';
import ItinerarySecondStepForm from '../components/ItinerarySecondStepForm';
import ItineraryThirdStepForm from '../components/ItineraryThirdStepForm';
import useCreateItinerary from '../hooks/useCreateItinerary';

const CreateItinerary = () => {
  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem('itineraryStep');
    return savedStep ? JSON.parse(savedStep) : 1;
  });

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('itineraryFormData');
    if (savedData) {
      const data = JSON.parse(savedData);
      // Re-hydrate date objects from strings
      if (data.dateRange) {
        data.dateRange.startDate = new Date(data.dateRange.startDate);
        data.dateRange.endDate = new Date(data.dateRange.endDate);
      }
      return data;
    }
    return {};
  });

  const { createItinerary, data: itineraryData, loading, error, reset } = useCreateItinerary();

  useEffect(() => {
    localStorage.setItem('itineraryStep', JSON.stringify(step));
  }, [step]);

  useEffect(() => {
    localStorage.setItem('itineraryFormData', JSON.stringify(formData));
  }, [formData]);

  const handleNext = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleGenerate = (newData) => {
    const finalData = { ...formData, ...newData };

    if (!finalData.dateRange?.startDate) {
      alert('Date information is missing. Please return to the first step.');
      setStep(1);
      return;
    }

    // Map frontend state to backend's expected snake_case format
    const payload = {
      origin: finalData.origin,
      destination: finalData.destination,
      budget: finalData.budget,
      start_date: format(finalData.dateRange.startDate, 'yyyy-MM-dd'),
      end_date: format(finalData.dateRange.endDate, 'yyyy-MM-dd'),
      adults: finalData.adults,
      trip_type: finalData.tripType,
      preference_id: finalData.preferences, // Assuming this is an array of IDs
    };

    createItinerary(payload);
  };

  const handleReset = () => {
    setStep(1);
    setFormData({});
    reset();
    localStorage.removeItem('itineraryStep');
    localStorage.removeItem('itineraryFormData');
  };

  // Render the generated itinerary or an error message
  if (loading) {
    return <div className="text-center p-10">Generating your itinerary...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-10">
        <p className="text-red-500">{error}</p>
        <button onClick={handleReset} className="mt-4 px-4 py-2 bg-gray-300 rounded-lg">Try Again</button>
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
        <button onClick={handleReset} className="mt-6 px-6 py-2 bg-[#5AB1F5] text-white rounded-lg hover:bg-[#4098db]">
          Create Another Itinerary
        </button>
      </div>
    );
  }

  // Render the multi-step form
  return (
    <div>
      {step === 1 && <ItineraryFirstStepForm onNext={handleNext} initialData={formData} />}
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
